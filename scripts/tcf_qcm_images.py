"""Correspondances QCM exactes : aucune recherche de mot à l'intérieur d'une phrase."""
from __future__ import annotations
import argparse
import copy
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = ROOT / 'scripts/tcf-qcm-image-registry.json'
BANKS = [ROOT / f'src/tcf/content/{level}/{skill}.json'
         for level in ('a0-a1', 'a1-a2', 'a2-b1') for skill in ('ce', 'co')]

HOUR_NAMES = ['minuit', 'une-heure', 'deux-heures', 'trois-heures', 'quatre-heures',
              'cinq-heures', 'six-heures', 'sept-heures', 'huit-heures', 'neuf-heures',
              'dix-heures', 'onze-heures', 'midi', 'treize-heures', 'quatorze-heures',
              'quinze-heures', 'seize-heures', 'dix-sept-heures', 'dix-huit-heures',
              'dix-neuf-heures', 'vingt-heures', 'vingt-et-une-heures',
              'vingt-deux-heures', 'vingt-trois-heures']
MINUTE_NAMES = {0: '', 5: 'cinq', 10: 'dix', 15: 'quinze', 20: 'vingt',
                25: 'vingt-cinq', 30: 'trente', 35: 'trente-cinq', 40: 'quarante',
                45: 'quarante-cinq', 50: 'cinquante', 55: 'cinquante-cinq'}

def norm(text):
    text = ''.join(c for c in unicodedata.normalize('NFD', text.lower())
                   if unicodedata.category(c) != 'Mn')
    text = text.replace('œ', 'oe').replace('’', "'").replace('-', ' ')
    return re.sub(r'\s+', ' ', text).strip(' .!?;:«»"')

REGISTRY = json.loads(REGISTRY_PATH.read_text())
ALIASES = {norm(label): row['path'] for row in REGISTRY for label in row['aliases']}
EXCLUDED = {'pays', 'presenter', 'nombres-mesures', 'temps-calendrier', 'heure-horloge', 'ville'}
OBJECTS = {}
for file in sorted((ROOT / 'public/lib/images/vocabulaire').glob('*/*.webp')):
    if file.parent.name not in EXCLUDED:
        OBJECTS.setdefault(norm(file.stem), '/' + str(file.relative_to(ROOT / 'public')))

# Synonymes complets relus ; jamais un mot pioché dans une réponse plus longue.
OBJECT_ALIASES = {
    'par telephone':'technologie/telephone-portable', 'au telephone':'technologie/telephone-portable',
    'sur internet':'technologie/internet', 'en ligne':'technologie/internet',
    'par courrier':'argent-administration/enveloppe',
    'par e mail':'technologie/courriel', 'par email':'technologie/courriel',
    'par mail':'technologie/courriel', 'envoyer un courriel':'technologie/courriel',
    'par la poste':'argent-administration/enveloppe', 'sur un ordinateur':'technologie/ordinateur',
    'en bus':'transports/bus', 'en voiture':'transports/voiture', 'en train':'transports/train',
    'en metro':'transports/metro', 'en bateau':'transports/bateau',
    'en avion':'transports/avion', 'a velo':'transports/velo', 'a pied':'actions/marcher',
    'professeur':'metiers/enseignant', 'professeurs':'metiers/enseignant',
    'cuisiniers':'metiers/cuisinier','voyageurs':'voyage/voyageur',
    'distributeur automatique':'ville/distributeur-automatique',
    'distributeur de billets':'technologie/distributeur-de-billets',
    'pastilles':'sante/comprime', 'steak':'aliments/viande',
    'gateau au chocolat':'desserts/gâteau', 'bol de cereales':'aliments/céréales',
    'bouteille d eau':'boissons/bouteille-deau', "bouteille d'eau":'boissons/bouteille-deau',
    "jus d'orange":'boissons/jus-d-orange', 'jus de fruits':'boissons/jus',
    "verre d'eau":'boissons/eau', "carte d'embarquement":'voyage/carte-d-embarquement',
    'repas':'aliments/plateau-repas', 'prendre des photos':'loisirs/photographie',
    'lire un livre':'actions/lire-dans-un-fauteuil', 'faire ses devoirs':'actions/faire-ses-devoirs',
    'gateaux':'desserts/gâteau', 'cornichons':'legumes/cornichon',
    'se reposer':'actions/dormir',
    'chauffeur':'metiers/chauffeur-de-bus',
    'telephoner':'actions/telephoner', 'envoyer un sms':'technologie/sms',
    'pluvieux':'meteo/pluie', 'ensoleille':'meteo/soleil', 'neigeux':'meteo/neige',
    'il pleut beaucoup':'meteo/pluie', 'il neige':'meteo/neige', 'il fait soleil':'meteo/soleil',
}
for label, relative in OBJECT_ALIASES.items():
    path=ROOT/'public/lib/images/vocabulaire'/f'{relative}.webp'
    if path.exists(): OBJECTS[norm(label)]='/'+str(path.relative_to(ROOT/'public'))

PREFIX = re.compile(r"^(?:dans une? |dans les? |dans la |dans l'|a la |a l'|au |aux |le |la |les |l'|un |une |des |du |de la |de l'|de |d'|pour les |pour le |pour la |aux )")

def noun(text):
    for _ in range(4):
        new = PREFIX.sub('', text)
        if new == text: break
        text = new
    return text

def clock_value(label, enonce):
    """Une heure précise, jamais une durée, une date ou un numéro."""
    question = norm(enonce)
    if not re.search(r'quelle?s? heures?|quels? horaires?', question):
        return None
    if re.search(r'combien|duree', question):
        return None
    value = re.sub(r'^(?:a |vers )', '', norm(label))
    numeric = re.fullmatch(r'(\d{1,2})\s*(?:h|heures?|:)\s*(\d{1,2})?', value)
    if numeric:
        hour, minute = int(numeric[1]), int(numeric[2] or 0)
    else:
        hour = minute = None
        names = {name.replace('-', ' '): i for i, name in enumerate(HOUR_NAMES)}
        names.update({'douze heures': 12, 'zero heure': 0})
        for name in sorted(names, key=len, reverse=True):
            if value != name and not value.startswith(name + ' '):
                continue
            hour = names[name]
            tail = value[len(name):].strip()
            mins = {name.replace('-', ' '): n for n, name in MINUTE_NAMES.items()}
            mins.update({'et quart': 15, 'et demi': 30, 'et demie': 30})
            if tail in mins:
                minute = mins[tail]
            elif tail.startswith('moins '):
                sub = {'cinq': 5, 'dix': 10, 'le quart': 15, 'vingt': 20}.get(tail[6:])
                if sub:
                    hour, minute = (hour - 1) % 24, 60 - sub
            break
        if hour is None or minute is None:
            return None
    if not (0 <= hour <= 24 and 0 <= minute < 60) or (hour == 24 and minute):
        return None
    return hour % 24, minute

def clock_image(value):
    hour, minute = value
    if minute not in MINUTE_NAMES:
        return None
    stem = HOUR_NAMES[hour] + ('-' + MINUTE_NAMES[minute] if minute else '')
    path = ROOT / 'public/lib/images/vocabulaire/heure-horloge' / (stem + '.webp')
    return '/' + str(path.relative_to(ROOT / 'public')) if path.exists() else None

def resolve_image(label, enonce=''):
    text = norm(label)
    time = clock_value(label, enonce)
    if time is not None:
        return clock_image(time)
    if re.search(r'de quelles? couleurs?|quelle est la couleur|quelles sont les couleurs', norm(enonce)):
        text = noun(text)
        color = {'bleue': 'bleu', 'blanche': 'blanc', 'verte': 'vert',
                 'noire': 'noir', 'violette': 'violet', 'grise': 'gris'}.get(text, text)
        for folder in ('couleurs', 'couleur'):
            path = ROOT / 'public/lib/images/vocabulaire' / folder / (color + '.webp')
            if path.exists():
                return '/' + str(path.relative_to(ROOT / 'public'))
        return None
    # Propriété, noms propres, négation et phrases ne deviennent jamais un objet isolé.
    if re.search(r"\b(?:chez|pas|jamais|annule|annulee|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|euros?|francs?|chf)\b", text) and text not in ALIASES:
        return None
    if re.search(r'\d', text):
        count_question = re.search(r"combien\s+(?:de\s+|d')(tomates?|oeufs?|dvd)\b", norm(enonce))
        if re.fullmatch(r'\d+', text) and count_question and not re.search(r'cout|prix|euros?|francs?|payer|tarif', norm(enonce)):
            concept = next((c for c in ('tomates','oeufs','dvd') if c.rstrip('s') == count_question[1].rstrip('s')), None)
            return next((r['path'] for r in REGISTRY if r.get('count') == int(text) and r.get('concept') == concept), None)
        return None
    # Les lieux ne sont pas des drapeaux et les langues ne sont pas des nationalités.
    if re.search(r"\bquell?e?s?\s+(?:est\s+(?:le|la|son|sa)\s+)?(?:jour|date|mois|heure|numero|prenom|nom)\b|s'appelle|se prenomme", norm(enonce)):
        return None
    base = noun(text)
    if base == 'entretien' and re.search(r'emploi|travail|embauch|candidat|postul', norm(enonce)):
        return '/lib/images/vocabulaire/actions/entretien-d-embauche.webp'
    if base == 'cuisiniere' and re.search(r'qui|metier|travail|profession', norm(enonce)):
        return '/lib/images/vocabulaire/metiers/cuisinière.webp'
    if base == 'poisson' and re.search(r'animal|aquarium|aquatique', norm(enonce)):
        return '/lib/images/vocabulaire/animaux-aquatiques/poisson.webp'
    if base == 'sirop' and re.search(r'medicament|toux|traitement|ordonnance', norm(enonce)):
        return '/lib/images/vocabulaire/sante/sirop.webp'
    place_question = re.search(r'\bou\b|lieu|endroit|travaill|se trouve', norm(enonce))
    if base == 'cafe' and not place_question and (text.startswith(('du ', 'le ')) or re.search(r'boi|aliment|manger|produit', norm(enonce))):
        return OBJECTS.get('cafe')
    if base == 'bureau' and re.search(r'objet|meuble|commander|acheter', norm(enonce)):
        return OBJECTS.get('bureau')
    if text in ALIASES:
        return ALIASES[text]
    if text in OBJECTS:
        return OBJECTS[text]
    # Expressions complètes de déplacement ; aucune extraction de substantif dans une proposition.
    text = re.sub(r"^(?:d'aller |de visiter |aller |visiter |on va |ils vont |elle va |pour aller )", '', text)
    text = noun(text)
    if text == 'cafe' and not place_question and (norm(label).startswith(('du ', 'le ')) or re.search(r'boi|aliment|manger|produit', norm(enonce))):
        return OBJECTS.get('cafe')
    if text == 'bureau' and re.search(r'objet|meuble|commander|acheter', norm(enonce)):
        return OBJECTS.get('bureau')
    if text in ALIASES:
        return ALIASES[text]
    if text in OBJECTS:
        return OBJECTS[text]
    # Pluriel régulier uniquement ; ne pas perdre les compléments de sens.
    if text.endswith('s') and text[:-1] in OBJECTS:
        return OBJECTS[text[:-1]]
    return None

def text_form(q):
    return q if q['type_reponse'] == 'qcm_texte' else q.get('formes', {}).get('qcm_texte')

def desired_form(q):
    text = text_form(q)
    if not text or len(text.get('choix', [])) not in (3,4): return None
    if sum(c.get('correct') is True for c in text['choix']) != 1: return None
    times = [clock_value(c.get('texte', ''), q.get('enonce', '')) for c in text['choix']]
    if all(value is not None for value in times):
        # Un cadran analogique ne distingue pas 8 h de 20 h : pas de choix ambigus.
        if len({(hour % 12, minute) for hour, minute in times}) != len(times):
            return None
    paths = [resolve_image(c.get('texte', ''), q.get('enonce', '')) for c in text['choix']]
    if not all(paths) or len(set(paths)) != len(paths): return None
    return {'melanger': text.get('melanger', True), 'choix': [
        {**{k: v for k, v in c.items() if k != 'texte'}, 'image': path}
        for c, path in zip(text['choix'], paths)]}

def synchronize(q, image):
    q = copy.deepcopy(q)
    forms = q.setdefault('formes', {})
    if q['type_reponse'] == 'qcm_image':
        if image:
            q['choix'] = image['choix']; q['melanger'] = image['melanger']
        else:
            text = forms.pop('qcm_texte')
            q['type_reponse'] = 'qcm_texte'; q['choix'] = text['choix']
            q['melanger'] = text.get('melanger', True)
        forms.pop('qcm_image', None)
    elif image:
        forms['qcm_image'] = image
    else:
        forms.pop('qcm_image', None)
    if not forms: q.pop('formes', None)
    return q

def audit(apply=False):
    stats = Counter(); required = set(); unresolved = Counter(); details = []
    for bank in BANKS:
        data = json.loads(bank.read_text())
        for exercise in data:
            for index, q in enumerate(exercise.get('questions', [])):
                stats['questions'] += 1
                image = desired_form(q)
                old = ({'choix':q['choix'],'melanger':q.get('melanger',True)}
                       if q['type_reponse'] == 'qcm_image' else q.get('formes', {}).get('qcm_image'))
                if image:
                    stats['illustrable'] += 1
                    required.update(c['image'] for c in image['choix'])
                else:
                    stats['text_only'] += 1
                    if old: stats['removed_misleading_image_forms'] += 1
                    text = text_form(q)
                    if text:
                        for c in text['choix']:
                            if not resolve_image(c.get('texte',''), q.get('enonce','')):
                                unresolved[c.get('texte','')] += 1
                if old != image:
                    details.append({'bank':str(bank.relative_to(ROOT)), 'exercise':exercise['id'], 'question':index,
                                    'enonce':q.get('enonce'), 'action':'image' if image else 'text',
                                    'choices':text_form(q).get('choix',[]) if text_form(q) else []})
                if apply:
                    if image:
                        for c in image['choix']:
                            assert (ROOT / 'public' / c['image'].lstrip('/')).is_file(), c['image']
                    exercise['questions'][index] = synchronize(q, image)
        if apply: bank.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    report={'stats':dict(stats),'required':sorted(required),'top_unresolved':unresolved.most_common(), 'changes':details}
    return report

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--apply',action='store_true');args=parser.parse_args()
    if args.apply:
        missing=[p for p in audit(False)['required'] if not (ROOT/'public'/p.lstrip('/')).is_file()]
        if missing: raise SystemExit('Images manquantes : '+', '.join(missing))
    report=audit(args.apply)
    path=ROOT/'scripts/tcf-qcm-image-audit.json'
    saved={**report, 'top_unresolved':report['top_unresolved'][:100],
           'changes':[{k:v for k,v in change.items() if k!='choices'} for change in report['changes']]}
    path.write_text(json.dumps(saved,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report['stats'],ensure_ascii=False))

if __name__=='__main__':main()
