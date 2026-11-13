"""Inventory every CFR CO passage and prepare scene/reuse review from its exact text.

This writes catalogue preparation only. It never changes CO questions, audio tags
or association answers, and never treats a text-search suggestion as an approved reuse.
"""
from collections import Counter, defaultdict
import csv
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/gallery'
BANK = ROOT / 'src/tcf/content/a1-a2/co.json'
STYLE = '/lib/images/tcf/qcm-audit/extension573-architecte-atelier.png'
STOP = set('avec dans pour vous nous votre notre leurs cette comme alors mais aussi bien bonjour merci monsieur madame salut tres plus tout tous toute toutes est sont une des les aux qui que quoi quand quel quelle quelles quels oui non pas peut fait faire vais aller elle elles ils lui son ses sur par ici avoir etre doit faut tcf cfr dialogue extrait scene scenario personne personnes adulte adultes'.split())


def sha(value):
    return hashlib.sha256(value).hexdigest()


def norm(value):
    text = unicodedata.normalize('NFD', value.lower().replace('œ', 'oe').replace('’', "'"))
    return ''.join(c for c in text if not unicodedata.combining(c))


def terms(value):
    return {w for w in re.findall(r'[a-z]{3,}', norm(value)) if w not in STOP}


def load(path, default=None):
    return json.loads(path.read_text()) if path.exists() else default


def audit():
    exercises = load(BANK)
    assert exercises and all(ex['niveau'] == 'A1-A2' and ex['competence'] == 'CO' for ex in exercises)
    catalogue = load(ROOT / 'src/gallery/catalog.generated.json')
    proofs = {r['path']: r for r in load(ROOT / 'docs/tcf/images-generees.json')['images']}
    priorities = {(r['source_id'], r['audio_index']): r for r in load(OUT / 'briefs-scenarios-co-cfr-a2-20261113.json')['briefs']}
    reuses = {(r['source_id'], r['audio_index']): r for r in load(OUT / 'co-cfr-a2-reuses-20261113.json')['reuses']}
    replacements = load(ROOT / 'src/tcf/content/audio-replacements.json', {})
    po = {r['path']: r for r in load(ROOT / 'public/lib/images/tcf/po/illustrations-manifest.json', {}).get('images', [])}
    candidates = []
    for image in catalogue:
        if not set(image['types']) & {'Scénario', 'Action', 'Métier'} or 'Version antérieure' in image['types']:
            continue
        proof = proofs.get(image['src'], {})
        if proof.get('status') != 'visually_reviewed':
            continue
        extra = po.get(image['src'], {})
        tokens = terms(' '.join([image['label'], image['keywords'], extra.get('action', ''), *image['themes']]))
        candidates.append((image, tokens, terms(image['label'] + ' ' + extra.get('action', ''))))
    frequencies = Counter(t for _, tokens, _ in candidates for t in tokens)
    weights = {t: math.log((len(candidates) + 1) / (n + 1)) + 1 for t, n in frequencies.items()}

    def search(text, excluded):
        query = terms(text)
        denominator = max(1, sum(weights.get(t, 1) for t in query))
        ranked = []
        for image, tokens, label_tokens in candidates:
            if image['src'] in excluded:
                continue
            overlap = query & tokens
            if not overlap:
                continue
            score = sum(weights[t] for t in overlap) / denominator + .04 * len(query & label_tokens)
            if score >= .12:
                ranked.append((score, image['src'], image, sorted(overlap)))
        ranked.sort(key=lambda row: (-row[0], row[1]))
        return [dict(path=image['src'], label=image['label'], score=round(score, 3),
                     matching_terms=overlap, status='metadata_candidate_not_visually_reviewed')
                for score, _, image, overlap in ranked[:3]]

    style_commit = subprocess.check_output(['git', 'log', '-1', '--format=%H', '--', 'public' + STYLE], cwd=ROOT, text=True).strip()
    assert style_commit and (ROOT / 'public' / STYLE.lstrip('/')).is_file()
    units = []; jobs = {}; decoys = []
    for ex in exercises:
        support = ex['support']
        audios = support.get('audios') or [support.get('audio')]
        raw = support['transcription']
        texts = raw if isinstance(raw, list) else [raw]
        assert len(audios) == len(texts), ex['id']
        for situation in ex.get('situations', []):
            if situation.get('dialogue') is None:
                decoys.append(dict(source_id=ex['id'], image=situation['image']))
        for index, (audio, text) in enumerate(zip(audios, texts), 1):
            assert isinstance(audio, str) and isinstance(text, str) and text.strip(), ex['id']
            resolved = audio; seen = set()
            while resolved in replacements:
                assert resolved not in seen, 'Cycle de remplacement audio'
                seen.add(resolved); resolved = replacements[resolved]
            priority = priorities.get((ex['id'], index))
            title = priority['title'] if priority else ex.get('scene', ex['theme']) + (f' — passage {index}' if len(audios) > 1 else '')
            linked = next((s['image'] for s in ex.get('situations', []) if s.get('dialogue') == index), None)
            reuse = reuses.get((ex['id'], index))
            if reuse:
                assert reuse['status'] == 'visually_reviewed' and reuse['audio'] == audio
                assert sha(text.encode()) == reuse['transcription_sha256'], ex['id']
                assert sha((ROOT / 'public' / reuse['path'].lstrip('/')).read_bytes()) == reuse['sha256']
            support_images = []
            if isinstance(support.get('image'), str) and len(audios) == 1:
                support_images.append(support['image'])
            if len(support.get('images', [])) == len(audios):
                support_images.append(support['images'][index - 1])
            qs = ex.get('questions', [])
            questions = [q for q in qs if q.get('audio') == index] if len(audios) > 1 else qs
            if not questions and len(qs) == len(audios):
                questions = [qs[index - 1]]
            unit = dict(source_id=ex['id'], audio_index=index, niveau=ex['niveau'], title=title,
                        source_scene=ex.get('scene'), theme=ex.get('scenario'), audio=audio,
                        resolved_audio=resolved, audio_file_exists=(ROOT / 'public' / resolved.lstrip('/')).is_file(),
                        transcription=text, transcription_sha256=sha(text.encode()),
                        questions=[q['enonce'] for q in questions], existing_support_images=list(dict.fromkeys(support_images)),
                        brief=priority['scene_brief'] if priority else None,
                        brief_read_against_transcription=bool(priority), linked_scenario_image=linked,
                        reviewed_catalogue_reuse=reuse['path'] if reuse else None)
            if linked:
                assert (ROOT / 'public' / linked.lstrip('/')).is_file(), linked
                unit['status'] = 'already_linked_scenario'
                unit['catalogue_candidates'] = []
            elif reuse:
                unit['status'] = 'catalogue_reuse_visually_reviewed'
                unit['catalogue_candidates'] = []
            else:
                suggested = search(title + ' ' + text, set())
                unit['status'] = 'scene_reuse_or_generation_review_required'
                unit['catalogue_candidates'] = suggested
                # Exact text duplicates share a preparation job. Similar topics do not.
                signature = sha(re.sub(r'\s+', ' ', norm(text)).strip().encode())
                job_id = 'catalogue-co-cfr-a2-' + signature[:16]
                unit['preparation_job'] = job_id
                generated = load(OUT / 'generation-20261113' / (job_id + '.json'), {})
                if generated.get('status') == 'visually_reviewed':
                    proof = proofs.get(generated['path'], {})
                    assert proof.get('status') == 'visually_reviewed'
                    assert sha((ROOT / 'public' / generated['path'].lstrip('/')).read_bytes()) == generated['sha256'] == proof['sha256']
                    unit.update(status='generated_reviewed_scenario', linked_scenario_image=generated['path'])
                    units.append(unit)
                    continue
                if generated.get('status') == 'generated_pending_visual_review':
                    unit['status'] = 'generated_pending_visual_review'
                    units.append(unit)
                    continue
                source = dict(source_id=ex['id'], audio_index=index, audio=audio, transcription_sha256=unit['transcription_sha256'])
                if job_id not in jobs:
                    brief = unit['brief'] or 'Choisir une seule situation concrète réellement décrite dans la transcription ci-dessous. Ne pas inventer un événement absent, une réponse ou une réussite qui ne sont pas affirmés.'
                    prompt = ('Créer UNE illustration pour le catalogue de situations CO du TCF CFR, niveau A1-A2. '
                              'Peinture numérique semi-réaliste douce, volumes progressifs, contours fins discrets, couleurs naturelles chaleureuses, identique à la technique de la référence validée. '
                              'Décor entier peint, proportions réalistes, composition unique paysage EXACTEMENT 4:3, sujet entier avec marges. '
                              'Nouveaux visages, silhouettes, coiffures et vêtements ; diversité naturelle des genres, carnations, âges et morphologies. Ne copier aucun personnage, plante ou meuble de la référence. '
                              'Respecter les rôles et âges mentionnés dans l’audio. Les annonces radio ne doivent pas être transformées automatiquement en dialogues entre deux personnes. '
                              'Pas de collage, séquence, bulles, encarts, texte lisible, chiffres, date, jour, mois, prix, montant, logo ou marque. '
                              'Ne pas montrer une vente, une guérison, un gain, une réservation ou une réparation comme confirmés si le texte ne fait que les demander ou les envisager. '
                              'Scène proposée : ' + brief + '\nTranscription exacte de référence :\n' + text)
                    jobs[job_id] = dict(id=job_id, label=title, type='Scénario', subtype='CO CFR A2',
                                        status='preparation_only', priority=bool(priority),
                                        path=f'/lib/images/tcf/catalogue/scenarios-a2/{signature[:16]}.webp',
                                        generation_gate='review_existing_catalogue_images_before_generating',
                                        sources=[source], transcription=text, scene_brief=unit['brief'],
                                        catalogue_candidates=suggested, existing_support_images=unit['existing_support_images'],
                                        prompt=prompt, reference_images=[str(ROOT / 'public' / STYLE.lstrip('/'))],
                                        style_references=[STYLE], style_reference_commit=style_commit,
                                        publication_gate='visual_and_transcription_review_required; no automatic QCM activation')
                else:
                    jobs[job_id]['sources'].append(source)
                    jobs[job_id]['priority'] |= bool(priority)
            units.append(unit)
    assert len({u['audio'] for u in units}) == len(units), 'Références audio dupliquées à examiner'
    statuses = Counter(u['status'] for u in units)
    original = load(OUT / 'extension-tcf-20261113.json')
    summary = dict(exercises=len(exercises), audio_passages=len(units),
                   existing_linked_scenarios=statuses['already_linked_scenario'],
                   reviewed_catalogue_reuses=statuses['catalogue_reuse_visually_reviewed'],
                   generated_reviewed_scenarios=statuses['generated_reviewed_scenario'],
                   generated_pending_visual_review=statuses['generated_pending_visual_review'],
                   existing_decoy_images=len({d['image'] for d in decoys}),
                   scene_review_required=statuses['scene_reuse_or_generation_review_required'],
                   unique_preparation_jobs=len(jobs), priority_briefs_read=sum(u['brief_read_against_transcription'] for u in units),
                   priority_preparation_jobs=sum(j['priority'] for j in jobs.values()),
                   passages_with_catalogue_suggestions=sum(bool(u['catalogue_candidates']) for u in units),
                   missing_audio_files=sum(not u['audio_file_exists'] for u in units))
    doc = dict(scope='TCF CFR — banque CO A1-A2 uniquement, sans banque A2-B1.',
               source='src/tcf/content/a1-a2/co.json', source_sha256=sha(BANK.read_bytes()),
               source_commit=subprocess.check_output(['git', 'log', '-1', '--format=%H', '--', str(BANK.relative_to(ROOT))], cwd=ROOT, text=True).strip(),
               catalogue_sha256=sha((ROOT / 'src/gallery/catalog.generated.json').read_bytes()),
               policy='Les suggestions sont des recherches de métadonnées, pas des réemplois validés ni une preuve qu’une image manque. Voir les images candidates et les supports existants avant toute génération. Contrôler chaque résultat avec la transcription avant publication. Aucun tag audio, QCM ou tirage modifié.',
               summary=summary, generation_blocker=original.get('generation_blocker'), decoys=decoys, passages=units)
    (OUT / 'scenarios-co-cfr-a2-20261113.json').write_text(json.dumps(doc, ensure_ascii=False, indent=2) + '\n')
    queue = sorted(jobs.values(), key=lambda j: (not j['priority'], j['sources'][0]['source_id'], j['sources'][0]['audio_index']))
    (OUT / 'preparation-scenarios-co-cfr-a2-20261113.json').write_text(json.dumps(queue, ensure_ascii=False, indent=2) + '\n')
    with (OUT / 'inventaire-co-cfr-a2-20261113.csv').open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.writer(stream, delimiter=';'); writer.writerow(['exercice', 'passage', 'scène', 'audio', 'audio présent', 'état', 'image liée', 'réemploi contrôlé', 'candidats à voir', 'transcription'])
        for u in units:
            writer.writerow([u['source_id'], u['audio_index'], u['title'], u['audio'], u['audio_file_exists'], u['status'], u['linked_scenario_image'] or '', u['reviewed_catalogue_reuse'] or '', ' / '.join(c['path'] for c in u['catalogue_candidates']), u['transcription']])
    lines = ['# Scénarios CO du TCF CFR — A2', '',
             'Le TCF CFR utilise la banque **A1-A2**. Cet inventaire ne mélange pas les exercices A2-B1 du TPF.', '',
             f"{summary['exercises']} exercices et **{summary['audio_passages']} pistes distinctes** sont répertoriés avec leur transcription exacte. Les **{summary['existing_linked_scenarios']} scènes déjà associées** et leurs **{summary['existing_decoy_images']} leurres** sont repérables sous « Scénario » et « CO CFR A2 ». Un réemploi supplémentaire contrôlé illustre l’appel de réservation d’hôtel.", '',
             f"**{summary['scene_review_required']} pistes** restent à relier à une image adaptée ou à illustrer. La file contient **{summary['unique_preparation_jobs']} préparations**, dont **{summary['priority_preparation_jobs']} prioritaires** avec des briefs précis relus sur le texte. Les {summary['priority_briefs_read']} briefs prioritaires comprennent aussi le réemploi hôtel déjà disponible.", '',
             'Les recherches dans les légendes et thèmes ne prouvent pas qu’une image convient : les candidats restent à voir. Une image de dentiste en train de soigner ne remplace pas un appel de son secrétariat ; une boutique ouverte ne représente pas une fermeture ; un téléphone seul ne remplace pas une scène de conversation.', '',
             'Le quota d’images est atteint. Reprise annoncée le **14 novembre 2026 vers 14 h 31, heure de Zurich**. Aucune nouvelle image n’est annoncée comme générée par cet audit. Les associations, réponses QCM et tags audio restent ceux de la banque existante.', '',
             '[Inventaire CSV des pistes](inventaire-co-cfr-a2-20261113.csv) · [Audit complet et candidats](scenarios-co-cfr-a2-20261113.json) · [File de préparation](preparation-scenarios-co-cfr-a2-20261113.json)', '',
             '## Priorités relues', '', '| Situation | Source | Passage | Préparation |', '|---|---|---:|---|']
    for u in units:
        if u['brief_read_against_transcription']:
            action = 'Réemploi hôtel contrôlé' if u['reviewed_catalogue_reuse'] else 'Voir les candidats, puis générer si nécessaire'
            lines.append(f"| {u['title']} | `{u['source_id']}` | {u['audio_index']} | {action} |")
    (OUT / 'scenarios-co-cfr-a2-20261113.md').write_text('\n'.join(lines) + '\n')
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    audit()
