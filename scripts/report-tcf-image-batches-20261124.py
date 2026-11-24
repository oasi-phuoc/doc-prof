"""Report live progress from the four resumable image packets."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'docs/tcf/lots-images-20261124'
manifest_path = FOLDER / 'lots.json'
manifest = json.loads(manifest_path.read_text())
entries = [manifest['delf_final21']] + manifest['historical_batches']
rows = []
for entry in entries:
    packet = json.loads((ROOT / entry['packet']).read_text())
    summary = packet['summary']
    entry.update(status=packet['status'], activated_trios=summary['activated_trios'],
        prepared_trios=summary['prepared_trios'], published_images=len(packet['published_images']),
        planned_trios=len(packet['planned_choices']),
        images_still_to_finalize=len(packet.get('remaining_asset_ids', [])) if packet['planned_choices'] else None)
    if packet.get('activation_register'):
        entry['activation_register'] = packet['activation_register']
    label = 'DELF — reliquat final' if entry is manifest['delf_final21'] else f"Historique — lot {entry['number']}"
    target = summary['target_trios']
    rows.append(f"| [{label}]({Path(entry['packet']).name}) | {target} | {summary['activated_trios']} | {summary['prepared_trios']} | {len(packet['planned_choices'])} | {len(packet['published_images'])} |")
manifest['historical_remaining'] = sum(r['count'] - r['activated_trios'] for r in manifest['historical_batches'])
manifest['delf_remaining'] = manifest['delf_final21']['count'] - manifest['delf_final21']['activated_trios']
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
text = """# Lots d’images TCF du 24 novembre 2026

Demande : terminer les **21 candidats DELF Actif**, puis les **261 trios historiques** par lots de **100, 100 et 61**. Les fichiers restent séparés de ceux des lots anciens et gardent les sources, questions, corrigés et empreintes de départ.

| Lot | Cible | Activés | Prêts après revue comparative | Trios avec briefs | Nouvelles images publiées |
| --- | ---: | ---: | ---: | ---: | ---: |
""" + '\n'.join(rows) + f"""

**Reste : {manifest['delf_remaining']} candidat DELF et {manifest['historical_remaining']} trios historiques.** Les briefs et les images publiées d’un lot incomplet ne sont pas comptés comme des trios activés.

Les 21 derniers DELF sont illustrés par 50 nouveaux PNG natifs 1448 × 1086 et 13 images existantes réutilisées. Le catalogue et les métadonnées visuelles sont actualisés. Les objets ont un fond ivoire contrôlé par mesure ; les variantes relationnelles partagent leur sujet et leur cadrage. Les propositions trop photographiques ont été reprises et leurs sources conservées hors catalogue dans le dossier de preuves.

Chaque activation exige trois illustrations contrôlées et une note comparative liée à la source. Aucune nouvelle écoute humaine n’est déclarée : la relecture porte sur les transcriptions actives. Les fichiers MP3, les bonnes réponses, les textes et les fragments JSON éditoriaux restent inchangés.

Contrôles : `python3 scripts/check-tcf-image-batch-20261124.py <registre-activation>`, `python3 scripts/check-delf-actif-images.py`, `node scripts/check-tcf-bank.mjs`, `node scripts/check-tcf-qcm-images.mjs` et tests du catalogue. Passer également les registres ultérieurs au premier contrôle si d’autres lots ont depuis ajouté leurs variantes.

Outils de reprise : `scripts/tcf-image-batch-jobs-20261124.py` sélectionne les générations dont la référence a été revue ; `scripts/publish-tcf-image-batch-20261124.py` publie uniquement une liste de revues visuelles explicites ; `scripts/activate-tcf-image-batch-20261124.py` active un lot entièrement prêt. Actualiser ce bilan avec `scripts/report-tcf-image-batches-20261124.py`.
"""
(FOLDER / 'README.md').write_text(text)

# Keep the current overview in sync without rewriting dated reports of old lots.
audit = json.loads((ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json').read_text())
reviewed = sum(r['collection'] == 'TCF' and r['status'] == 'visually_reviewed' for r in audit['images'])
gallery = len(json.loads((ROOT / 'src/gallery/catalog.generated.json').read_text()))
fmt = lambda number: f'{number:,}'.replace(',', ' ')
first = manifest['historical_batches'][0]
progress = (f"Le premier lot dispose de {first['planned_trios']} briefs, de {first['published_images']} nouvelles images validées "
            f"et de {first['prepared_trios']} trios prêts ; ses trios ne sont pas encore activés.")
overview = ROOT / 'docs/tcf/avancement-cahier-des-charges-20261122.md'
value = overview.read_text()
value = re.sub(r'Le premier lot dispose de \d+ briefs, de \d+ nouvelles images validées et de \d+ trios prêts ; ses trios ne sont pas encore activés\.', progress, value)
value = re.sub(r'Le catalogue compte [\d ]+ images ; les [\d ]+ titres', f'Le catalogue compte {fmt(gallery)} images ; les {fmt(reviewed)} titres', value)
value = re.sub(r'\*\*Terminé : [\d ]+ fichiers relus, zéro en attente\*\*', f'**Terminé : {fmt(reviewed)} fichiers relus, zéro en attente**', value)
value = value.replace('Les 50 nouvelles images du reliquat DELF ont leur revue visuelle et leurs mots-clés propres', 'Les créations DELF et historiques publiées ont leur revue visuelle et leurs mots-clés propres')
overview.write_text(value)
timeline = ROOT / 'docs/tcf/avancement-images.md'
value = timeline.read_text()
paragraphs = value.split('\n\n')
for index, paragraph in enumerate(paragraphs):
    if paragraph.startswith('**État du 24 novembre :'):
        paragraph = re.sub(r'le premier dispose de \d+ briefs, de \d+ nouvelles images validées et de \d+ trios prêts, non activés\.',
            f"le premier dispose de {first['planned_trios']} briefs, de {first['published_images']} nouvelles images validées et de {first['prepared_trios']} trios prêts, non activés.", paragraph)
        paragraph = re.sub(r'Galerie : \*\*[\d ]+ images\*\*, dont \*\*[\d ]+ TCF', f'Galerie : **{fmt(gallery)} images**, dont **{fmt(reviewed)} TCF', paragraph)
        paragraphs[index] = paragraph
timeline.write_text('\n\n'.join(paragraphs))
gallery_readme = ROOT / 'docs/gallery/README.md'
value = gallery_readme.read_text()
paragraphs = value.split('\n\n')
for index, paragraph in enumerate(paragraphs):
    if paragraph.startswith('État du 24 novembre :'):
        paragraphs[index] = (f"État du 24 novembre : **{fmt(gallery)} images indexées**, dont **{fmt(reviewed)} TCF avec titres et mots-clés revus sur les pixels**, "
            f"aucun fichier TCF en attente de cette revue. Le reliquat DELF ajoute 50 images et la préparation historique en ajoute {first['published_images']}. "
            'Les originaux et les illustrations de grammaire reçues depuis restent conservés. [Suivi TCF](../tcf/lots-images-20261124/README.md).')
gallery_readme.write_text('\n\n'.join(paragraphs))
print(json.dumps(dict(delf_remaining=manifest['delf_remaining'], historical_remaining=manifest['historical_remaining'])))
