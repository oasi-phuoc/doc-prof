#!/usr/bin/env python3
"""Publish direct retranscriptions and verified source links, without changing production."""
import argparse
import collections
import datetime as dt
import hashlib
import json
from pathlib import Path
import re

if __package__:
    from .match_sources import norm_words, lexical_alignment
else:
    from match_sources import norm_words, lexical_alignment


def read(path):
    return json.loads(Path(path).read_text())


def write(path, data, compact=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=None if compact else 2)+'\n')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def transcript_flags(bank_text, current_text):
    old, new = norm_words(bank_text), norm_words(current_text)
    alignment = lexical_alignment(old, new) if old and new else None
    coverage = alignment['target_token_coverage'] if alignment else 0
    flags = []
    if coverage < .6:
        flags.append('low_bank_transcript_coverage_review_not_automatic_error')
    if re.search(r'(?i)\b(?:page\s+\d+|exercice\s+\d+|dialogue\s+numéro|puis\s+répondez|lisez\s+les\s+questions)\b', current_text):
        flags.append('instruction_or_numbering_candidate')
    if re.search(r'(?i)\b(?:september|the|this|you|with|they|for|and)\b|<unk>', current_text):
        flags.append('asr_language_or_unknown_token_requires_review')
    if len(new) <= 3:
        flags.append('very_short_content_do_not_invent_extra_questions')
    if len(new)>20:
        half=len(new)//2
        repeated=lexical_alignment(new[:half],new[half:])
        if repeated and repeated['target_token_coverage']>.75:
            flags.append('possible_repeated_reading')
    return dict(bank_token_coverage=round(coverage,4), flags=flags,
                semantic_correctness_certified=False)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
    parser.add_argument('--work',type=Path,required=True)
    parser.add_argument('--grammar-search',type=Path,help='Optional read-only source-identity search in the later grammar import')
    parser.add_argument('--prepared-grammar',type=Path,help='Source-bound grammar cut delivery; identities alone do not count as cuts')
    args=parser.parse_args();repo=args.repo;work=args.work
    out=repo/'docs/tcf/remplacement-audio/rapprochement-432'
    retirement_path=repo/'docs/tcf/remplacement-audio/retrait-297-references-20261104.json'
    retirement=read(retirement_path) if retirement_path.exists() else {}
    retired={r['old_ref']:r for r in retirement.get('audios',[])} if retirement.get('status')=='applied' else {}
    applied_path=repo/'docs/tcf/remplacement-audio/corrections-appliquees-20261104.json'
    applied=read(applied_path) if applied_path.exists() else {}
    current_exercises={e['id']:e for bank in (repo/'src/tcf/content').glob('*/co.json') for e in read(bank)}
    corrected={r['after']['id']:r for r in applied.get('exercises',[])
        if applied.get('production_modified') and current_exercises.get(r['after']['id'])==r['after']}
    applied_aliases=applied.get('audio_reference_aliases',{}) if len(corrected)==len(applied.get('exercises',[])) else {}
    refs=read(work/'remaining-432-baseline.json');assert len(refs)==432
    extension_file=out/'extension-127/liaisons-a-decouper.json'
    if args.grammar_search:
        catalogue=read(args.grammar_search/'source-catalogue.json')['sources']
        src={r['source_id']:r for r in catalogue};old={r['old_ref']:r for r in refs}
        extra_evidence=read(args.grammar_search/'waveform-evidence.json')
        extra_links=[]
        for proof in extra_evidence['evidence']:
            if proof['status']!='signal_source_confirmed':continue
            source=src[proof['source_id']];ref=old[proof['old_ref']]
            assert source['sha256']==proof['source_sha256'] and ref['sha256']==proof['old_sha256']
            assert sha(source['source_file'])==source['sha256']
            assert len([a for a in proof['anchors'] if a['correlation']>=.8])>=3
            assert proof['offset_spread_seconds']<=.04
            extra_links.append(dict(old_ref=ref['old_ref'],old_sha256=ref['sha256'],
                exercise_ids=list(dict.fromkeys(u['exercise_id'] for u in ref['uses'])),
                source_id=source['source_id'],source_sha256=source['sha256'],
                source_audio=source['original_receipt']['audio'],original_filename=source['original_filename'],
                source_upload_id=source['original_receipt']['upload_id'],
                status='source_identified_requires_segmentation_and_question_review',
                reference_window_estimate=dict(start_seconds=proof['source_offset_seconds'],
                    end_seconds=proof['source_offset_seconds']+proof['old_duration_decoded'],
                    is_validated_cut=False),signal_evidence=proof,
                listening_performed=False,production_modified=False))
        assert len(extra_links)==len({r['old_ref'] for r in extra_links})
        write(extension_file,dict(schema_version=1,source_entries=len(catalogue),links=extra_links))
        write(extension_file.parent/'sources.json',dict(schema_version=1,status='grammar_originals_consulted_read_only',sources=catalogue))
        write(extension_file.parent/'preuves-signal.json',extra_evidence,compact=True)
    extension=read(extension_file) if extension_file.exists() else dict(source_entries=0,links=[])
    extended={r['old_ref']:r for r in extension['links']}
    extra_proofs_path=out/'extension-127/preuves-signal.json'
    extra_attempts=read(extra_proofs_path)['evidence'] if extra_proofs_path.exists() else []
    source_hashes={s['sha256'] for s in read(work/'fingerprint-source-index.json')['sources']}
    extension_sources=out/'extension-127/sources.json'
    if extension_sources.exists():source_hashes.update(s['sha256'] for s in read(extension_sources)['sources'])
    actual={d['source_sha256']:d for p in (work/'current-asr-parakeet').glob('current:*.json')
            if (d:=read(p)).get('status')=='transcribed'}
    assert len(actual)==432,'Finish every direct transcription before publication'
    native={x['old_ref']:x for x in read(work/'matching-native-sources/source-dialogue-candidates.json')['matches']}
    internal={x['old_ref']:x for x in read(work/'matching-current-recordings/source-dialogue-candidates.json')['matches']}
    evidence=read(work/'waveform-evidence.json')
    positives={r['old_ref']:r for r in evidence['evidence'] if r['status'].startswith('signal_source_')}
    proposals=read(work/'reconciliation-new-proposals.json')
    assert {r['old_ref'] for r in proposals}==set(positives)
    roots={'initial':Path('/workspace/work/tcf-audio-replacement'),
           'additional':Path('/workspace/work/tcf-audio-additional-20261102-work')}
    secondary={d['source_sha256']:d for p in (work/'current-asr-whisper-fr').glob('*.json')
               if (d:=read(p)).get('status')=='transcribed'}
    transcriptions=[];matches=[];binding_mismatches=[];question_revision_drafts=[]
    byref={r['old_ref']:r for r in refs}
    for ref in refs:
        data=actual[ref['sha256']]
        if ref['old_ref'] in retired:
            assert retired[ref['old_ref']]['sha256']==ref['sha256'] and not Path(ref['current_file']).exists()
        else:assert sha(ref['current_file'])==ref['sha256'],'Current served audio changed'
        review=transcript_flags(ref['transcript_variants'][0],data['text'])
        item=dict(old_ref=ref['old_ref'],audio_sha256=ref['sha256'],
                  exercise_ids=list(dict.fromkeys(u['exercise_id'] for u in ref['uses'])),
                  duration_seconds=data['duration_seconds'],status='direct_automatic_transcription_requires_review',
                  text=data['text'],bank_transcript_variants=ref['transcript_variants'],
                  comparison=review,source_asr_file_sha256=sha(work/'current-asr-parakeet'/('current:'+ref['sha256'][:20]+'.json')),
                  words=[dict(text=w['word'],start=w['start'],end=w['end']) for w in data['words']],
                  listening_performed=False)
        if ref['sha256'] in secondary:
            item['independent_french_asr']=dict(text=secondary[ref['sha256']]['text'],engine='sherpa-onnx Whisper small INT8, forced French',status='independent_automatic_draft_not_listening')
        transcriptions.append(item)
        if ref['old_ref'] in retired:item.update(status='retired_at_user_request_historical_transcription_only',currently_in_library=False)
        lexical=native[ref['old_ref']]
        candidate_rows=[{k:c[k] for k in ['source_id','source_sha256','score','matched_text','plan_sha256'] if k in c}
                        for c in lexical['candidates'] if c['score']>=.6]
        best=internal[ref['old_ref']]['candidates'][:2]
        match=dict(old_ref=ref['old_ref'],audio_sha256=ref['sha256'],
                   status='received_source_identified_candidate_prepared' if ref['old_ref'] in positives else 'received_source_not_found_current_audio_retranscribed',
                   native_text_candidates=candidate_rows,
                   bank_to_current_recording_candidates=[dict(source_id=c['source_id'],score=c['score'],
                        old_ref='/'+str(Path(c['source_file']).relative_to(repo/'public')),
                        matched_text=c['matched_text']) for c in best],
                   listening_performed=False)
        if ref['old_ref'] in positives:match['source_identity_evidence']=positives[ref['old_ref']]
        elif ref['old_ref'] in extended:
            match.update(status='source_identified_segmentation_pending',source_identity_evidence=extended[ref['old_ref']]['signal_evidence'],
                         source_audio=extended[ref['old_ref']]['source_audio'])
        name=Path(ref['old_ref']).name
        expected_topics={'les-situations-du-quotidien-3-2.mp3':'Achat de cerises : prix au kilo et quantité',
            'les-situations-du-quotidien-3-3.mp3':'Rendez-vous de médecine du travail',
            'les-situations-du-quotidien-3-4.mp3':'Essayage d’une robe en taille 38'}
        if name in expected_topics:
            other=secondary[ref['sha256']]['text']
            actual_topic='restaurant d’entreprise' if name.endswith('3-2.mp3') else 'achat de cerises'
            keyword='restaurant' if name.endswith('3-2.mp3') else 'cerise'
            assert keyword in data['text'].lower() and keyword in other.lower()
            issue=dict(old_ref=ref['old_ref'],exercise_ids=item['exercise_ids'],
                status='wrong_audio_question_binding_corroborated_by_two_independent_asr_runs',
                expected_topic_from_bank=expected_topics[name],actual_topic=actual_topic,
                bank_transcript=ref['transcript_variants'][0],direct_asr_quote=data['text'],
                independent_french_asr_quote=other,
                next_action='Rétablir le passage sonore correspondant aux questions ; aucune réponse du thème absent ne doit être inventée.',
                human_listening_performed=False)
            binding_mismatches.append(issue);match['binding_issue']=issue
            if 'tcf-a1-sem1-co-2' in corrected:
                issue.update(status='historical_mismatch_corrected_with_authentic_recordings_and_revised_questions',
                    corrected=True,correction_report='../corrections-appliquees-20261104.json',
                    next_action='Liaison corrigée dans la banque ; contrôle d’écoute humaine non attesté.')
        if name=='bonjour-voudrais-tickets-1.mp3':
            def question(prompt,answers):
                return dict(enonce=prompt,type_reponse='qcm_texte',melanger=True,
                    choix=[dict(id=key,texte=text,correct=i==0) for i,(key,text) in enumerate(zip('abc',answers))])
            question_revision_drafts.append(dict(old_ref=ref['old_ref'],exercise_ids=item['exercise_ids'],
                status='draft_requires_instruction_cut_and_bank_review',current_audio_sha256=ref['sha256'],
                reason='La banque interroge seulement Page 99 et Exercice 4 ; le contenu utile est une demande de tickets de métro.',
                source_quotes=[data['text'],secondary[ref['sha256']]['text']],
                proposed_questions=[
                    question('Que souhaite acheter la personne ?',['Des tickets de métro','Des billets de train','Des billets d’avion']),
                    question('Dans quelle ville la personne doit-elle se déplacer ?',['À Bordeaux','À Lille','À Lyon']),
                    question('Pourquoi le vendeur conseille-t-il un passe ou un carnet ?',['Parce que la personne a beaucoup de trajets à faire','Parce que la personne voyage avec un groupe','Parce que la personne a perdu ses billets']),
                    question('Pour quelle durée le passe proposé est-il valable ?',['Pour une journée','Pour une semaine','Pour un mois'])],
                bank_modified=False,listening_performed=False))
            if 'tcf-ss-a1-s44-co-4' in corrected:
                question_revision_drafts[-1].update(status='applied_four_content_questions_and_clean_audio',bank_modified=True)
        matches.append(match)
    # Only prepared, byte-bound links with independently proved source identity
    # are added. Direct ASR by itself never creates a replacement mapping.
    for proposal in proposals:
        proof=positives[proposal['old_ref']]
        assert proof['old_sha256']==byref[proposal['old_ref']]['sha256']
        assert proposal['source_sha256']==proof['source_sha256']
        strong=[a for a in proof['anchors'] if a['correlation']>=.8]
        assert len(strong)>=3
        if proof['status']=='signal_source_confirmed':assert proof['offset_spread_seconds']<=.04
        else:assert all(b['source_anchor_start']>a['source_anchor_start'] for a,b in zip(strong,strong[1:]))
        assert sha(roots[proposal['source_batch']]/proposal['candidate_work_file'])==proposal['candidate_sha256']
        tokens=norm_words(actual[byref[proposal['old_ref']]['sha256']]['text'])
        alignment=lexical_alignment(tokens,norm_words(proposal['proposed_transcription']))
        proposal['lexical_score']=alignment['score'] if alignment else 0
        proposal['lexical_score_basis']='direct_current_asr_vs_explicitly_selected_prepared_cut'
    unified_path=repo/'docs/tcf/remplacement-audio/liaisons-unifiees.json';unified=read(unified_path)
    merged={r['old_ref']:r for r in unified['proposals']}
    for proposal in proposals:
        old=merged.get(proposal['old_ref'])
        assert old is None or old.get('reconciliation_batch')=='20261104_remaining_432'
        merged[proposal['old_ref']]=proposal
    grammar_delivery=read(args.prepared_grammar) if args.prepared_grammar else None
    if grammar_delivery:
        for proposal in grammar_delivery['proposals']:
            identity=extended[proposal['old_ref']]
            assert identity['source_sha256']==proposal['source_sha256']
            assert sha(Path(grammar_delivery['work_root'])/proposal['candidate_work_file'])==proposal['candidate_sha256']
            previous=merged.get(proposal['old_ref'])
            assert previous is None or previous.get('reconciliation_batch')=='20261104_grammar_131'
            merged[proposal['old_ref']]=proposal
    for ref,new_ref in applied_aliases.items():
        if ref in merged:
            candidate=merged[ref]
            delivery=next(r for r in applied['audios'] if r['destination']==new_ref)
            assert candidate['candidate_sha256']==delivery['sha256']
            candidate['proposed_ref']=new_ref
            candidate['bank_correction_applied']=True
    for match in matches:
        if match['old_ref'] in merged:
            match['status']='received_source_identified_candidate_prepared'
            match['candidate_sha256']=merged[match['old_ref']]['candidate_sha256']
        if match['old_ref'] in retired:match['status']='retired_at_user_request'
    unified.update(prepared_references=len(merged),proposals=list(merged.values()))
    write(unified_path,unified)
    # Register the extra assembly alongside the earlier immutable deliveries.
    assembly=read(work/'school-assembly-integrated.json')
    ap=roots['initial']/'refinement-work/assembled-candidates.json';assemblies=read(ap)
    previous=[r for r in assemblies['assemblies'] if r['source_id']==assembly['source_id']]
    assert not previous or previous[0]['sha256']==assembly['sha256']
    if not previous:assemblies['assemblies'].append(assembly);write(ap,assemblies)
    constant=sum(p['signal_status']=='signal_source_confirmed' for p in proposals)
    discovery=read(work/'recording-discovery.json');controls=read(work/'positive-controls.json')
    baseline_known={r['old_ref']:r for r in unified['proposals'] if r['old_ref'] not in byref}
    assert len(baseline_known)==886
    control_ranks=[next((i+1 for i,c in enumerate(next(x for x in discovery['matches'] if x['old_ref']==control['old_ref'])['candidates'])
                         if c['source_sha256']==baseline_known[control['old_ref']]['source_sha256']),None) for control in controls]
    assert len(control_ranks)==48 and all(rank==1 for rank in control_ranks)
    all_identified=set(merged)|set(extended)
    unresolved_active=set(byref)-all_identified-set(retired)
    pending_extended={key:value for key,value in extended.items() if key not in merged}
    write(repo/'docs/tcf/remplacement-audio/identites-sources-unifiees.json',dict(schema_version=1,
        identified_references=len(all_identified),prepared_references=len(merged),
        references=[dict(old_ref=r['old_ref'],source_id=r['source_id'],source_sha256=r['source_sha256'],
            status='prepared_candidate_requires_listening_and_question_review',candidate_sha256=r['candidate_sha256'])
            for r in merged.values()]+list(pending_extended.values())))
    summary=dict(initial_unmatched_references=432,direct_transcriptions_completed=len(transcriptions),
        transcription_failures=0,independent_french_asr_checks=len(secondary),new_received_source_links=len(proposals),
        new_constant_offset_source_confirmations=constant,new_internally_edited_source_identifications=len(proposals)-constant,
        additional_read_only_grammar_source_entries=extension['source_entries'],
        additional_source_identities=len(extended),new_source_identities_total=len(proposals)+len(extended),
        prepared_reference_links_total=len(merged),identified_reference_links_total=len(all_identified),
        identified_references_pending_segmentation=len(pending_extended),remaining_without_received_source=len(unresolved_active),
        remaining_with_direct_current_audio_transcription=len(unresolved_active),
        historical_unmatched_references_retired=len(retired),
        source_receipts_searched=834+extension['source_entries'],distinct_source_files_searched=len(source_hashes),
        known_positive_controls=48,controls_retrieved_at_rank_one=48,
        candidate_pairs_examined=len(evidence['evidence'])+len(extra_attempts),
        full_waveform_or_first_8khz_anchor_checks=sum(r['status']!='coarse_signal_candidate_rejected' for r in evidence['evidence']+extra_attempts),
        discovery_only_coarse_rejections=sum(r['status']=='coarse_signal_candidate_rejected' for r in evidence['evidence']+extra_attempts),
        confirmed_wrong_audio_bindings=sum(not r.get('corrected') for r in binding_mismatches),
        historical_wrong_audio_bindings_corrected=sum(bool(r.get('corrected')) for r in binding_mismatches),
        new_lossless_verified_assemblies=1,
        human_listening_performed=False,production_modified=bool(corrected),bank_transcriptions_modified=bool(corrected))
    meta=dict(schema_version=1,updated_at=dt.datetime.now(dt.timezone.utc).isoformat(),summary=summary)
    write(out/'etat.json',meta)
    write(out/'transcriptions.json',dict(schema_version=1,parameters=next(iter(actual.values()))['parameters'],
        timing_note='Native TDT word bounds are estimates on an 80 ms grid, not certified phonetic boundaries.',
        listening_performed=False,production_modified=False,sources=transcriptions),compact=True)
    write(out/'correspondances.json',dict(**meta,proposals=proposals,references=matches))
    write(out/'corrections-a-preparer.json',dict(schema_version=1,confirmed_binding_mismatches=binding_mismatches,
        question_revision_drafts=question_revision_drafts,bank_modified=bool(corrected),listening_performed=False))
    write(out/'preuves-signal.json',evidence,compact=True)
    write(out/'controles-positifs.json',dict(fingerprint_ranks=control_ranks,
        coarse_calibration=read(work/'coarse-control-calibration.json'),
        waveform_checks=read(work/'positive-control-waveforms.json')))
    progress_path=repo/'docs/tcf/remplacement-audio/progression-unifiee.json';progress=read(progress_path)
    progress.update(updated_at=meta['updated_at'],signal_confirmed_old_refs=886+constant+len(extended),
        old_refs_identified_with_internal_edits=len(proposals)-constant,
        old_refs_with_identified_source=len(all_identified),old_refs_with_prepared_candidate=len(merged),
        old_refs_identified_pending_segmentation=len(pending_extended),
        old_refs_remaining_unmatched=len(unresolved_active),assembled_mp3_candidates=14,
        initial_signal_confirmed_refs=672+sum(p['source_batch']=='initial' and p['signal_status']=='signal_source_confirmed' for p in proposals),
        additional_signal_confirmed_refs=451+sum(p['source_batch']=='additional' and p['signal_status']=='signal_source_confirmed' for p in proposals),
        additional_refs_not_in_initial=214+sum(p['source_batch']=='additional' for p in proposals),
        current_audio_refs_directly_retranscribed=432,current_audio_retranscription_failures=0,
        current_audio_refs_retranscribed_without_received_source=len(unresolved_active),
        shared_grammar_sources_consulted_read_only=extension['source_entries'],
        shared_grammar_signal_confirmed_refs=len(extended),
        reconciliation_432_report='rapprochement-432/etat.json')
    if grammar_delivery:
        progress.update(planned_segments=1548+grammar_delivery['lossless_cuts'],
            prepared_flac_segments=1548+grammar_delivery['lossless_cuts'],
            prepared_mp3_segments=1548+grammar_delivery['mp3_candidates'],
            grammar_original_sources_transcribed=127,grammar_original_sources_preserved=127,
            grammar_source_cut_candidates=grammar_delivery['mp3_candidates'],
            grammar_source_prepared_refs=grammar_delivery['reference_count'])
        progress['preferred_plan_indexes']['grammar']=grammar_delivery['preferred_plan_index']
    if corrected:
        progress.update(production_modified=True,corrected_exercises_with_clean_audio=len(corrected),
            audio_replacements_applied=len(applied['audios']),
            question_additions=3+sum(len(r['after']['questions'])-len(r['before']['questions']) for r in corrected.values()),
            current_recording_fallback_cuts_prepared=2,
            planned_segments=1681,prepared_flac_segments=1681,prepared_mp3_segments=1681,
            received_source_prepared_segments=1679,
            applied_corrections_report='corrections-appliquees-20261104.json')
    if retired:
        active={ref for e in current_exercises.values() for ref in (e['support'].get('audios') or [e['support'].get('audio')]) if ref}
        progress.update(historical_unmatched_refs_retired=len(retired),
            retired_exercises=retirement['summary']['exercises_removed'],
            retired_questions=retirement['summary']['questions_removed'],
            active_current_library_audio_refs=len(active),retirement_report='retrait-297-references-20261104.json')
    write(progress_path,progress)
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':main()
