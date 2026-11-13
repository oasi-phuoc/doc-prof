"""Prepare missing gallery subjects; reuse candidates must be visually reviewed first."""
from pathlib import Path
import json
import subprocess
import re

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / 'docs/gallery/extension-tcf-20261113.json'
STYLE_OBJECT = '/lib/images/tcf/qcm-audit/co834-boissons-dessinees.webp'
STYLE_PEOPLE = '/lib/images/tcf/qcm-audit/co834-club-musique-dessine.webp'
STYLE_JOBS = '/lib/images/tcf/qcm-audit/extension573-architecte-atelier.png'
COMMON = ('Créer une nouvelle illustration du seul sujet décrit ci-dessous, en reprenant uniquement la technique peinte de la référence TCF validée. '
          'Supprimer tous les objets, personnages et instruments de la référence ; ne pas copier ses visages, plantes, étagères ou meubles. '
          'Peinture numérique semi-réaliste détaillée, volumes doux et progressifs, contours fins discrets, couleurs naturelles chaleureuses. '
          'Ni photo, ni 3D, ni gros contours BD. Format PAYSAGE EXACTEMENT 4:3. Sujet entier avec des marges ; anatomie et proportions exactes. '
          'UNE seule composition cohérente, aucun collage, séquence, panneau, bulle ou encadré. '
          'Aucun mot, lettre, chiffre, logo, signature, date, jour, mois, prix ou montant. ')
PEOPLE = ['une femme noire adulte aux cheveux courts naturels', 'un homme asiatique adulte aux cheveux courts',
          'une femme adulte à peau brune portant un foulard bleu', 'un homme blanc adulte aux cheveux gris et lunettes',
          'une femme asiatique adulte aux cheveux courts', 'un homme noir adulte avec une barbe courte',
          'une femme blanche adulte aux cheveux roux bouclés', 'un homme adulte à peau brune aux cheveux bouclés']
FEMININE_JOBS = {'infirmière', 'professeure', 'serveuse', 'vendeuse', 'couturière',
                'hôtesse de l’air', 'policière', 'écrivaine', 'actrice', 'chanteuse',
                'danseuse', 'costumière', 'avocate'}
MASCULINE_JOBS = {'infirmier', 'professeur', 'serveur', 'vendeur', 'couturier',
                 'steward', 'policier', 'écrivain', 'acteur', 'chanteur', 'danseur', 'avocat'}


def person_for_job(label, index):
    candidates = [p for p in PEOPLE if (label not in FEMININE_JOBS or p.startswith('une femme'))
                  and (label not in MASCULINE_JOBS or p.startswith('un homme'))]
    return candidates[index % len(candidates)]


MEDICAL = {
'rhume': 'Une personne enrhumée se mouche avec un mouchoir, nez légèrement rouge, un autre mouchoir et verre d’eau à côté, pas de thermomètre ou lésion.',
'grippe': 'Une personne grippée très fatiguée et fébrile se repose sous une couverture, main sur le front, thermomètre sans affichage lisible, eau et mouchoirs proches.',
'rhinite allergique': 'Une personne près d’une fenêtre ouverte sur des fleurs se frotte le nez et tient un mouchoir, yeux légèrement larmoyants, végétaux en fleurs clairement présents.',
'asthme': 'Une personne asthmatique assise utilise correctement un inhalateur doseur par la bouche, posture légèrement penchée en avant, inhalateur entier sans marque.',
'bronchite': 'Une personne tousse dans son coude, main sur le haut de sa poitrine ; ambiance sobre d’un cabinet médical, sans radiographie fictive ni texte.',
'pneumonie': 'Illustration pédagogique médicale d’une paire de poumons, une zone localisée d’infection inflammatoire rouge dans un lobe inférieur et bronchioles visibles, fond crème, aucune scène de détresse.',
'angine': 'Une personne ouvre la bouche devant un miroir de salle de bain, gorge et amygdales rouges visibles avec éclairage doux, aucun sang ni lésion exagérée.',
'laryngite': 'Une personne enrouée touche le devant de sa gorge au niveau du larynx, légère zone rouge diffuse locale, boisson tiède proche, pas de bulle de texte.',
'sinusite': 'Une personne applique doucement une compresse sur ses joues et le nez, zones des sinus frontaux et maxillaires légèrement mises en évidence en rouge discret, pas de lésion.',
'otite': 'Une personne assise tient doucement une oreille rouge douloureuse ; un otoscope posé sur une petite table à côté, aucun écoulement sanglant.',
'conjonctivite': 'Vue rapprochée du visage entier d’une personne avec un œil légèrement rouge et larmoyant, paupières un peu irritées, aucune déformation ou blessure.',
'carie dentaire': 'Une molaire entière vue de trois quarts avec une petite cavité sombre sur la surface de mastication, anatomie crédible, aucune bouche sanglante.',
'gingivite': 'Vue pédagogique de dents et gencives légèrement rouges et gonflées au bord des dents, pas de saignement, fond crème et style doux.',
'gastro-entérite': 'Une personne assise près de la porte de la salle de bain, main sur le ventre avec une expression d’inconfort, petit bol et verre d’eau à proximité, aucun vomissement montré.',
'reflux gastrique': 'Vue anatomique pédagogique de l’estomac et du bas de l’œsophage avec une petite remontée de liquide acide orangé dans le bas de l’œsophage, pas de texte ou flèche.',
'constipation': 'Une personne habillée debout dans une salle de bain, main sur le bas du ventre avec expression de gêne ; eau et aliments riches en fibres visibles à côté, pas de nudité.',
'diarrhée': 'Une personne habillée tenant son ventre près de la porte de toilettes, verre d’eau et solution de réhydratation sans inscription, aucune matière corporelle.',
'migraine': 'Une personne se repose dans une chambre à lumière tamisée, main sur une tempe douloureuse légèrement rouge, rideau tiré, aucun écran lumineux.',
'eczéma': 'Un avant-bras entier avec une petite plaque sèche rouge dans le pli du coude, peau environnante normale, léger grattage de l’autre main, aucun saignement.',
'psoriasis': 'Un coude avec une plaque rouge bien délimitée couverte de fines squames blanchâtres, anatomie crédible, fond crème, pas de lésion sanglante.',
'urticaire': 'Un avant-bras avec quelques petites plaques surélevées rosées arrondies de tailles différentes, peau normale entre les plaques, sans blessure.',
'acné': 'Visage entier d’un jeune adulte avec quelques comédons et petits boutons sur le front et les joues, représentation respectueuse réaliste et modérée.',
'varicelle': 'Une personne avec quelques petites vésicules rouges et croûtes sèches dispersées sur les avant-bras, lésions discrètes de stades différents, visage naturel, sans détail gore.',
'rougeole': 'Une personne fatiguée présentant une éruption maculopapuleuse rouge modérée sur le visage, cou et haut du corps habillé, aucun détail sanglant.',
'zona': 'Vue pédagogique du côté d’un torse adulte avec une petite bande unilatérale horizontale de vésicules rouges au niveau des côtes, respect de l’anatomie, sans sang.',
'verrue': 'Une main entière montrant une petite verrue commune rugueuse sur un doigt, peau normale ailleurs, fond crème.',
'mycose du pied': 'Un pied entier avec légère irritation et desquamation blanchâtre entre deux orteils, pas de plaie, fond crème.',
'poux': 'Un seul pou de tête vu de très près sur un cheveu, six pattes adaptées à agripper le cheveu, quelques lentes attachées à des cheveux voisins, pas d’insecte géant sur un visage.',
'diabète': 'Une personne adulte effectue son autosurveillance glycémique : petit glucomètre sans chiffres lisibles, bandelette et autopiqueur au bout d’un doigt, objets clairement identifiables, pas de marque.',
'hypertension artérielle': 'Une personne assise calmement avec brassard de tensiomètre sur le bras à hauteur du cœur, avant-bras posé, écran sans valeur lisible ; suivi de la tension, pas de douleur thoracique exagérée.',
'anémie': 'Illustration pédagogique de globules rouges normaux et de plusieurs globules plus petits et plus pâles dans un même flux sanguin simplifié, sans chiffres ou texte.',
'arthrose': 'Une articulation de genou vue en coupe pédagogique avec cartilage aminci et surfaces articulaires rapprochées, os et cartilage crédibles, sans chirurgie ou sang.',
'arthrite': 'Deux mains entières avec articulations des doigts légèrement gonflées et rouges ; la personne les masse doucement, représentation modérée.',
'ostéoporose': 'Un seul os long entier en coupe partielle montrant un réseau trabéculaire très poreux et fin à son extrémité, illustration anatomique douce sans texte.',
 'tendinite': 'Un avant-bras et une main entiers, tendon du poignet légèrement mis en évidence en rouge diffus, l’autre main tient doucement le poignet, pas de plaie.',
'sciatique': 'Une personne debout vue de trois quarts arrière, douleur montrée par une fine zone rouge diffuse allant du bas du dos à l’arrière d’une seule jambe, personne entière et habillée.',
'lombalgie': 'Une personne entière habillée se tient le bas du dos avec une expression d’inconfort, rougeur diffuse limitée aux lombaires, aucun trajet sur la jambe.',
'entorse de la cheville': 'Une personne assise avec une cheville légèrement gonflée soutenue par un bandage, pied entier, poche froide posée à proximité, aucune déformation.',
'fracture du bras': 'Une personne adulte avec un bras dans un plâtre uni et une écharpe de soutien, posture calme, aucun os apparent.',
'brûlure superficielle': 'Un avant-bras avec une petite zone rouge superficielle sous un filet d’eau fraîche au robinet, aucune peau détruite ou blessure profonde.',
'coupure superficielle': 'Une main entière avec une très petite coupure propre sur un doigt recouverte d’un petit pansement, compresse et bande de pansement à côté, pas de sang visible.',
'déshydratation': 'Une personne adulte assoiffée, lèvres légèrement sèches, assise à l’ombre et buvant de l’eau, verre et carafe visibles, pas de détresse sévère.',
'insolation': 'Une personne adulte à l’ombre d’un parasol, visage un peu rougi, compresse fraîche sur le front et verre d’eau, chapeau retiré à côté, aucune scène extrême.',
'allergie alimentaire': 'Une personne avec quelques plaques d’urticaire discrètes sur l’avant-bras près d’une assiette contenant des noix, elle a cessé de manger, pas d’étouffement ou détresse.',
'allergie au pollen': 'Une personne éternue dans un mouchoir devant une fenêtre sur un jardin en fleurs, yeux un peu larmoyants, pas de virus dessiné.',
'insomnie': 'Une personne éveillée dans son lit pendant la nuit, yeux ouverts et expression fatiguée, lune vue à la fenêtre, aucune horloge ou texte.',
'apnée du sommeil': 'Une personne endormie avec un masque nasal de ventilation relié correctement à un appareil PPC/CPAP sur la table de chevet, aucun chiffre ou marque.',
'dépression': 'Une personne adulte assise dans un cadre calme parle avec une professionnelle de santé qui écoute avec bienveillance, posture fatiguée sans caricature, pas de symbole dramatique ou danger.',
 'trouble anxieux': 'Une personne adulte assise, mains serrées et épaules tendues, accompagnée par une professionnelle de santé bienveillante dans un cadre calme ; pas de métaphore menaçante.',
'maladie de Parkinson': 'Une personne âgée à son domicile, posture légèrement courbée et petit tremblement suggéré par une main floue très subtile, un proche l’aide à saisir une tasse sans danger, pas de caricature.',
'maladie d’Alzheimer': 'Une personne âgée est accompagnée avec douceur par un proche qui lui montre un album photo, cadre familial clair, pas d’étiquette diagnostique ou stéréotype humiliant.',
'épilepsie': 'Une personne réalise un examen EEG calme avec électrodes sur le cuir chevelu et technicien à côté, écran avec tracés sans chiffres ; pas de crise dangereuse.',
'cataracte': 'Un œil humain entier en coupe partielle pédagogique avec cristallin opaque blanchâtre derrière la pupille, dessin anatomique sobre et non sanglant.',
'myopie': 'Une personne porte des lunettes et lit un livre proche ; un opticien montre une paire de lunettes dans son cabinet, pas de texte lisible ou chiffres.',
'surdité': 'Une personne adulte porte une aide auditive derrière l’oreille et échange avec un interlocuteur qui lui fait face, communication bienveillante sans stéréotype.',
'insuffisance cardiaque': 'Une personne adulte dans un cabinet de cardiologie, examen par stéthoscope et petit modèle anatomique de cœur sur le bureau, pas de scène d’urgence ou tracé inventé.',
'cancer du sein': 'Illustration pédagogique d’un sein anatomique en coupe partielle montrant une petite masse irrégulière localisée dans le tissu glandulaire, pas de nudité sexualisée, ni plaie ou texte.',
'cancer de la peau': 'Une petite zone de peau avec une lésion pigmentée asymétrique à bords irréguliers et plusieurs nuances brunes, loupe de dermatologue à côté, aucun sang.',
'infection urinaire': 'Illustration pédagogique de la vessie et du court début de l’urètre, muqueuse légèrement rouge indiquant une inflammation localisée, fond crème, pas de nudité.',
'calcul rénal': 'Un rein humain en coupe partielle montrant un petit calcul beige dans le bassinet et début de l’uretère, anatomie crédible, aucun sang.',
'fièvre': 'Une personne au repos prend sa température avec un thermomètre sans chiffres lisibles, visage légèrement rougi et compresse fraîche proche.',
'toux': 'Une personne adulte tousse dans son coude, mouvement de bouche visible, pas de texte ou particules dessinées.',
'éternuement': 'Une personne éternue dans un mouchoir qui couvre correctement nez et bouche, yeux fermés, pas de texte ou particules.',
'nez qui coule': 'Une personne se tamponne doucement le nez avec un mouchoir, nez légèrement rouge et humide, aucun écoulement exagéré.',
'nez bouché': 'Une personne adulte à la salle de bain fait un lavage nasal avec un petit flacon de sérum physiologique, nez légèrement rouge, pas de marque.',
'nausée': 'Une personne adulte assise tient doucement le haut du ventre, teint naturel et expression de nausée ; un petit bol vide à proximité, aucune matière corporelle.',
'vomissement': 'Une personne adulte penchée au-dessus d’un lavabo dans une salle de bain, autre main sur le ventre, aucun vomi ou fluide montré.',
'vertige': 'Une personne adulte assise et soutenue par un proche, une main sur le front, posture prudente, pas d’étoiles ou spirales de dessin animé.',
'fatigue': 'Une personne adulte fatiguée bâille en s’étirant sur un canapé, environnement calme, pas de café ou boisson énergisante.',
'essoufflement': 'Une personne adulte arrête de monter un escalier, s’appuie sur la rampe et reprend calmement son souffle, corps entier, pas d’urgence.',
'démangeaison': 'Une personne adulte gratte légèrement son avant-bras avec l’autre main, petite zone irritée rouge discrète, sans plaie.',
'crampe musculaire': 'Une personne assise tient son mollet douloureux après une marche, jambe entière, zone musculaire légèrement rouge, pas de lésion.',
'gonflement du genou': 'Une personne assise observe un genou un peu gonflé et soutient la jambe, peau et anatomie normales, comparaison avec l’autre genou naturellement visible.',
'saignement de nez': 'Une personne assise penchée légèrement en avant pince la partie souple du nez avec un mouchoir propre, aucune traînée de sang.',
'perte d’appétit': 'Une personne adulte regarde sans envie une petite assiette de repas presque intacte, couverts reposés, attitude fatiguée calme sans stéréotype.'}


def prepare():
    plan = json.loads(PLAN.read_text())
    job_style_commit = subprocess.check_output(
        ['git', 'log', '-1', '--format=%H', '--', 'public' + STYLE_JOBS], cwd=ROOT, text=True).strip()
    assert job_style_commit, 'La référence métier choisie doit être versionnée avant préparation'
    known = {j['id'] for j in plan['jobs']}
    buckets = {name: [] for name in ['Animal', 'Végétal', 'Métier', 'Maladie']}
    for i, subject in enumerate(plan['subjects']):
        metadata = ROOT / 'docs/gallery/generation-20261113' / (subject['id'] + '.json')
        if metadata.exists() and json.loads(metadata.read_text())['status'] == 'visually_reviewed':
            continue
        if subject['id'] in known:
            continue
        typ, label, sub = subject['type'], subject['label'], subject['subtype']
        directory = {'Animal': 'animaux', 'Végétal': 'vegetaux', 'Métier': 'metiers', 'Maladie': 'maladies'}[typ]
        slug = subject['id'].split('-' + {'Animal': 'animal', 'Végétal': 'vegetal', 'Métier': 'metier', 'Maladie': 'maladie'}[typ] + '-', 1)[1]
        if typ == 'Animal':
            detail = (f'Un seul animal VIVANT : {label}. Espèce réelle, corps entier avec tous les membres, tête et queue visibles. '
                      'Respecter exactement l’anatomie et les caractères distinctifs de l’espèce. Fond crème opaque, ombre très légère. '
                      'Aucun aliment cuit, filet, viande, assiette, outil, accessoire ou légende. Pour un animal marin, posture de nage naturelle dans un espace crème sobre. '
                      'Pour les insectes six pattes ; araignées et scorpions huit pattes ; autres groupes selon leur anatomie réelle.')
        elif typ == 'Végétal':
            detail = (f'Sujet végétal/aliment brut : {label}, catégorie {sub}. Représentation botanique précise et reconnaissable du sujet entier '
                      '(pour une herbe : un rameau avec ses feuilles ; arbre : arbre entier caractéristique ; fleur : tige, fleur et feuilles). '
                      'Fond crème opaque et ombre légère, pas de panier, plat préparé, emballage ou personne. '
                      'Pour un fruit ou légume montrer principalement un seul spécimen entier ; une demi-coupe peut aider uniquement si elle est indispensable à l’identification. '
                      'Avocat signifie ici le FRUIT et rose signifie la FLEUR ; jamais un avocat-juriste ni un carré de couleur.')
        elif typ == 'Métier':
            # Keep paired vocabulary forms consistent with the pictured person.
            person = person_for_job(label, i)
            detail = (f'Métier réel : {label}. Montrer {person} en train d’exercer cette profession, '
                      'avec geste professionnel précis, véritables outils et lieu de travail approprié. '
                      'Ne pas réduire le métier à une tenue ou un portrait sans activité ; décor entier peint sobre. '
                      'Varier les visages, vêtements et rôles sans stéréotypes, pas de duplication de la salle de la référence. '
                      'Avocat désigne ici le juriste, et glacier le fabricant de glaces. Aucun fruit ou paysage glaciaire comme sujet.')
        else:
            if sub == 'Douleurs et parties du corps':
                detail = (f'{PEOPLE[i % len(PEOPLE)]}, personne entière habillée, exprime précisément « {label} ». '
                          'La main touche uniquement la zone anatomique réellement douloureuse, rendue très lisible par une légère rougeur diffuse locale. '
                          'Posture naturelle ; ne pas indiquer une autre partie du corps. Ne pas ajouter d’autre maladie, blessure, sang ou traitement.')
            else:
                assert label in MEDICAL, label
                detail = MEDICAL[label]
            detail = ('Illustration pédagogique de santé, thème : ' + label + '. ' + detail +
                      ' Style peint doux, anatomie et matériel médical corrects, personne représentée avec respect. '
                      'Une seule scène ou un seul sujet anatomique, fond crème et contexte sobre. '
                      'Le sujet illustre la manifestation, le soin ou l’examen décrit ; ne pas inventer une maladie reconnaissable à un simple visage. '
                      'Ni pictogrammes flottants, ni diagnostic écrit, ni chiffre sur écran, ni médicament de marque, ni scène graphique.')
        style = STYLE_OBJECT if typ in ['Animal', 'Végétal'] else (STYLE_JOBS if typ == 'Métier' else STYLE_PEOPLE)
        job = dict(subject, path=f'/lib/images/tcf/catalogue/{directory}/{slug}.webp', status='planned',
                   prompt=COMMON + 'Sujet : ' + detail, reference_images=[str(ROOT / 'public' / style.lstrip('/'))],
                   style_references=[style])
        if typ == 'Métier':
            job['style_reference_commit'] = job_style_commit
        buckets[typ].append(job)
    # Each successive group covers all four requested families; no family is
    # silently omitted if the image service stops this long queue at its quota.
    jobs = []
    while any(buckets.values()):
        for values in buckets.values():
            if values:
                jobs.append(values.pop(0))
    plan['jobs'] += jobs
    PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    from collections import defaultdict
    families = {name: defaultdict(list) for name in ['Animal', 'Végétal', 'Métier', 'Maladie']}
    for index, job in enumerate(plan['jobs']):
        if job['type'] == 'Action':
            continue
        metadata = ROOT / 'docs/gallery/generation-20261113' / (job['id'] + '.json')
        state = json.loads(metadata.read_text()) if metadata.exists() else {}
        if state and state['status'] not in ['generation_failed', 'rejected_visual_review']:
            continue
        candidate = dict(job)
        if state.get('next_prompt'):
            candidate['prompt'] = state['next_prompt']
        if job['type'] == 'Métier':
            candidate.update(reference_images=[str(ROOT / 'public' / STYLE_JOBS.lstrip('/'))],
                             style_references=[STYLE_JOBS], style_reference_commit=job_style_commit)
            candidate['prompt'] = re.sub(r'Montrer .*? en train',
                                        'Montrer ' + person_for_job(job['label'], index) + ' en train',
                                        candidate['prompt'], count=1)
        candidate['status'] = 'planned'
        families[job['type']][job['subtype']].append(candidate)
    ordered = {name: [] for name in families}
    for name, subgroups in families.items():
        while any(subgroups.values()):
            for values in subgroups.values():
                if values:
                    ordered[name].append(values.pop(0))
    queue = []
    while any(ordered.values()):
        for values in ordered.values():
            if values:
                queue.append(values.pop(0))
    (ROOT / 'docs/gallery/generation-file-sujets-20261113.json').write_text(json.dumps(queue, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(queue)} sujets manquants préparés, en alternance entre les familles et leurs sous-thèmes.')


if __name__ == '__main__':
    prepare()
