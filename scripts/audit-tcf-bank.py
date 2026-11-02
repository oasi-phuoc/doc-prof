#!/usr/bin/env python3
"""Contrôles reproductibles des banques CE/CO, sans prétendre vérifier le sens par code."""
from __future__ import annotations
import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from tcf_qcm_images import norm, text_form

ROOT=Path(__file__).resolve().parents[1]
LEVELS=('a0-a1','a1-a2','a2-b1')
INTERROGATIVE=re.compile(r"\b(?:qui|que|quoi|quels?|quelles?|où|quand|comment|pourquoi|combien|lequel|laquelle|lesquels|lesquelles)\b|qu[’']",re.I)

def answer_key(text):
    # Le tiret grammatical se normalise, le signe d'une température doit rester.
    return norm(re.sub(r'[-−](?=\s*\d)', 'moins ', text))

def audit(baseline=None):
    errors=[];warnings=[];banks=[];tracks=defaultdict(list);ce_short=[];ids=set();pending_scenes=[]
    durations=json.loads((ROOT/'src/tcf/content/audio-durations.json').read_text())
    reviewed_path=ROOT/'src/tcf/content/co-reviewed-pools.json'
    reviewed_pools=json.loads(reviewed_path.read_text()) if reviewed_path.exists() else {}
    original_total=0;added=removed=changed=0
    for level in LEVELS:
        for skill in ('ce','co'):
            path=ROOT/f'src/tcf/content/{level}/{skill}.json'
            data=json.loads(path.read_text());nq=0;nimage=0
            before={}
            if baseline:
                oldpath=baseline/f'{level}-{skill}.json'
                before={e['id']:e for e in json.loads(oldpath.read_text())}
                original_total+=sum(len(e.get('questions',[])) for e in before.values())
                if set(before)!={e['id'] for e in data}:errors.append({'bank':str(path.relative_to(ROOT)),'error':'La liste des supports a changé.'})
            for ex in data:
                eid=ex['id'];location={'bank':str(path.relative_to(ROOT)),'exercise':eid}
                if eid in ids:errors.append({**location,'error':'Identifiant de support dupliqué.'})
                ids.add(eid)
                old=before.get(eid)
                for situation in ex.get('situations',[]):
                    if situation.get('image_pending'):
                        pending_scenes.append({**location,'situation':situation['id'],'dialogue':situation.get('dialogue'),'image':situation['image']})
                if old:
                    if old['support']!=ex['support']:errors.append({**location,'error':'Le texte ou support a été modifié.'})
                    added+=max(0,len(ex['questions'])-len(old['questions']))
                    removed+=max(0,len(old['questions'])-len(ex['questions']))
                    changed+=sum(q!=p for q,p in zip(old['questions'],ex['questions']))
                seen=set();support=ex['support'];paths=support.get('audios') or [support.get('audio')]
                for qi,q in enumerate(ex.get('questions',[]),1):
                    nq+=1;loc={**location,'question':qi,'enonce':q.get('enonce')}
                    def error(message):errors.append({**loc,'error':message})
                    if not q.get('enonce','').rstrip().endswith('?'):error('La question ne se termine pas par un point d’interrogation.')
                    if not INTERROGATIVE.search(q.get('enonce','')):warnings.append({**loc,'warning':'Mot interrogatif absent : formulation à vérifier.'})
                    key=(q.get('audio',1),norm(q.get('enonce','')))
                    if key in seen:error('Énoncé dupliqué pour le même support ou audio.')
                    seen.add(key)
                    if skill=='co' and len(paths)>1 and not (isinstance(q.get('audio'),int) and 1<=q['audio']<=len(paths)):
                        error('La question doit être liée à une piste audio explicite.')
                    text=text_form(q)
                    if not text:error('La variante QCM texte avec trois réponses est absente.');continue
                    choices=text.get('choix',[])
                    if len(choices)!=3:error('Le QCM texte doit avoir exactement trois réponses.')
                    if len({c.get('id') for c in choices})!=len(choices):error('Identifiants de choix dupliqués.')
                    if len({answer_key(c.get('texte','')) for c in choices})!=len(choices):error('Réponses textuelles dupliquées.')
                    if any(not c.get('texte','').strip() for c in choices):error('Réponse vide.')
                    correct=[c for c in choices if c.get('correct') is True]
                    if len(correct)!=1:error('Le QCM doit avoir une seule réponse correcte.');continue
                    forms=q.get('formes',{})
                    lines=q if q['type_reponse']=='lignes' else forms.get('lignes')
                    if lines and answer_key(lines.get('reponse_modele',''))!=answer_key(correct[0]['texte']):error('Le corrigé rédigé diffère de la réponse correcte au QCM.')
                    image=q if q['type_reponse']=='qcm_image' else forms.get('qcm_image')
                    if image:
                        nimage+=1;im=image.get('choix',[])
                        textkeys={c['id']:bool(c.get('correct')) for c in choices}
                        imagekeys={c['id']:bool(c.get('correct')) for c in im}
                        if len(im)!=3 or imagekeys!=textkeys:error('La variante image ne correspond pas aux trois choix textuels.')
                        if len({c.get('image') for c in im})!=len(im):error('Images dupliquées dans le QCM.')
                        for c in im:
                            if not (ROOT/'public'/c.get('image','').lstrip('/')).is_file():error('Image inexistante : '+c.get('image',''))
                if skill=='ce':
                    if len(ex['questions'])<8:ce_short.append({**location,'questions':len(ex['questions']),'minimum':8,'deficit':8-len(ex['questions']),'texte':support.get('texte','')})
                else:
                    for ai,p in enumerate(paths,1):
                        if not p:errors.append({**location,'error':'Piste audio manquante.'});continue
                        seconds=durations.get(p)
                        category=reviewed_pools.get(p,{}).get('tag') or ('court' if seconds and seconds<=15 else 'moyen' if seconds and seconds<=45 else 'long')
                        minimum={'court':2,'moyen':4,'long':8}[category]
                        pool=[q for q in ex['questions'] if len(paths)==1 or q.get('audio')==ai]
                        tracks[level,p].append({**location,'audio':ai,'path':p,'seconds':seconds,'category':category,'minimum':minimum,'questions':len(pool),'deficit':max(0,minimum-len(pool)),'object_recognition':ex['type_exercice']=='images_a_reconnaitre'})
            banks.append({'niveau':level,'competence':skill.upper(),'supports':len(data),'questions':nq,'variantes_image':nimage})
    best=[max(rows,key=lambda r:r['questions']) for rows in tracks.values()]
    return {'method':'Relecture éditoriale des supports et questions ; contrôles de structure automatisés. Les tags pédagogiques déjà relus sont conservés en priorité ; à défaut la durée du fichier complet détermine sa catégorie. La vérification automatique ne certifie pas la sémantique ni la conformité audio/transcription.',
            'audio_categories_seconds':{'court':'≤15','moyen':'>15 à45','long':'>45'},
            'summary':{'supports':len(ids),'questions_before':original_total if baseline else None,'questions_after':sum(b['questions'] for b in banks),'questions_net_added':added-removed if baseline else None,'supports_ce_below_minimum':len(ce_short),'audio_pools_by_level':len(best),'audio_pools_below_minimum':sum(r['deficit']>0 for r in best),'errors':len(errors),'warnings':len(warnings)},
            'banks':banks,'errors':errors,'warnings':warnings,'ce_below_minimum':ce_short,'audio_pools':best,'audio_occurrences':[r for rows in tracks.values() for r in rows],'pending_association_images':pending_scenes}

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--baseline',type=Path);parser.add_argument('--report',type=Path,default=ROOT/'scripts/tcf-bank-audit.json');args=parser.parse_args()
    report=audit(args.baseline);args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report['summary'],ensure_ascii=False))
    raise SystemExit(bool(report['errors']))

if __name__=='__main__':main()
