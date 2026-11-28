"""Report live progress from the four resumable image packets."""
import json
from pathlib import Path
import re
from collections import Counter
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'docs/tcf/lots-images-20261124'
manifest_path = FOLDER / 'lots.json'
manifest = json.loads(manifest_path.read_text())
entries = [manifest['delf_final21']] + manifest['historical_batches']
rows = []
pending_corrections = []
completed_corrections = set()
updated_times = []
for entry in entries:
    packet = json.loads((ROOT / entry['packet']).read_text())
    if packet.get('last_updated'):
        updated_times.append(datetime.fromisoformat(packet['last_updated']))
    summary = packet['summary']
    entry.update(status=packet['status'], activated_trios=summary['activated_trios'],
        prepared_trios=summary['prepared_trios'], published_images=len(packet['published_images']),
        planned_trios=len(packet['planned_choices']),
        images_still_to_finalize=len(packet.get('remaining_asset_ids', [])) if packet['planned_choices'] else None,
        published_images_requested_for_redraw=summary.get('published_images_requested_for_redraw', 0))
    pending_corrections.extend(row for row in packet.get('user_requested_corrections', [])
                               if row['status'] != 'completed')
    completed_corrections.update(row['question_index'] for row in packet.get('user_requested_corrections', [])
                                 if row['status'] == 'completed')
    if packet.get('activation_register'):
        entry['activation_register'] = packet['activation_register']
    label = 'DELF — reliquat final' if entry is manifest['delf_final21'] else f"Historique — lot {entry['number']}"
    target = summary['target_trios']
    remaining_images = entry['images_still_to_finalize']
    rows.append(f"| [{label}]({Path(entry['packet']).name}) | {target} | {summary['activated_trios']} | {summary['prepared_trios']} | {len(packet['planned_choices'])} | {len(packet['published_images'])} | {remaining_images if remaining_images is not None else 'À définir'} |")
manifest['historical_remaining'] = sum(r['count'] - r['activated_trios'] for r in manifest['historical_batches'])
manifest['delf_remaining'] = manifest['delf_final21']['count'] - manifest['delf_final21']['activated_trios']
updated_date = max(updated_times).astimezone(ZoneInfo('Europe/Zurich')).date()
date_label = f'{updated_date.day} novembre' if updated_date.month == 11 else updated_date.strftime('%d/%m/%Y')
blocker = manifest.get('generation_blocker')
blocker_paragraph = ''
correction_paragraph = ''
casting_prefix = '**Reprise des personnages et du comptoir.**'
casting_path = ROOT / 'docs/tcf/reprise-personnages-20261127.json'
casting_paragraph = ''
if casting_path.exists():
    casting = json.loads(casting_path.read_text())
    casting_counts = Counter()
    for counts in casting['casting_summary'].values():
        casting_counts.update(counts)
    remaining_cast = casting_counts['redraw_pending_images']
    casting_progress = (
        f'{remaining_cast} illustrations repérées restent à reprendre ou à contrôler. ' if remaining_cast
        else f"{casting_counts['visually_reviewed_images']} illustrations ont été redessinées et contrôlées. "
    )
    table_proof = casting.get('table_scene_browser_verification')
    if table_proof:
        table_images = sum(len(question['images']) for question in table_proof['questions'])
        casting_progress += f'Les {table_images} scènes de table corrigées ont été vérifiées dans le catalogue audio. '
    casting_paragraph = (
        f"{casting_prefix} Le comptoir de l’office du tourisme masque les chaussures de l’employé. "
        f"La comparaison de {len(casting['reviewed_lots'])} lots a signalé {casting_counts['review_required']} trios. "
        f"{casting_counts['corrected_active_trio']} trios actifs utilisent les nouvelles versions et "
        f"{casting_counts['prepared_not_activated']} trios historiques redessinés sont prêts. "
        f"{casting_progress}"
        '[Questions et versions](../reprise-personnages-20261127.json).\n\n'
    )
if any(row['question_index'] == 39 for row in pending_corrections):
    correction_paragraph = (
        '**Reprise prioritaire — question 39.** Les trois images du rayon frais « au fond », '
        '« à l’entrée » et « devant les caisses » sont écartées des choix prêts à la demande de l’utilisateur. '
        'Le magasin doit avoir un agencement naturel, des frigos intégrés aux rayons et une circulation dégagée. '
        'Les premières images restent dans la banque ; les trois nouvelles variantes sont à produire puis à revoir ensemble. '
        '[Consignes et chemins de remplacement](reprise-question39.json).\n\n'
    )
elif 39 in completed_corrections:
    first_lot = manifest['historical_batches'][0]
    correction_status = ('Le trio est actif dans le premier lot. ' if first_lot['activated_trios'] == first_lot['count']
                         else 'Le trio est prêt pour l’activation du premier lot. ')
    correction_paragraph = (
        '**Reprise prioritaire — question 39.** Les trois nouvelles scènes du rayon frais ont été '
        'comparées. Les portes, les caisses et la profondeur du magasin permettent de distinguer les '
        'emplacements. Les frigos sont intégrés aux rayons et les passages restent dégagés. '
        f'{correction_status}'
        '[Preuves de la reprise](reprise-question39.json).\n\n'
    )
if blocker and blocker['status'] == 'usage_limit_reached':
    reset = datetime.fromisoformat(blocker['reset_at_europe_zurich'])
    blocker_paragraph = (
        '**Génération suspendue par le quota du service.** '
        f"Réouverture annoncée le {reset:%d/%m/%Y} à {reset:%H h %M min %S s}, heure suisse. "
        f"[Réponse du service et demandes concernées]({Path(blocker['register']).name}). "
        'Les revues déjà terminées sont conservées ; aucun lot incomplet n’est activé.\n\n'
    )
elif blocker and blocker['status'] == 'resumed':
    resumed = datetime.fromisoformat(blocker['resumed_at_europe_zurich'])
    blocker_paragraph = (
        f'**Génération reprise le {resumed:%d/%m/%Y}.** Le bilan ci-dessus inclut les images revues après la reprise. '
        f"[Historique de la limite d’usage]({Path(blocker['register']).name}).\n\n"
    )
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
text = """# Lots d’images TCF du 24 novembre 2026

Demande : terminer les **21 candidats DELF Actif**, puis les **261 trios historiques** par lots de **100, 100 et 61**. Les fichiers restent séparés de ceux des lots anciens et gardent les sources, questions, corrigés et empreintes de départ.

| Lot | Cible | Activés | Prêts après revue comparative | Trios avec briefs | Nouvelles images publiées | Images à finaliser |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
""" + '\n'.join(rows) + f"""

**Reste : {manifest['delf_remaining']} candidat DELF et {manifest['historical_remaining']} trios historiques.** Les briefs et les images publiées d’un lot incomplet ne sont pas comptés comme des trios activés.

{correction_paragraph}{casting_paragraph}{blocker_paragraph}Les 21 derniers DELF ont été activés avec 50 nouveaux PNG natifs 1448 × 1086 et 13 images réutilisées. Les objets ont un fond ivoire contrôlé par mesure. Les variantes relationnelles partagent leur sujet et leur cadrage. Les propositions trop photographiques ont été reprises et leurs sources conservées dans le dossier de preuves.

Chaque activation exige trois illustrations contrôlées et une note comparative liée à la source. Aucune nouvelle écoute humaine n’est déclarée : la relecture porte sur les transcriptions actives. Les fichiers MP3, les bonnes réponses, les textes et les fragments JSON éditoriaux restent inchangés.

Contrôles : `python3 scripts/check-tcf-image-batch-20261124.py <registre-activation>`, `python3 scripts/check-delf-actif-images.py`, `node scripts/check-tcf-bank.mjs`, `node scripts/check-tcf-qcm-images.mjs` et tests du catalogue. Passer également les registres d’activation ultérieurs. Pour vérifier les corrections et l’ajout audio, ajouter `--revisions docs/tcf/corrections-transports-20261126.json`, `--revisions docs/tcf/reprise-personnages-20261127.json`, `--revisions docs/tcf/remplacement-audio/contre-verification-audio-pdf-20261127.json` et `--revisions docs/tcf/reussir-delf-a1-20261127/installation.json`.

Outils de reprise : `scripts/tcf-image-batch-jobs-20261124.py` sélectionne les générations dont la référence a été revue ; `scripts/publish-tcf-image-batch-20261124.py` publie uniquement une liste de revues visuelles explicites ; `scripts/activate-tcf-image-batch-20261124.py` active un lot entièrement prêt. Actualiser ce bilan avec `scripts/report-tcf-image-batches-20261124.py`.

Lorsque la banque locale contient déjà des activations et des corrections documentées, passer leurs registres à l’outil d’activation avec `--previous-activation` (dans l’ordre des lots) et `--revisions` (dans l’ordre des corrections). La banque et les sources sont revérifiées avant l’écriture du lot suivant.
"""
(FOLDER / 'README.md').write_text(text)

# Keep the current overview in sync without rewriting dated reports of old lots.
audit = json.loads((ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json').read_text())
reviewed = sum(r['collection'] == 'TCF' and r['status'] == 'visually_reviewed' for r in audit['images'])
gallery = len(json.loads((ROOT / 'src/gallery/catalog.generated.json').read_text()))
fmt = lambda number: f'{number:,}'.replace(',', ' ')
first = manifest['historical_batches'][0]
historical = manifest['historical_batches']
planned_historical = sum(batch['planned_trios'] for batch in historical)
prepared_historical = sum(batch['prepared_trios'] - batch['activated_trios'] for batch in historical)
historical_progress_prefix = '**Préparation des lots historiques.**'
historical_paragraph = (
    f'{historical_progress_prefix} Les consignes visuelles couvrent {planned_historical} questions. '
    f'{prepared_historical} trios ont passé la revue comparative et attendent l’activation de leur lot. '
    '[Suivi de chaque lot](lots-images-20261124/README.md).'
)
first_completed = first['activated_trios'] == first['count']
progress = (f"Le premier lot est terminé : {first['activated_trios']} trios activés et {first['published_images']} images préparées."
            if first_completed else
            f"Le premier lot dispose de {first['planned_trios']} briefs, de {first['published_images']} nouvelles images publiées "
            f"et de {first['prepared_trios']} trios prêts ; ses trios ne sont pas encore activés.")
legacy = json.loads((ROOT / 'docs/tcf/revue-763-20261107.json').read_text())
legacy_rows = legacy['questions']
pending = [r for r in legacy_rows if r['status'].startswith('artwork_needed')]
active = sum(r['status'] == 'active_reviewed_trio' for r in legacy_rows)
retained = len(legacy_rows) - len(pending) - active
assert len(pending) == manifest['historical_remaining'], 'Batch and historical ledgers disagree'
levels = Counter(next(level for level in ['a0-a1', 'a1-a2', 'a2-b1'] if f'/{level}/' in r['bank']) for r in pending)
categories = Counter(r['status'] for r in pending)
phase = json.loads((ROOT / 'docs/tcf/extension-573-20261107.json').read_text())
phase_keys = set(phase['question_keys'])
phase_statuses = Counter(r['status'] for r in legacy_rows if r['key'] in phase_keys)
phase_active = phase_statuses['active_reviewed_trio']
phase_pending = sum(number for status, number in phase_statuses.items() if status.startswith('artwork_needed'))
phase_retained = len(phase_keys) - phase_active - phase_pending
overview = ROOT / 'docs/tcf/avancement-cahier-des-charges-20261122.md'
value = overview.read_text()
value = re.sub(r'^# Cahier des charges TCF — état du .+$', f'# Cahier des charges TCF — état du {date_label} {updated_date.year}', value, flags=re.M)
value = re.sub(r'Le premier lot (?:dispose de \d+ briefs, de \d+ nouvelles images (?:validées|publiées) et de \d+ trios prêts ; ses trios ne sont pas encore activés|est terminé : \d+ trios activés et \d+ images préparées)\.', progress, value)
blocker_prefix = '**Génération suspendue par le quota du service.**'
paragraphs = [paragraph for paragraph in value.split('\n\n')
              if not paragraph.startswith((blocker_prefix, '**Reprise prioritaire — question 39.**', casting_prefix,
                                           historical_progress_prefix))]
position = next((index + 1 for index, paragraph in enumerate(paragraphs)
                 if paragraph.startswith('**Le reliquat DELF de 21 trios')), len(paragraphs))
paragraphs.insert(position, historical_paragraph)
position += 1
if correction_paragraph:
    paragraphs.insert(position, correction_paragraph.strip().replace(
        '](reprise-question39.json)', '](lots-images-20261124/reprise-question39.json)'))
    position += 1
if casting_paragraph:
    paragraphs.insert(position, casting_paragraph.strip().replace('](../reprise-personnages-', '](reprise-personnages-'))
    position += 1
if blocker_paragraph:
    overview_blocker = blocker_paragraph.strip().replace(
        f"]({Path(blocker['register']).name})", f"](lots-images-20261124/{Path(blocker['register']).name})")
    paragraphs.insert(position, overview_blocker)
value = '\n\n'.join(paragraphs)
detail = (f"{levels['a0-a1']} A1, {levels['a1-a2']} A2 et {levels['a2-b1']} B1 ; "
          f"{categories['artwork_needed_contextual_locations']} scènes ou lieux contextuels, "
          f"{categories['artwork_needed_whole_answer_concepts']} ensembles de concepts et "
          f"{categories['artwork_needed_distinct_document_types']} familles de documents") if pending else 'Tous les trios demandés ont été activés après revue.'
value = re.sub(r'^\| Trios historiques CE/CO \|.*$', f'| Trios historiques CE/CO | **{len(pending)} trios** | {detail} |', value, flags=re.M)
value = re.sub(r'\*\*\d+ trios historiques restent à (?:traiter au total|activer)\*\*',
               f'**{len(pending)} trios historiques restent à activer**', value)
value = re.sub(r'Le reliquat historique contient encore \d+ trios A1\.',
    f"Le reliquat historique contient encore {levels['a0-a1']} trios A1." if levels['a0-a1'] else 'Les trios historiques A1 sont terminés.', value)
value = re.sub(r'^- Historique :.*$',
    f'- Historique : **{active} trios actifs**, {retained} questions conservées en texte, {len(pending)} trios à préparer. '
    f'Le suivi initial de 573 compte {phase_active} actifs, {phase_retained} texte conservé et {phase_pending} à préparer.', value, flags=re.M)
value = re.sub(r'Le catalogue compte [\d ]+ images ; les [\d ]+ titres', f'Le catalogue compte {fmt(gallery)} images ; les {fmt(reviewed)} titres', value)
value = re.sub(r'\*\*Terminé : [\d ]+ fichiers relus, zéro en attente\*\*', f'**Terminé : {fmt(reviewed)} fichiers relus, zéro en attente**', value)
value = value.replace('Les 50 nouvelles images du reliquat DELF ont leur revue visuelle et leurs mots-clés propres', 'Les créations DELF et historiques publiées ont leur revue visuelle et leurs mots-clés propres')
overview.write_text(value)
timeline = ROOT / 'docs/tcf/avancement-images.md'
value = timeline.read_text()
paragraphs = value.split('\n\n')
for index, paragraph in enumerate(paragraphs):
    if paragraph.startswith('**État du ') and 'les 21 derniers candidats DELF' in paragraph:
        paragraph = re.sub(r'^\*\*État du .+? :', f'**État du {date_label} :', paragraph)
        paragraph = re.sub(r'le premier dispose de \d+ briefs, de \d+ nouvelles images (?:validées|publiées) et de \d+ trios prêts, non activés\.',
            f"le premier est terminé avec {first['activated_trios']} trios activés." if first_completed else
            f"le premier dispose de {first['planned_trios']} briefs, de {first['published_images']} nouvelles images publiées et de {first['prepared_trios']} trios prêts, non activés.", paragraph)
        paragraph = re.sub(r'Les \*\*\d+ historiques(?: restants)?\*\* sont suivis', f'Les **{len(pending)} historiques restants** sont suivis', paragraph)
        paragraph = re.sub(r'Galerie : \*\*[\d ]+ images\*\*, dont \*\*[\d ]+ TCF', f'Galerie : **{fmt(gallery)} images**, dont **{fmt(reviewed)} TCF', paragraph)
        paragraphs[index] = paragraph
timeline.write_text('\n\n'.join(paragraphs))
gallery_readme = ROOT / 'docs/gallery/README.md'
value = gallery_readme.read_text()
paragraphs = value.split('\n\n')
for index, paragraph in enumerate(paragraphs):
    if paragraph.startswith('État du ') and 'Le reliquat DELF ajoute 50 images' in paragraph:
        paragraphs[index] = (f"État du {date_label} : **{fmt(gallery)} images indexées**, dont **{fmt(reviewed)} TCF avec titres et mots-clés revus sur les pixels**, "
            f"aucun fichier TCF en attente de cette revue. Le reliquat DELF ajoute 50 images et la préparation historique en ajoute {first['published_images']}. "
            'Les originaux et les illustrations de grammaire reçues depuis restent conservés. [Suivi TCF](../tcf/lots-images-20261124/README.md).')
gallery_readme.write_text('\n\n'.join(paragraphs))
print(json.dumps(dict(delf_remaining=manifest['delf_remaining'], historical_remaining=manifest['historical_remaining'])))
