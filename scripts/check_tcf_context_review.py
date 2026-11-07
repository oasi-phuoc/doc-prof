"""Verify source-bound editorial decisions and image activations exhaustively."""
import argparse
from collections import Counter
from copy import deepcopy
import json

from tcf_context_audit import ROOT,BANKS,REPORT,digest,semantic_question,source_for,text_form
from tcf_replace_vocabulary_images import checked_images
from tcf_context_images import PLAN,JOURNAL


def at(value,node):
    for key in node:value=value[key]
    return value


def verify(refresh=False):
    editorial=json.loads(REPORT.read_text());rows={r['key']:r for r in editorial['questions']}
    plan=json.loads(PLAN.read_text());plans={r['key']:r for r in plan['questions']}
    journal=json.loads(JOURNAL.read_text());operations=journal['operations']
    reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
    byex={};seen=set();changed_questions=[]
    for bank in BANKS:
        for ex in json.loads(bank.read_text()):
            byex[ex['id']]=ex
            for i,q in enumerate(ex.get('questions',[]),1):
                key=f"{ex['id']}#{i}";seen.add(key);row=rows[key];source,_=source_for(ex,q)
                assert row['source_sha256']==digest(source),key
                assert row['status']!='pending_fresh_context_review',key
                actual=digest(semantic_question(q))
                if row['semantic_sha256']!=actual:
                    p=plans[key]
                    assert p['requested_text_edits'] and row['semantic_sha256']==p['semantic_before_sha256'] and actual==p['semantic_after_sha256'],key
                    assert refresh or row.get('semantic_after_sha256')==actual,key
                    row['semantic_after_sha256']=actual
                    row['note']='Relecture de la source active et des distracteurs modifiés explicitement à la demande utilisateur ; bonne réponse inchangée.'
                    changed_questions.append(key)
                p=plans.get(key)
                image=q.get('formes',{}).get('qcm_image')
                if p and p['targets']:
                    assert image,key
                    assert [c['image'] for c in image['choix']]==p['targets'],key
                    text=text_form(q)['choix']
                    assert [(c['id'],bool(c.get('correct'))) for c in image['choix']]==[(c['id'],bool(c.get('correct'))) for c in text],key
                    assert len({c['image'] for c in image['choix']})==3,key
                    for j,(path,sha) in enumerate(zip(p['targets'],p['target_sha256'])):
                        if sha:assert path in reviewed and reviewed[path]['sha256']==sha,(key,path)
                        else:assert p['old_images'][j]==path,(key,path)
                if p and p['status']=='retire_ambiguous_image_variant':assert not image,key
    assert seen==set(rows)
    text_edits=[];object_edits=[]
    for op in operations:
        ex=byex[op['exercise']];node=op['node']
        q=ex['questions'][op['question']-1] if op.get('question') else {}
        source,_=source_for(ex,q)
        if op.get('source_binding')=='whole_support_transcription':source=ex.get('support',{}).get('transcription','')
        assert op['source_sha256']==digest(source),op
        if op['after'] is None:
            assert node[-1]=='qcm_image' and node[-1] not in at(ex,node[:-1])
        else:assert at(ex,node)==op['after'],(op['exercise'],node)
        if node[-1]=='texte':text_edits.append((op['exercise'],op['before'],op['after']))
        elif node[0]=='images' and node[-1]=='correct':object_edits.append(op)
        elif node[-1]=='qcm_image':
            p=plans[f"{op['exercise']}#{op['question']}"]
            assert op['before'] is None or [c['image'] for c in op['before']['choix']]==p['old_images']
        else:
            assert isinstance(op['before'],str) and op['before'].startswith('/lib/images/'),op
            assert op['after'] in reviewed,op
    assert set(text_edits)=={
        ('tcf-a1j-s3-co-2','À la boutique','Dans la classe'),
        ('tcf-a1j-s3-co-2','Au restaurant','Dans la bibliothèque'),
        ('tcf-a1j-s3-co-3','À l’accueil de la mairie','À la caisse'),
        ('tcf-a1j-s3-co-3','Au rayon librairie','Au rayon laitier')}
    assert len(object_edits)==1
    op=object_edits[0]
    assert (op['exercise'],op['node'],op['before'],op['after'])==('delf-a1-2022-co-ex5-58-3',['images',1,'correct'],False,True)
    assert 'voiture' in byex[op['exercise']]['support']['transcription']
    if refresh:
        editorial['summary']['explicitly_updated_distractor_questions']=changed_questions
        editorial['object_banks_review']=dict(count=26,main_images=130,status='manually_reviewed_against_active_transcriptions',corrections=['Lettre illustrée à la place de la seule enveloppe ; voiture entendue dans une phrase négative : OUI.'],scope_note='Reconnaissance lexicale : les catégories chaussure de plage/tongs et téléphone générique restent des représentations de l’objet, sans prétendre valider une marque ou un modèle.')
        REPORT.write_text(json.dumps(editorial,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(seen)} questions liées à leur source ; 4 distracteurs et 1 corrigé objet audités ; trios synchronisés.')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--refresh-review-bindings',action='store_true');args=parser.parse_args();verify(args.refresh_review_bindings)
