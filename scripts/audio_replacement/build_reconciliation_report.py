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
    args=parser.parse_args();repo=args.repo;work=args.work
    out=repo/'docs/tcf/remplacement-audio/rapprochement-432'
    refs=read(work/'remaining-432-baseline.json');assert len(refs)==432
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
        assert sha(ref['current_file'])==ref['sha256'],'Current served audio changed'
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
    summary=dict(initial_unmatched_references=432,direct_transcriptions_completed=len(transcriptions),
        transcription_failures=0,independent_french_asr_checks=len(secondary),new_received_source_links=len(proposals),
        new_constant_offset_source_confirmations=constant,new_internally_edited_source_identifications=len(proposals)-constant,
        prepared_reference_links_total=len(merged),remaining_without_received_source=1318-len(merged),
        remaining_with_direct_current_audio_transcription=432-len(proposals),
        source_receipts_searched=834,distinct_source_files_searched=644,
        known_positive_controls=48,controls_retrieved_at_rank_one=48,
        candidate_pairs_examined=len(evidence['evidence']),
        full_waveform_or_first_8khz_anchor_checks=sum(r['status']!='coarse_signal_candidate_rejected' for r in evidence['evidence']),
        discovery_only_coarse_rejections=sum(r['status']=='coarse_signal_candidate_rejected' for r in evidence['evidence']),
        confirmed_wrong_audio_bindings=len(binding_mismatches),new_lossless_verified_assemblies=1,
        human_listening_performed=False,production_modified=False,bank_transcriptions_modified=False)
    meta=dict(schema_version=1,updated_at=dt.datetime.now(dt.timezone.utc).isoformat(),summary=summary)
    write(out/'etat.json',meta)
    write(out/'transcriptions.json',dict(schema_version=1,parameters=next(iter(actual.values()))['parameters'],
        timing_note='Native TDT word bounds are estimates on an 80 ms grid, not certified phonetic boundaries.',
        listening_performed=False,production_modified=False,sources=transcriptions),compact=True)
    write(out/'correspondances.json',dict(**meta,proposals=proposals,references=matches))
    write(out/'corrections-a-preparer.json',dict(schema_version=1,confirmed_binding_mismatches=binding_mismatches,
        question_revision_drafts=question_revision_drafts,bank_modified=False,listening_performed=False))
    write(out/'preuves-signal.json',evidence,compact=True)
    write(out/'controles-positifs.json',dict(fingerprint_ranks=control_ranks,
        coarse_calibration=read(work/'coarse-control-calibration.json'),
        waveform_checks=read(work/'positive-control-waveforms.json')))
    progress_path=repo/'docs/tcf/remplacement-audio/progression-unifiee.json';progress=read(progress_path)
    progress.update(updated_at=meta['updated_at'],signal_confirmed_old_refs=886+constant,
        old_refs_identified_with_internal_edits=len(proposals)-constant,
        old_refs_with_identified_source=len(merged),old_refs_with_prepared_candidate=len(merged),
        old_refs_remaining_unmatched=1318-len(merged),assembled_mp3_candidates=14,
        initial_signal_confirmed_refs=672+sum(p['source_batch']=='initial' and p['signal_status']=='signal_source_confirmed' for p in proposals),
        additional_signal_confirmed_refs=451+sum(p['source_batch']=='additional' and p['signal_status']=='signal_source_confirmed' for p in proposals),
        additional_refs_not_in_initial=214+sum(p['source_batch']=='additional' for p in proposals),
        current_audio_refs_directly_retranscribed=432,current_audio_retranscription_failures=0,
        current_audio_refs_retranscribed_without_received_source=432-len(proposals),reconciliation_432_report='rapprochement-432/etat.json')
    write(progress_path,progress)
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':main()
