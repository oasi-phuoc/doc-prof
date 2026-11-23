"""Refresh the live TCF image progress from reviewed, source-bound registers."""
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / 'docs/tcf/delf-actif-20261113'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    fmt = lambda n: f'{n:,}'.replace(',', ' ')
    packet = read(DIRECTORY / 'lot2-100-20261123-preparation.json')
    result = read(DIRECTORY / 'revue-lot2-100-20261123.json')
    plan = read(DIRECTORY / 'images-a-preparer.json')
    statuses = plan['summary']['statuses']
    audit = read(ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json')
    gallery = read(ROOT / 'src/gallery/catalog.generated.json')
    folder = ROOT / 'docs/gallery/revue-mots-cles-tcf-20261123'
    batches = sorted(folder.glob('lot*.json'))
    rows = [row for batch in batches for row in read(batch)['images']]
    tcf = [row for row in gallery if row['collection'] == 'TCF']
    pending = [row for row in audit['images'] if row['collection'] == 'TCF' and row['status'] != 'visually_reviewed']
    reviewed = len(tcf) - len(pending)
    assert len(rows) == len({row['path'] for row in rows}) == 3811
    assert not pending and reviewed == len(tcf) == audit['progress']['visually_reviewed']
    assert statuses['active_reviewed_trio'] == 725 and statuses['candidate_visual_review'] == 21
    assert packet['summary']['activated_trios'] == 100 and not packet['remaining_asset_ids']
    summary = dict(date=datetime.now(timezone.utc).isoformat(), baseline_commit='cb5e6b88',
        initial_pending=3811, initial_visually_reviewed=566, initial_tcf_images=4377,
        reviewed_in_this_pass=len(rows), batch_count=len(batches),
        additional_generated_images_reviewed=129, progress=audit['progress'],
        gallery_images=len(gallery), tcf_images=len(tcf), remaining_by_directory={},
        method='Chaque fichier actuel examiné sur une planche de ses pixels avant annotation. Titres limités au contenu visible ; mots-clés annotés ou dérivés des titres relus. Aucun nom de fichier, prompt, nom de locuteur ou transcription utilisé comme preuve visuelle.',
        batches=[path.name for path in batches],
        generation_register='docs/tcf/delf-actif-20261113/reprise-generation-20261123.json',
        preservation='Originaux conservés sans modification. 129 PNG natifs ajoutés sous de nouveaux chemins. Seules 100 formes qcm_image ajoutées aux banques ; textes, fragments éditoriaux, réponses, transcriptions, liens et octets MP3 préservés.')
    write(folder / 'suivi.json', summary)
    (folder / 'README.md').write_text(f'''# Revue des titres et mots-clés TCF — 23 novembre 2026

**Terminée : {fmt(reviewed)} images TCF examinées, aucune en attente.** Le catalogue contient {fmt(len(gallery))} images de toutes collections. Le [suivi JSON](suivi.json) et le [registre individuel](../audit-mots-cles-tcf-20261117.json) conservent les compteurs et empreintes actuels.

Le périmètre initial réel comptait 4 377 images TCF : 566 déjà revues et **3 811 revues à effectuer**. L’ancien chiffre de 3 887 était périmé. Les 60 lots de cette reprise couvrent les 3 811 fichiers ; les **129 créations supplémentaires** de la reprise DELF ont reçu leur revue à la publication. Total : 566 + 3 811 + 129 = {fmt(reviewed)}.

Chaque lot conserve chemin, empreinte actuelle, ancienne empreinte d’audit, titre et mots-clés. Les planches ont été vues avant annotation. Les descriptions portent uniquement sur les sujets, gestes, objets et décors visibles ; elles n’intègrent pas les noms des personnages des audios, les questions ou les thèmes pédagogiques. Les termes médicaux ne prétendent pas diagnostiquer les personnages.

Les originaux conservés restent décrits sans être approuvés comme remplacements lorsqu’un style a été refusé. Les images n’ont pas été retouchées par la revue des métadonnées. Le fichier nommé « mulet », par exemple, est décrit comme un poisson.

Les [21 derniers journaux DELF examinés](../../tcf/delf-actif-20261113/reemploi-21-journaux-20261123.json) ont permis sept réemplois supplémentaires. Le [deuxième lot de 100](../../tcf/delf-actif-20261113/lot2-100-20261123.md) est désormais entièrement activé : 231 images préparées et 54 images existantes réemployées, sans changement des sources ou MP3. Pas de nouvelle écoute humaine attestée.

`npm run gallery:index` applique les titres et mots-clés relus à la recherche. La revue des métadonnées ne remplace pas le contrôle pédagogique de chaque futur trio.
''')
    gallery_file = ROOT / 'docs/gallery/README.md'
    text = gallery_file.read_text()
    text = re.sub(r'Le catalogue contient \*\*[^\n]+',
        f'Le catalogue contient **{fmt(len(gallery))} images**, dont **{fmt(len(tcf))} images TCF**. Les **{fmt(reviewed)} titres et listes de mots-clés TCF ont leur revue visuelle enregistrée** ; aucune image TCF ne reste en attente. Les 3 554 entrées d’autres collections au statut `not_started` restent hors de cette revue. Le [suivi du 23 novembre](revue-mots-cles-tcf-20261123/README.md) et le [registre individuel](audit-mots-cles-tcf-20261117.json) conservent lots, empreintes et descriptions. Les thèmes servent aux filtres et ne sont pas fusionnés avec la recherche textuelle.', text)
    text = text.replace('par mots, libellé, thème et nom de fichier', 'dans les titres et mots-clés visuels')
    gallery_file.write_text(text)
    lines = ['# DELF Actif — deuxième lot de 100 terminé, 23 novembre 2026', '',
        '**100 trios relus et activés.** DELF Actif compte désormais **725 trios actifs et 21 candidats restants**, tous B1. Sur les 221 candidats demandés par lots de 100, les deux premiers lots couvrent 200 questions ; le dernier lot de 21 reste à faire.', '',
        '**231 images préparées** : 223 PNG natifs et huit horloges au modèle commun. Les 300 choix utilisent ces créations 242 fois et 54 images existantes 58 fois. La reprise après quota a finalisé les **129 images manquantes** ; il ne reste aucune image ni reprise en attente dans ce deuxième lot.', '',
        'Style peint TCF, format 4:3, personnages et gestes vérifiés. Les objets isolés ont un fond ivoire contrôlé par rapport au repère RGB 253, 242, 225 (écart maximal de trois par canal aux quatre coins). Les scènes ont leur décor naturel. Les variantes liées gardent une convention commune : mêmes grilles, personnages, terrains ou pièces de puzzle selon le besoin.', '',
        'Les huit horloges utilisent le cadran peint et les mêmes aiguilles calculées. Les précisions illustratives ne sont pas présentées comme des minutes attestées par l’audio lorsque le support dit seulement une heure approximative.', '',
        '**Originaux conservés.** Aucun ancien fichier d’image ni MP3 remplacé. Les banques reçoivent seulement les 100 formes `qcm_image` ; textes, fragments éditoriaux, questions, réponses, transcriptions et liens audio sont préservés. La relecture porte sur les transcriptions complètes et les images ; aucune nouvelle écoute humaine des MP3 n’est attestée.', '',
        'Les sept réemplois supplémentaires sont documentés dans la [revue des 21 journaux](reemploi-21-journaux-20261123.json). Les tentatives refusées et références de travail restent archivées hors catalogue.', '',
        '## Suivi durable', '',
        '- [Registre d’activation et preuves des 100 trios](revue-lot2-100-20261123.json)',
        '- [Préparation, sources et empreintes](lot2-100-20261123-preparation.json)',
        '- [Journal des 129 créations de la reprise](reprise-generation-20261123.json)',
        '- [Lots de 100 et dernier lot de 21](lots-de-100-20261122.json)', '',
        '## Les 100 trios', '', '| Nº | Question | Réponses | État |', '| --- | --- | --- | --- |']
    for row in packet['planned_choices']:
        lines.append(f"| {row['index']} | `{row['key']}` | {' / '.join(row['labels']).replace('|', '/')} | Activé |")
    lines.extend(['', '## Contrôles', '',
        '`python3 scripts/check-delf-actif-lot2-preparation-20261123.py` vérifie les 100 ajouts, sources, réponses, MP3, empreintes, cadrans communs et conservation des fragments éditoriaux. `python3 scripts/check-delf-actif-images.py` contrôle les 346 supports et 1 663 questions DELF Actif.', ''])
    (DIRECTORY / 'lot2-100-20261123.md').write_text('\n'.join(lines))
    report = ROOT / 'docs/tcf/avancement-cahier-des-charges-20261122.md'
    text = report.read_text()
    text = re.sub(r'Ce bilan utilise[^\n]+', 'Ce bilan utilise les banques et registres actuels après les deux lots de 100 candidats DELF Actif et la revue complète des métadonnées TCF. Les anciens bilans de lots restent datés : leurs compteurs décrivent leur état à cette date.', text)
    text = re.sub(r'\| Nouveaux supports DELF Actif \|[^\n]+', '| Nouveaux supports DELF Actif | **21 candidats B1** | 200 des 221 candidats demandés sont terminés ; troisième et dernier lot de 21 à préparer |', text)
    text = re.sub(r'\| Titres et mots-clés des images TCF \|[^\n]+', f'| Titres et mots-clés des images TCF | **Terminé : {fmt(reviewed)} fichiers relus, zéro en attente** | 60 lots couvrent les 3 811 fichiers initiaux ; les 129 nouvelles créations ont leur revue dédiée |', text)
    text = text.replace('**382 trios/candidats restent à traiter au total**', '**282 trios/candidats restent à traiter au total**')
    text = re.sub(r'Le deuxième lot est bloqué[^\n]+', '**Le deuxième lot de 100 est terminé et activé.** 231 images préparées (223 PNG natifs, huit horloges) et 54 images existantes couvrent les 300 choix. La génération a repris après la réouverture du quota et a finalisé les 129 fichiers manquants. [Sources, images et preuves](delf-actif-20261113/lot2-100-20261123.md).', text)
    text = text.replace('**625 trios actifs**, 121 candidats', '**725 trios actifs**, 21 candidats B1')
    text = re.sub(r'- Deuxième lot de 100 en préparation[^\n]+', '- Deuxième lot de **100 trios terminé et activé** : 231 images préparées et 54 images existantes ; 242 usages des nouvelles images et 58 réemplois. Sources, réponses et MP3 conservés. [Preuves](delf-actif-20261113/lot2-100-20261123.md).', text)
    text = re.sub(r'Le catalogue compte [^\n]+', f'Le catalogue compte {fmt(len(gallery))} images ; les {fmt(reviewed)} titres et listes de mots-clés TCF ont leur revue visuelle enregistrée. [Lots et empreintes](../gallery/revue-mots-cles-tcf-20261123/README.md).', text)
    report.write_text(text)
    report = ROOT / 'docs/tcf/avancement-images.md'
    text = report.read_text()
    text = re.sub(r'\*\*État du 23 novembre[^\n]+', f'**État du 23 novembre : deuxième lot DELF Actif de 100 trios terminé et activé.** 231 images préparées (223 PNG natifs et huit horloges) et 54 images existantes couvrent les 300 choix. La reprise a finalisé les 129 fichiers manquants ; aucun fichier ne reste à générer dans ce lot. DELF Actif compte **725 trios actifs et 21 candidats B1**. Les **261 trios historiques** restent séparés. Galerie : **{fmt(len(gallery))} images**, dont **{fmt(reviewed)} images TCF avec titres et mots-clés relus**, aucune en attente. [Preuves du lot](delf-actif-20261113/lot2-100-20261123.md) et [reste à faire](avancement-cahier-des-charges-20261122.md).', text, count=1)
    report.write_text(text)
    print(f'{reviewed} TCF metadata reviews complete; {len(gallery)} catalogue images; 725 active DELF trios, 21 candidates.')


if __name__ == '__main__':
    main()
