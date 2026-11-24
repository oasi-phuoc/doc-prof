"""Report live progress from the four resumable image packets."""
import json
from pathlib import Path

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
        images_still_to_finalize=len(packet.get('remaining_asset_ids', [])))
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
print(json.dumps(dict(delf_remaining=manifest['delf_remaining'], historical_remaining=manifest['historical_remaining'])))
