#!/usr/bin/env python3
"""Export a portable account of received sources, real cuts and unresolved work."""
import argparse
import collections
import csv
import datetime as dt
import html
import json
from pathlib import Path


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path, data, compact=False):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=None if compact else 2,
                               separators=(',',':') if compact else None)+'\n', encoding='utf-8')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, default=Path('/workspace/work/tcf-audio-replacement'))
    parser.add_argument('--out', type=Path, default=Path(__file__).resolve().parents[2]/'docs/tcf/remplacement-audio')
    args = parser.parse_args()
    work, out = args.work.resolve(), args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    catalogue = read(work/'source-catalogue.json')
    progress = read(work/'source-asr-parakeet/batch-progress.json')
    plans = read(work/'plans-native-final/segmentation-index.json')
    matches = read(work/'source-dialogue-candidates.json')
    acoustic = read(work/'acoustic-source-evidence.json')
    prepared_path = work/'staged-boundaries-work/batch-progress.json'
    prepared = read(prepared_path) if prepared_path.exists() else {'sources': []}
    mp3_path = work/'staged-boundaries-work/mp3-index.json'
    mp3_index = read(mp3_path) if mp3_path.exists() else {'sources': []}
    mp3_segments = {segment['id']:segment for source in mp3_index['sources'] for segment in source['segments']}
    plan_by_id = {row['source_id']: row for row in plans['sources']}
    prepared_by_id = {row['source_id']: row for row in prepared['sources']}
    signals = {(row['old_ref'], row['source_id']): row for row in acoustic['evidence']}
    sources, transcripts, cuts = [], [], []
    for source in catalogue['sources']:
        sid = source['source_id']
        sources.append({key: source[key] for key in ['source_id','file_id','level','collection','track',
                       'original_filename','sha256','size_bytes','duration_seconds','sample_rate','channels']})
        sources[-1]['original_relative_path'] = 'incoming/'+source['level']+'/'+source['original_filename']
        sources[-1]['integrity'] = 'full_ffmpeg_decode_passed' if not source.get('integrity_errors') else 'requires_review'
        plan = read(plan_by_id[sid]['plan_path'])
        asr_path=Path(plan['provenance'].get('asr_path',work/'source-asr-parakeet'/f'{sid}.json'))
        asr = read(asr_path)
        transcripts.append({'source_id':sid, 'source_sha256':source['sha256'], 'text':asr['text'],
                            'quality':'automatic_draft_requires_listening',
                            'word_timing_method':asr['word_timing_method'], 'words':plan['words']})
        generated = prepared_by_id.get(sid, {})
        manifest = read(generated['manifest']) if generated.get('manifest') else None
        artifacts = {row['id']:row for row in manifest['segments']} if manifest else {}
        for segment in plan['segments']:
            row = {'source_id':sid, **segment, 'classification_method':plan['provenance']['classification_method'],
                   'geometry_status':plan_by_id[sid]['plan_integrity'],
                   'geometry_blocker':plan_by_id[sid].get('blocker'),
                   'status':'needs_review' if segment['id'] in artifacts else 'not_generated',
                   'listening_performed':False}
            if segment['id'] in artifacts:
                art = artifacts[segment['id']]
                row.update(start_seconds=art['start_seconds'], end_seconds=art['end_seconds'],
                           audio_sha256=art['audio']['sha256'], pcm_sha256=art['audio'].get('pcm_sha256'),
                           integrity=generated['integrity'])
            if segment['id'] in mp3_segments:
                mp3 = mp3_segments[segment['id']]
                row['delivery_mp3'] = {key:mp3[key] for key in ['sha256','probe','name','tags','status']}
                row['delivery_mp3']['work_relative_file'] = str(Path(mp3['file']).relative_to(work))
            cuts.append(row)
    write(out/'sources.json', {'schema_version':1, 'summary':catalogue['summary'], 'sources':sources})
    write(out/'transcriptions.json', {'schema_version':1, 'listening_performed':False, 'sources':transcripts}, compact=True)
    write(out/'decoupes.json', {'schema_version':1, 'listening_performed':False, 'segments':cuts})
    slim_matches, csv_rows = [], []
    for match in matches['matches']:
        candidates = []
        for candidate in match['candidates']:
            if candidate['score'] < .65:
                continue
            signal = signals.get((match['old_ref'],candidate['source_id']),{})
            item = {key:candidate[key] for key in ['source_id','source_sha256','score','target_token_coverage',
                    'source_token_precision','word_first','word_last','start_estimated_seconds','end_estimated_seconds',
                    'matched_text','review_flags','digit_form_comparison','question_answer_review']}
            item['signal_status'] = signal.get('status','not_compared')
            item['signal_source_offset_seconds'] = signal.get('source_offset_seconds')
            candidates.append(item)
        slim_matches.append({'old_ref':match['old_ref'], 'dialogue_id':match['dialogue_id'],
                             'exercise_ids':match['exercise_ids'], 'status':match['status'],
                             'proposed_ref':match['old_ref'], 'candidates':candidates})
        first = candidates[0] if candidates else {}
        csv_rows.append({'ancienne_reference':match['old_ref'], 'reference_proposee':match['old_ref'],
                         'identifiant_dialogue':match['dialogue_id'], 'exercices':';'.join(match['exercise_ids']),
                         'statut':match['status'], 'source_id':first.get('source_id',''),
                         'score_lexical':first.get('score',''), 'preuve_signal':first.get('signal_status',''),
                         'debut_estime':first.get('start_estimated_seconds',''),
                         'fin_estimee':first.get('end_estimated_seconds',''),
                         'validation_ecoute':'a_faire'})
    write(out/'correspondances.json', {'schema_version':1, 'summary':matches['summary'], 'matches':slim_matches})
    write(out/'preuves-signal.json', {'schema_version':1, 'summary':acoustic['summary'],
                                    'evidence':[{key:value for key,value in row.items() if key!='source_file'}
                                                for row in acoustic['evidence']]})
    secondary = []
    by_hash = {source['sha256']:source for source in sources}
    link_file = work/'whisper-candidate-links.json'
    links = {row['candidate_sha256']:row for row in read(link_file)} if link_file.exists() else {}
    for directory in ('source-asr-whisper-targeted','source-asr-whisper-candidates'):
        if not (work/directory).exists():
            continue
        for path in sorted((work/directory).glob('*.json')):
            doc = read(path)
            original = by_hash.get(doc.get('source_sha256'))
            link = links.get(doc.get('source_sha256'))
            if not original and not link:
                continue
            sid = original['source_id'] if original else link['source_id']
            original_asr = read(work/'source-asr-parakeet'/f'{sid}.json')
            text = doc.get('text','')
            secondary.append({'source_id':sid,'input_kind':'original' if original else 'prepared_candidate',
                              'input_sha256':doc.get('source_sha256'),'parakeet_original':original_asr['text'],
                              'whisper':text,'status':'automatic_comparison_requires_listening',
                              'may_be_incomplete':len(text.split())<.6*len(original_asr['text'].split()),
                              'word_timestamps_available':False,'listening_performed':False})
    write(out/'double-transcription.json',{'schema_version':1,'sources':secondary,'listening_performed':False})
    proposals_path=work/'proposed-replacements-work/proposals.json'
    proposals=read(proposals_path) if proposals_path.exists() else {}
    if proposals:
        for row in proposals['proposals']:
            if row.get('candidate_mp3'):
                row['candidate_work_file']=str(Path(row.pop('candidate_mp3')).relative_to(work))
        write(out/'remplacements-prepares.json',proposals)
    baseline_path=work/'refinement-work/baseline.json'
    refinement=None
    if baseline_path.exists():
        baseline=read(baseline_path)
        by_ref={row['old_ref']:row for row in proposals.get('proposals',[])}
        resolved=[ref for ref in baseline['unrefined_refs'] if by_ref.get(ref,{}).get('candidate_work_file')]
        realigned=[]
        for item in baseline['blocked_sources']:
            sid=item['source_id'];record=plan_by_id[sid];plan=read(record['plan_path'])
            realigned.append({'source_id':sid,'previous_issues':item['issues'],
                              'geometry_status':record['plan_integrity'],
                              'timing_method':plan['provenance']['word_timing_method'],
                              'coarticulation_groups':sum(bool(w.get('alignment_group')) for w in plan['words']),
                              'asr_file_sha256':plan['provenance']['asr_sha256'],
                              'listening_performed':False})
        refinement={'schema_version':1,'requested_passages':len(baseline['unrefined_refs']),
                    'resolved_passages':len(resolved),'remaining_passages':len(baseline['unrefined_refs'])-len(resolved),
                    'resolved_old_refs':resolved,'realigned_sources':realigned,
                    'remaining_blocked_sources':sum(r['geometry_status']!='passed' for r in realigned),
                    'listening_performed':False,'production_modified':False}
        write(out/'reprises-et-realignements.json',refinement)
    assembly_path=work/'refinement-work/assembled-candidates.json'
    assemblies=read(assembly_path)['assemblies'] if assembly_path.exists() else []
    portable_assemblies=[]
    for item in assemblies:
        row=dict(item)
        row['work_relative_file']=str(Path(row.pop('file')).relative_to(work))
        row['work_relative_part_manifest']=str(Path(row.pop('part_manifest')).relative_to(work))
        portable_assemblies.append(row)
    write(out/'assemblages.json',{'schema_version':1,'assemblies':portable_assemblies,'listening_performed':False})
    with (out/'remplacements-proposes.csv').open('w',encoding='utf-8',newline='') as handle:
        writer = csv.DictWriter(handle,fieldnames=list(csv_rows[0]),lineterminator='\n')
        writer.writeheader();writer.writerows(csv_rows)
    summary = {'schema_version':1, 'updated_at':dt.datetime.now(dt.timezone.utc).isoformat(),
               'received_sources':len(sources), 'received_levels':catalogue['summary']['by_level'],
               'source_seconds':catalogue['summary']['duration_seconds'],
               'source_integrity_checked':catalogue['summary']['integrity_checked'],
               'transcribed_sources':progress['transcribed'], 'transcription_failures':progress['failed'],
               'source_words':sum(len(row['words']) for row in transcripts),
               'planned_segments':len(cuts), 'geometrically_blocked_sources':plans['plans_requiring_correction'],
               'prepared_sources':prepared.get('prepared_sources',0),
               'prepared_segments':prepared.get('prepared_segments',0),
               'mp3_candidates':mp3_index.get('mp3_count',0),
               'assembled_mp3_candidates':len(assemblies),
               'preparation_complete':prepared.get('complete',False),
               'signal_confirmed_old_refs':len({row['old_ref'] for row in acoustic['evidence']
                                              if row['status']=='signal_source_confirmed'}),
               'old_refs_with_prepared_candidate':proposals.get('references_with_prepared_candidate',0),
               'old_refs_requiring_more_segmentation':proposals.get('references_requiring_more_segmentation',0),
               'candidate_alias_groups_to_review':proposals.get('candidate_alias_groups',0),
               'requested_refinements':refinement,
               'current_old_refs':matches['summary']['current_unique_audio_urls'],
               'lexical_matching':matches['summary']['status_counts'],
               'validated_by_listening':0, 'live_database_inspected':False, 'production_modified':False,
               'full_replacement_complete':False, 'further_sources_expected':True,
               'blockers':['Écoute effective des quatre frontières et du fichier final non réalisée ici.',
                           'Correspondances non résolues ou ambiguës ; aucune affectation automatique.',
                           'Accès à la base Cloudflare D1 distante non configuré ; recettes non migrées.']}
    write(out/'etat.json',summary)
    rows = []
    for source in sources:
        item=prepared_by_id.get(source['source_id'],{})
        if item.get('manifest'):
            review=Path(item['manifest']).parent/'review.html'
            if review.with_name('review-mp3.html').exists():
                review=review.with_name('review-mp3.html')
            href=str(review.relative_to(work/'staged-boundaries-work'))
            rows.append(f'<li><a href="{html.escape(href,quote=True)}">{html.escape(source["original_filename"])}</a> '
                        f'— {item["segments"]} extrait(s), écoute à faire</li>')
    (work/'staged-boundaries-work/review-index.html').write_text(
        '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Contrôle des audios reçus</title>'
        '<style>body{font:17px system-ui;max-width:1000px;margin:2rem auto;padding:1rem}li{margin:.6rem 0}</style>'
        '<h1>Contrôle des audios reçus</h1><p>Fichiers candidats. Aucune écoute ou validation finale déclarée. '
        'Chaque page contient la transcription, le signal, le candidat complet et les quatre fenêtres de frontière.</p>'
        '<ul>'+''.join(rows)+'</ul></html>',encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':
    main()
