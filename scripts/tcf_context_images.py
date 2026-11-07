"""Apply the recorded CE/CO contextual image review, preserving sources and IDs.

The journal contains exact before/after values and source/question hashes. New
variants require three distinct, reviewed illustrations and synchronized answers.
"""
import argparse
from collections import Counter, defaultdict
from copy import deepcopy
import json
from pathlib import Path
import re

from tcf_context_audit import digest, semantic_question, source_for, text_form
from tcf_replace_vocabulary_images import ROOT, BANKS, checked_images, normalise, compatible_reuse
from tcf_qcm_images import clock_time

PLAN = ROOT / 'docs/tcf/plan-images-contextuel-20261106.json'
JOURNAL = ROOT / 'docs/tcf/operations-contexte-20261106.json'


def prepare(explicit_file):
    assert not JOURNAL.exists(), 'Preserve the applied plan and its source bindings.'
    explicit = json.loads(explicit_file.read_text())
    reviewed = checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
    aliases = defaultdict(set)
    for path, row in reviewed.items():
        if row.get('label'):
            aliases[normalise(row['label'])].add(path)
    for row in json.loads((ROOT/'scripts/tcf-qcm-image-registry.json').read_text()):
        if row['path'] in reviewed:
            for label in row.get('aliases', []):
                aliases[normalise(label)].add(row['path'])
    for row in json.loads((ROOT/'docs/tcf/remplacement-images-vocabulaire.json').read_text())['approved_reuses']:
        if row['image'] in reviewed:
            for label in row['labels']:
                aliases[normalise(label)] = {row['image']}
    # Whole-action synonyms, inspected together with the user's priority scenes.
    synonyms = {
        'audit-context-ecrire-courriel': ['Par courriel','Par email','Par mail','En envoyant un courriel','En envoyant un mail'],
        'audit-context-ecrire-lettre': ['Par lettre','Par courrier','Par courrier postal','En envoyant une lettre'],
        'audit-context-envoyer-texto': ['Par SMS','Par texto','En écrivant un message'],
        'vocab-par-telephone': ['Par téléphone','En téléphonant'],
        'audit-context-cour-ecole': ['Dans la cour de l’école','La cour de l’école'],
        'audit-context-journal': ['Dans un journal','Un journal'],
        'co306-restaurant-dessine': ['Au restaurant','Un restaurant','Le restaurant'],
        'co306-piscine-dessine': ['À la piscine','La piscine','Une piscine'],
        'co306-musee-dessine': ['Au musée','Le musée','Un musée'],
        'co306-batiment-theatre-dessine': ['Au théâtre','Le théâtre','Un théâtre'],
        'co834-seance-cinema-dessinee': ['Au cinéma','Le cinéma','Un cinéma','Aller au cinéma'],
        'co306-bibliotheque-dessine': ['À la bibliothèque','Une bibliothèque','La bibliothèque'],
        'co306-mairie-dessine': ['À la mairie','La mairie'],
    }
    ids={r['id']:p for p,r in reviewed.items()}
    for key, labels in synonyms.items():
        for label in labels: aliases[normalise(label)]={ids[key]}
    clocks={r['clock_time']:p for p,r in reviewed.items() if r.get('clock_time')}
    def resolve(label,enonce):
        base,question=normalise(label),normalise(enonce)
        # No partial noun substitution for quantities, ingredients/flavours,
        # medical diagnoses, family/private roles or administrative identifiers.
        if re.search(r'combien|quantite', question):
            # Actual object counts, never kilograms, ages, prices or identifiers.
            if not re.search(r'kilo|gramme|\bkg\b|\bg\b', question):
                number=re.sub(r' (?:oeufs|œufs|tomates|dvd|livres|poires)$','',base)
                count={'un':1,'une':1,'deux':2,'trois':3,'quatre':4,'cinq':5,'six':6,'huit':8,'dix':10,'douze':12}.get(number)
                if count is None and number.isdigit():count=int(number)
                for concept in ('tomates','oeufs','dvd','livres','poires'):
                    if count and re.search(r'\b'+concept+r'\b',question.replace('œ','oe')):
                        key=f'audit-context-compter-{count}-{concept}'
                        if key in ids:return ids[key]
                        if count==3 and concept in ('oeufs','poires'):return ids['vocab-'+concept]
            if re.search(r'temps|duree',question):
                duration=re.fullmatch(r'(?:(?:dans|pendant|environ) )?(\d+|cinq|dix|quinze|vingt|trente|quarante-cinq|une) (minutes?|secondes?|heure)',base)
                if duration:
                    n={'cinq':5,'dix':10,'quinze':15,'vingt':20,'trente':30,'quarante-cinq':45,'une':60}.get(duration[1],duration[1])
                    key=f'duree-{n}-'+('secondes' if duration[2].startswith('seconde') else 'minutes')
                    return ids.get(key)
            return None
        if re.search(r'parfum|saveur|arome|maladie', question):return None
        if base in {'ballon','rose','creme','lentilles','cafe','film'}:return None
        if 'bebe' in question:return None
        if base=='patisserie':
            return None if re.search(r'commerce|magasin|boutique|etablissement|ou ',question) else ids['audit-context-chocolat-pate']
        if base=='theatre' and re.search(r'activite|pratiqu|aime|atelier|club|loisir|cours',question):
            return ids['co306-cours-theatre-dessine']
        if re.search(r'\b(parents?|maman|mamans|papa|frere|soeur|cousins?|voisins?|collegues?|amis?|grand-pere|mere|pere)\b',base):return None
        if 'rayon' in question:
            dept=json.loads((ROOT/'docs/tcf/remplacement-images-vocabulaire.json').read_text())['department_answers'].get(base)
            return dept if dept in reviewed else None
        time=clock_time(label,enonce)
        if time:
            exact=clocks.get(f'{time[0]:02d}:{time[1]:02d}')
            if exact:return exact
            return next((p for k,p in clocks.items() if (int(k[:2])%12,int(k[3:]))==(time[0]%12,time[1])),None)
        values={p for p in aliases.get(base,set()) if compatible_reuse(label,p,reviewed)}
        return next(iter(values)) if len(values)==1 else None
    rows=[]
    for bank in BANKS:
        for ex in json.loads(bank.read_text()):
            for i,q in enumerate(ex.get('questions',[]),1):
                key=f"{ex['id']}#{i}"; text=text_form(q); choices=text.get('choix',[])
                if len(choices)!=3:continue
                new=deepcopy(q)
                for c in text_form(new).get('choix',[]):
                    if c['id'] in explicit['edits'].get(key,{}):c['texte']=explicit['edits'][key][c['id']]
                labels=[c['texte'] for c in text_form(new)['choix']]
                existing=q.get('formes',{}).get('qcm_image')
                oldpaths=[c.get('image') for c in (existing or {}).get('choix',[])]
                source,audio=source_for(ex,q)
                raw=[p for p in oldpaths if p and p.startswith('/lib/images/vocabulaire/')]
                retire=bool(raw) and key not in explicit['trios']
                targets=explicit['trios'].get(key)
                method='explicit_contextual_visual_review' if targets else 'reviewed_whole_answer_catalog'
                if not targets and not retire:
                    byid={c['id']:c.get('image') for c in (existing or {}).get('choix',[])}
                    targets=[byid.get(c['id']) if byid.get(c['id']) in reviewed else resolve(c['texte'],q['enonce']) for c in text_form(new)['choix']]
                valid=bool(targets) and all(p in reviewed for p in targets) and len(set(targets))==3
                if valid:
                    times=[reviewed[p].get('clock_time') for p in targets]
                    if all(times):
                        valid=len({(int(t[:2])%12,int(t[3:])) for t in times})==3
                partial=False
                if not valid and existing and not retire:
                    old_byid={c['id']:c.get('image') for c in existing['choix']}
                    targets=[p or old_byid.get(c['id']) for p,c in zip(targets,text_form(new)['choix'])]
                    partial=all(targets) and len(set(targets))==3 and any(a!=b for a,b in zip(targets,oldpaths))
                if retire:status='retire_ambiguous_image_variant'
                elif valid:status='reviewed_trio'
                elif partial:status='existing_variant_partial_reviewed_reuse'
                elif existing:status='existing_variant_needs_further_visual_review'
                else:status='text_variant_pending_images_or_intentionally_text'
                rows.append(dict(key=key,bank=str(bank.relative_to(ROOT)),exercise=ex['id'],question=i,
                                 enonce=q['enonce'],labels=labels,status=status,method=method,
                                 source_sha256=digest(source),semantic_before_sha256=digest(semantic_question(q)),
                                 semantic_after_sha256=digest(semantic_question(new)),audio=audio,
                                 targets=targets if valid or partial else None,
                                 target_sha256=[reviewed[p]['sha256'] if p in reviewed else None for p in targets] if valid or partial else None,
                                 old_images=oldpaths,requested_text_edits=explicit['edits'].get(key,{}),
                                 reason=('Relations privées ou diagnostic non distinguables de façon fiable sur une image : conserver les modalités texte et écrite.' if retire else
                                         'Sens entier des choix, quantités éventuelles et contexte de la source contrôlés ; réutilisation de la banque peinte quand disponible.' if valid else
                                         'Réutilisations relues dans un trio existant ; les autres images restent à revoir et sont conservées provisoirement.' if partial else
                                         'Illustrations ou distinction visuelle à préparer ; les dates, montants, identifiants, relations et notions abstraites restent textuels.')))
    plan=dict(date='2026-11-06',scope='Inventaire exhaustif des questions CE/CO à trois choix ; contrôle contre le texte ou la transcription active, sans nouvelle écoute intégrale des MP3.',
              summary=dict(Counter(r['status'] for r in rows)),questions=rows)
    PLAN.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');print(plan['summary'])


def apply():
    assert not JOURNAL.exists(),'Journal already exists: do not replay mutations.'
    plan=json.loads(PLAN.read_text());bykey={r['key']:r for r in plan['questions']}
    reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
    operations=[]
    for bank in BANKS:
        data=json.loads(bank.read_text());dirty=False
        for ex in data:
            for i,q in enumerate(ex.get('questions',[]),1):
                row=bykey.get(f"{ex['id']}#{i}")
                if not row:continue
                source,_=source_for(ex,q)
                assert digest(source)==row['source_sha256']
                assert digest(semantic_question(q))==row['semantic_before_sha256']
                def record(node,before,after,reason):
                    operations.append(dict(bank=str(bank.relative_to(ROOT)),exercise=ex['id'],question=i,node=node,
                                           before=before,after=after,source_sha256=row['source_sha256'],reason=reason))
                text=text_form(q)
                for j,c in enumerate(text['choix']):
                    replacement=row['requested_text_edits'].get(c['id'])
                    if replacement and replacement!=c['texte']:
                        path=['questions',i-1]+([] if q.get('type_reponse')=='qcm_texte' else ['formes','qcm_texte'])+['choix',j,'texte']
                        record(path,c['texte'],replacement,'Distracteur corrigé selon la demande explicite utilisateur.');c['texte']=replacement;dirty=True
                old=deepcopy(q.get('formes',{}).get('qcm_image'))
                if row['status'] in ('reviewed_trio','existing_variant_partial_reviewed_reuse'):
                    assert all((p in reviewed and reviewed[p]['sha256']==sha) or (sha is None and p==old['choix'][j]['image']) for j,(p,sha) in enumerate(zip(row['targets'],row['target_sha256'])))
                    choices=[dict(id=c['id'],image=p,**({'correct':True} if c.get('correct') else {})) for c,p in zip(text['choix'],row['targets'])]
                    new=dict(melanger=q.get('melanger',True),choix=choices)
                elif row['status']=='retire_ambiguous_image_variant':new=None
                else:continue
                if new!=old:
                    record(['questions',i-1,'formes','qcm_image'],old,new,row['reason'])
                    if new is None:q['formes'].pop('qcm_image',None)
                    else:q.setdefault('formes',{})['qcm_image']=new
                    dirty=True
                assert digest(semantic_question(q))==row['semantic_after_sha256']
            # The instruction is lexical recognition, including a negated noun.
            if ex['id']=='delf-a1-2022-co-ex5-58-3':
                c=ex['images'][1];assert c['id']=='i2' and c['correct'] is False
                source,_=source_for(ex,{})
                operations.append(dict(bank=str(bank.relative_to(ROOT)),exercise=ex['id'],node=['images',1,'correct'],before=False,after=True,source_sha256=digest(source),reason='Consigne : entendre le nom de l’objet. Transcription : « Je n’ai pas de voiture ». Le nom voiture est effectivement prononcé.'))
                c['correct']=True;dirty=True
            if ex['id']=='delf-a1-2022-co-ex5-50':
                c=ex['images'][1];source,_=source_for(ex,{})
                target='/lib/images/tcf/qcm-audit/audit-context-ecrire-lettre.webp'
                operations.append(dict(bank=str(bank.relative_to(ROOT)),exercise=ex['id'],node=['images',1,'image'],before=c['image'],after=target,source_sha256=digest(source),reason='La source dit une lettre, et non seulement une enveloppe. Lettre manuscrite entière visible dans la scène revue.'))
                c['image']=target;dirty=True
        if dirty:bank.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    JOURNAL.write_text(json.dumps(dict(date='2026-11-06',operations=operations),ensure_ascii=False,indent=2)+'\n')
    print('Operations',len(operations))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepare',type=Path)
    parser.add_argument('--apply',action='store_true')
    args=parser.parse_args()
    if args.prepare:prepare(args.prepare)
    elif args.apply:apply()
