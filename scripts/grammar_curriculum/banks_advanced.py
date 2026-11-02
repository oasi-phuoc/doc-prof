from bank_common import *
from banks_verbs import AVOIR_ONLY,ETRE_SUBJECTS,REFLEXIVE_BASE

rows=[];negatives=[];mixed=[];futuremix=[];hyp=[];hyp2=[];mode=[]
for i,(v,comp) in enumerate(AVOIR_ONLY):
 subject,p=SUBJECTS[(i*3)%8];f=present(v)[p];pc=past_forms(v)[p];imp=imparfait(v)[p]
 rows.append(item(sentence(subject,pc,comp,v,leading='Hier, '),pc,[f,pc,v]))
 # Neither a synonym nor another true negative is a distractor.
 neg,meaning=[('ne… plus','action arrêtée'),('ne… jamais','à aucune occasion'),('ne… pas encore','action attendue mais non réalisée'),('ne… rien','aucune chose'),('ne… personne','aucune personne')][i%5]
 if i%5 in (0,1,2):
  tail=('plus','jamais','pas encore')[i%5];answer=('n’' if vowel(f) else 'ne ')+f+' '+tail
  prompt=sentence(subject,answer,comp,v)[:-1]+f' ({meaning}).';opts=[answer,f,'pas '+f]
 elif i%5==3:
  v='oublier';f=present(v)[p];answer=('n’' if vowel(f) else 'ne ')+f+' rien';prompt=sentence(subject,answer,'pour '+comp.split(' ',1)[-1],v)[:-1]+' (aucune chose).';opts=[answer,'ne '+f+' personne',f]
 else:
  f=present('attendre')[p];answer='n’'+f+' personne';prompt=sentence(subject,answer,'avant de '+v+' '+comp,'attendre')[:-1]+' (aucune personne).';opts=[answer,'n’'+f+' rien',f]
 negatives.append(item(prompt,answer,opts))
 habit=i%2==0;answer=imp if habit else pc
 mixed.append(item(sentence(subject,answer,comp,v,leading='Autrefois, chaque semaine, ' if habit else 'Hier, une seule fois, '),answer,[imp,pc,f]))
 near=i%2==0;fa=present('aller')[p]+' '+v;fs=future(v)[p];ans=fa if near else fs
 futuremix.append(item(sentence(subject,ans,comp,v)[:-1]+(' (forme demandée : futur proche).' if near else ' (forme demandée : futur simple).'),ans,[fa,fs,f]))
 subject2='nous' if p!=3 else 'Lina';p2=3 if p!=3 else 2
 # The stem is supplied; choosing the tense is the work.
 ans=future(v)[p]
 hyp.append(item('Si les conditions sont bonnes, '+sentence(subject,ans,comp,v),ans,[ans,imparfait(v)[p],future(v,True)[p]]))
 ans=future(v,True)[p]
 hyp2.append(item('Si les conditions étaient bonnes, '+sentence(subject,ans,comp,v),ans,[ans,future(v)[p],present(v)[p]]))
 trigger,subjmode=[('Il faut que ',True),('Il est certain que ',False),('Je souhaite que ',True),('Je sais que ',False),('Il est possible que ',True)][i%5]
 s=subject.lower() if subject in ('Je','Tu','Nous','Vous') else subject
 forms=subj(v) if subjmode else present(v);ans=forms[p]
 mode.append(item(trigger+sentence(s,ans,comp,v),ans,distinct([ans,present(v)[p],subj(v)[p],imparfait(v)[p],future(v)[p]])))
add('pc-idee','Raconter un fait terminé','Conjuguez au passé composé pour raconter le fait terminé.',rows)
add('a9','Choisir une autre négation','Complétez avec la négation correspondant au sens indiqué.',negatives)
add('imparfait-ou-pc','Choisir le temps du récit','Employez l’imparfait pour l’habitude passée ou le passé composé pour le fait terminé indiqué.',mixed)
add('futur-proche-ou-simple','Former les deux futurs','Employez la forme du futur demandée entre parenthèses.',futuremix)
add('hypothese-futur','Une condition pour l’avenir','Après si au présent, complétez la proposition principale au futur simple.',hyp)
add('j9','Imaginer une condition','Après si à l’imparfait, complétez la proposition principale au conditionnel présent.',hyp2)
add('k13','Choisir le mode du verbe','Conjuguez le verbe au présent du mode demandé par l’expression qui le précède.',mode)

# Intransitive movement / direct object: the real complement decides the auxiliary.
DOUBLE=[('sortir','du théâtre',False),('sortir','les poubelles',True),('monter','au troisième étage',False),('monter','les cartons',True),('descendre','à la cave',False),('descendre','les valises',True),('rentrer','du travail',False),('rentrer','les chaises',True),('retourner','à la pharmacie',False),('retourner','la crêpe',True),('passer','par la gare',False),('passer','un examen',True),('sortir','de la piscine',False),('sortir','le chien',True),('monter','sur le toit',False),('monter','le meuble',True),('descendre','du train',False),('descendre','le panier',True),('rentrer','de la promenade',False),('rentrer','la voiture au garage',True),('retourner','chez ses parents',False),('retourner','le matelas',True),('passer','chez le boulanger',False),('passer','un entretien',True),('sortir','de la banque',False),('sortir','les assiettes du placard',True),('monter','dans le bus',False),('monter','une tente',True),('descendre','vers le lac',False),('descendre','les bouteilles à la cave',True),('rentrer','à la maison',False),('rentrer','les outils dans l’atelier',True),('retourner','au bureau',False),('retourner','une feuille',True),('passer','devant la mairie',False),('passer','une commande',True),('sortir','du restaurant',False),('sortir','les dossiers du tiroir',True),('monter','au grenier',False),('monter','une étagère',True),('descendre','de la montagne',False),('descendre','le linge à la buanderie',True),('rentrer','au chalet',False),('rentrer','le vélo dans le local',True),('retourner','au marché',False),('retourner','le tapis',True),('passer','par le parc',False),('passer','le balai',True),('sortir','du musée',False),('sortir','le gâteau du four',True)]
rows=[]
for i,(v,comp,transitive) in enumerate(DOUBLE):
 subjct,g,plural,p=ETRE_SUBJECTS[i%6];ans=past_forms(v,aux='avoir' if transitive else 'être',gender=g,plural=plural)[p]
 wrong=past_forms(v,aux='être' if transitive else 'avoir',gender=g,plural=plural)[p]
 rows.append(item(sentence(subjct,ans,comp,v),ans,[ans,wrong,present(v)[p]]))
add('double-aux','Choisir avoir ou être','Conjuguez au passé composé selon le complément du verbe.',rows)

rows=[]
for i,(v,comp) in enumerate(REFLEXIVE_BASE):
 s,g,pl,p=ETRE_SUBJECTS[i%6];part=pp(v)
 # With a body-part COD after the verb, se is indirect and the participle is invariant.
 body=v in ('laver','brosser')
 part+=('e' if g=='f' and not body else '')+('s' if pl and not body else '')
 pron=('me','te','se','nous','vous','se')[p];aux=present('être')[p]
 ans=(pron[0]+'’' if pron in ('me','te','se') and vowel(aux) else pron+' ')+aux+' '+part
 wrong=(pron+' ')+present('avoir')[p]+' '+pp(v)
 other=ans+'s' if not ans.endswith('s') else ans[:-1]
 rows.append(item(sentence(s,ans,comp,'se '+v),ans,[ans,wrong,other]))
add('pc-pronominaux','Raconter un geste passé','Conjuguez au passé composé et accordez le participe si nécessaire.',rows)

rows=[]
for i,(v,comp) in enumerate(AVOIR_ONLY):
 # COD is placed after avoir in these items; no gender/number agreement.
 answer=pp(v);base=sentence('Les voisines','ont '+answer,comp,v).replace('___','ont ___')
 rows.append(item(base,answer,[answer,answer+'e',answer+'s']))
# Add the être and preceding COD cases instead of testing only the default rule.
for i in range(20):
 v=('arriver','partir','entrer','sortir','venir')[i%5];s,g,pl,p=ETRE_SUBJECTS[i%6]
 part=pp(v)+('e' if g=='f' else '')+('s' if pl else '');aux=present('être')[p]
 rows[i]=item(f'{s} {aux} ___ ({v}) au rendez-vous.',part,[part,pp(v),pp(v)+'e',pp(v)+'s',pp(v)+'es',pp(v)+'ée'])
# Twenty concrete direct objects preceding avoir.
COD_PP=[('lettre','écrire','écrit'),('veste','acheter','acheté'),('photo','prendre','pris'),('porte','ouvrir','ouvert'),('fenêtre','fermer','fermé'),('salade','préparer','préparé'),('réponse','recevoir','reçu'),('maison','visiter','visité'),('boîte','remplir','rempli'),('clé','perdre','perdu'),('lettres','lire','lu'),('questions','poser','posé'),('bouteilles','ranger','rangé'),('pommes','laver','lavé'),('fleurs','offrir','offert'),('chaussures','choisir','choisi'),('cartes','envoyer','envoyé'),('robes','vendre','vendu'),('places','réserver','réservé'),('histoires','raconter','raconté')]
for k,(noun,v,part) in enumerate(COD_PP):
 plural=k>=10;ans=part+'e'+('s' if plural else '')
 rows[k+20]=item(f'Voici '+('les' if plural else 'la')+f' {noun} que Lina a ___ ({v}).',ans,[part,part+'s',part+'es',part+'e'])
add('accord-pp','Accorder le participe passé','Accordez le participe passé avec le sujet ou le COD placé avant, selon l’auxiliaire.',rows)

# Object replacement. Each noun has its own natural verb/frame.
rows=[];passive=[];pron_eny=[];relatives=[];rel_dont=[];double_pron=[]
for i,(noun,plur,g) in enumerate(NOUNS):
 plural=i%3==0;target=plur if plural else noun;article=noun_article(target,g,plural);phrase=article+('' if article.endswith('’') else ' ')+target
 frame=NOUN_FRAMES[i]
 # Keep the real verb/context by splitting the determiner slot.
 before,after=frame.split('{d} {n}');tokens=before.rstrip().split(' ');subject=tokens[0];verb=' '.join(tokens[1:]);tail=after
 ans='les' if plural else 'la' if g=='f' else 'le'
 if vowel(verb):ans='les' if plural else 'l’'
 prompt=f'{subject} ___ {verb}{tail[:-1]} (remplacez « {phrase} »).'
 rows.append(item(prompt,ans,['le','la','l’','les']))
 # Passive participle: noun is the grammatical subject, agent "le personnel".
 participle='contrôlé'+('e' if g=='f' else '')+('s' if plural else '')
 passive.append(item(phrase[0].upper()+phrase[1:]+(' sont ' if plural else ' est ')+f'___ (contrôler) par le personnel.',participle,[participle,'contrôlé','contrôlée','contrôlés','contrôlées']))
 # Relative as subject vs direct object, with the other word orders deliberately impossible.
 if i%2:
  prompt=f'Voici {phrase} ___ Lina cherche.';ans='que';opts=['qui','que','où']
 else:
  prompt=f'Voici {phrase} ___ '+('sont' if plural else 'est')+' à Paul.';ans='qui';opts=['qui','que','où']
 relatives.append(item(prompt,ans,opts))
 rel_dont.append(item(f'Voici {phrase} ___ nous parlons.', 'dont',['dont','que','où']))
 # Y replaces a location, en a quantified object. Explicit referent prevents guessing.
 if i%2:
  prompt=f'Je ___ ai besoin (remplacez « de {phrase} »).';ans='en';prompt=prompt.replace('Je ___ ai','J’___ ai')
 else:
  prompt=f'Je ___ pense (remplacez « à {phrase} »).';ans='y'
 pron_eny.append(item(prompt,ans,['en','y','le']))
 # Both antecedents explicit; direct object precedes indirect lui/leur.
 rec='à Paul' if i%2 else 'aux voisins';ind='lui' if i%2 else 'leur';cod='les' if plural else 'la' if g=='f' else 'le';ans=cod+' '+ind
 double_pron.append(item(f'Je ___ montre (remplacez « {phrase} {rec} »).',ans,[ans,ind+' '+cod,cod+' en']))
add('i4','Remplacer le COD','Complétez avec le pronom COD qui remplace le groupe indiqué.',rows)
add('j6','Former le passif','Accordez le participe passé dans cette phrase passive.',passive)
add('i1','Choisir qui ou que','Complétez avec le pronom relatif qui convient à la construction.',relatives)
add('i8','Employer dont','Remplacez de et le groupe nominal par un seul pronom relatif.',rel_dont)
add('i7','Choisir en ou y','Complétez avec en ou y pour remplacer le groupe indiqué.',pron_eny)
add('k9','Placer deux pronoms','Remplacez les deux groupes par un pronom COD suivi de lui ou leur.',double_pron)

# Fifty natural dative complements.
DATIVE=[('téléphoner','à la médecin'),('écrire','aux parents'),('répondre','à la collègue'),('parler','au directeur'),('sourire','aux enfants'),('obéir','à la monitrice'),('plaire','aux visiteurs'),('ressembler','à son frère'),('téléphoner','aux pompiers'),('répondre','au locataire'),('écrire','à la propriétaire'),('parler','aux voisins'),('sourire','au bébé'),('obéir','aux responsables'),('plaire','à la famille'),('ressembler','aux cousins'),('téléphoner','à sa mère'),('répondre','aux clients'),('écrire','au professeur'),('parler','à la réceptionniste'),('sourire','aux invités'),('obéir','au guide'),('plaire','aux spectatrices'),('ressembler','à sa sœur'),('téléphoner','au dentiste'),('répondre','aux élèves'),('écrire','aux amis'),('parler','au gardien'),('sourire','à la patiente'),('obéir','aux entraîneurs'),('plaire','au public'),('ressembler','à son grand-père'),('téléphoner','aux collègues'),('répondre','à la journaliste'),('écrire','au secrétariat'),('parler','aux passagers'),('sourire','au serveur'),('obéir','à la cheffe'),('plaire','aux lectrices'),('ressembler','à sa grand-mère'),('téléphoner','au mécanicien'),('répondre','aux organisateurs'),('écrire','à la conseillère'),('parler','aux bénévoles'),('sourire','à la caissière'),('obéir','aux parents'),('plaire','à la classe'),('ressembler','aux jumelles'),('téléphoner','à la libraire'),('répondre','aux enfants')]
IRREG.update({'sourire':['souris','souris','sourit','sourions','souriez','sourient'],'plaire':['plais','plais','plaît','plaisons','plaisez','plaisent']})
rows=[]
for i,(v,comp) in enumerate(DATIVE):
 subject,p=SUBJECTS[(i*3)%8];ans='leur' if comp.startswith('aux ') else 'lui'
 rows.append(item(f'{subject} ___ {present(v)[p]} (remplacez « {comp} »).',ans,['lui','leur','les']))
add('i5','Remplacer le COI','Remplacez le groupe introduit par à par lui ou leur.',rows)

rows=[]
for i,(noun,plur,g) in enumerate(NOUNS):
 plural=i%3==0;n=plur if plural else noun;art=noun_article(n,g,plural);phrase=art+('' if art.endswith('’') else ' ')+n
 answer=('lesquelles' if g=='f' else 'lesquels') if plural else ('laquelle' if g=='f' else 'lequel')
 rows.append(item(f'Voici {phrase} sans ___ je ne peux pas commencer.',answer,['lequel','laquelle','lesquels','lesquelles']))
add('i9','Accorder le relatif composé','Après sans, accordez le pronom relatif avec le nom repris.',rows)

rows=[];neutral=[]
for i,(v,comp) in enumerate(REGULAR):
 ans=('chacun','personne','quelqu’un','tout')[i%4]
 if i%4==0:prompt=f'Pour {v} {comp}, ___ reçoit une consigne personnelle (chaque personne séparément).'
 elif i%4==1:prompt=f'Pour {v} {comp}, ___ ne vient aider (aucune personne).'
 elif i%4==2:prompt=f'Pour {v} {comp}, ___ vient aider (une personne non précisée).'
 else:prompt=f'Pour {v} {comp}, ___ est prêt (l’ensemble des choses).'
 rows.append(item(prompt,ans,['chacun','personne','quelqu’un','tout']))
 ans=('ce qui','ce que','ce dont')[i%3]
 prompt=f'Pour {v} {comp}, je note ___ est nécessaire.' if i%3==0 else f'Pour {v} {comp}, je note ___ vous proposez.' if i%3==1 else f'Pour {v} {comp}, je note ___ vous avez besoin.'
 neutral.append(item(prompt,ans,['ce qui','ce que','ce dont']))
add('i6','Employer un pronom indéfini','Complétez selon le sens indiqué.',rows)
add('k8','Employer ce qui, ce que, ce dont','Complétez avec le pronom relatif neutre adapté au verbe qui suit.',neutral)

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,p=SUBJECTS[i%8];f=present(v)[p];mode=i%3
 if mode==0:prompt=f'Lina dit que {subject.lower() if subject in ("Je","Tu","Nous","Vous","Les voisins","Les voisines") else subject} ___ ({v}, au présent) {comp}.';ans=f;opts=[ans,imparfait(v)[p],future(v)[p]]
 elif mode==1:prompt=f'Lina demande ___ nous pouvons {v} {comp} (question fermée).';ans='si';opts=['si','que','ce que']
 else:prompt=f'Lina demande ___ nous voulons faire avant de {v} {comp} (question sur une chose).';ans='ce que';opts=['ce que','si','que']
 rows.append(item(prompt,ans,opts))
add('j7','Rapporter une parole','Complétez la parole rapportée au présent ou le mot qui introduit la question indirecte.',rows)
