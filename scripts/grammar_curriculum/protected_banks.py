"""Complete existing introductory banks while preserving their exercise ids."""
from bank_common import *
import json,copy
from pathlib import Path
BASE=json.loads((Path(__file__).resolve().parent/'protected-source.json').read_text())
PROTECTED=[copy.deepcopy(v) for v in BASE['banks'].values() if v['subId'] in ('a2','b1','b2','b3')]

SALUTATIONS=[
('Vous arrivez au cabinet médical le matin','Bonjour'),('Vous entrez à la poste à dix heures','Bonjour'),('Vous accueillez un nouveau client avant midi','Bonjour'),('Vous arrivez à votre entretien en début de matinée','Bonjour'),('Vous saluez la réceptionniste à quinze heures','Bonjour'),('Vous entrez à la pharmacie dans la journée','Bonjour'),('Vous accueillez une collègue au début de la journée','Bonjour'),('Vous arrivez au cours de français à neuf heures','Bonjour'),('Vous vous présentez au guichet pendant la journée','Bonjour'),('Vous croisez le gardien à quatorze heures','Bonjour'),
('Vous arrivez au théâtre à vingt heures','Bonsoir'),('Vous entrez au restaurant en début de soirée','Bonsoir'),('Vous accueillez des invités à dix-neuf heures','Bonsoir'),('Vous arrivez à une réunion après le dîner','Bonsoir'),('Vous commencez votre service à vingt et une heures','Bonsoir'),('Vous rencontrez le réceptionniste à vingt-deux heures','Bonsoir'),('Vous entrez dans une salle de concert le soir','Bonsoir'),('Vous rejoignez vos voisins pour une séance nocturne','Bonsoir'),('Vous accueillez le public pour un spectacle en soirée','Bonsoir'),('Vous arrivez à la permanence du soir','Bonsoir'),
('Vous retrouvez votre meilleur ami dans la cour','Salut'),('Vous saluez votre sœur de façon familière','Salut'),('Vous rejoignez votre frère au parc','Salut'),('Vous accueillez un copain de longue date','Salut'),('Vous croisez votre cousine avec qui vous vous tutoyez','Salut'),('Vous rejoignez un ami proche sur le terrain de sport','Salut'),('Vous envoyez une salutation familière à votre camarade','Salut'),('Vous ouvrez la porte à votre amie d’enfance','Salut'),('Vous retrouvez votre partenaire de jeu habituel','Salut'),('Vous saluez votre voisin qui est aussi un ami proche','Salut'),
('Vous quittez le cabinet après la consultation','Au revoir'),('Vous quittez la bibliothèque après avoir rendu un livre','Au revoir'),('Vous partez du guichet après une démarche','Au revoir'),('Vous quittez la salle de cours sans autre rendez-vous prévu','Au revoir'),('Vous terminez une visite à l’agence immobilière','Au revoir'),('Vous quittez le magasin après votre achat','Au revoir'),('Vous prenez congé de votre conseiller','Au revoir'),('Vous quittez le bureau après votre entretien','Au revoir'),('Vous quittez la réception après avoir obtenu une information','Au revoir'),('Vous terminez un appel professionnel','Au revoir'),
('Vous allez dormir et saluez votre famille','Bonne nuit'),('Vous souhaitez un bon sommeil à votre enfant','Bonne nuit'),('Vous quittez la chambre avant que votre partenaire s’endorme','Bonne nuit'),('Vous terminez un appel juste avant d’aller au lit','Bonne nuit'),('Vous souhaitez un bon sommeil à une amie','Bonne nuit'),('Vous quittez un ami qui va se coucher','Bonne nuit'),('Vous dites au revoir à votre mère avant qu’elle dorme','Bonne nuit'),('Vous éteignez la lumière de la chambre des enfants','Bonne nuit'),('Vous fermez la porte après avoir couché le bébé','Bonne nuit'),('Vous souhaitez un sommeil reposant à votre grand-père','Bonne nuit')]
THANK_ACTIONS=[('un voisin vous prête une échelle','Merci'),('une employée vous explique le formulaire','Merci'),('un collègue vous apporte un dossier','Merci'),('un passant vous indique la gare','Merci'),('le serveur vous apporte le repas','Merci'),('votre amie vous offre une fleur','Merci'),('le facteur vous remet un colis','Merci'),('un bénévole vous aide à porter un carton','Merci'),('votre sœur vous garde une place','Merci'),('le médecin vous donne un conseil','Merci'),
('vous voulez un verre d’eau','s’il vous plaît'),('vous demandez un renseignement au guichet','s’il vous plaît'),('vous commandez une soupe','s’il vous plaît'),('vous demandez une copie du document','s’il vous plaît'),('vous voulez emprunter un stylo','s’il vous plaît'),('vous demandez l’ouverture de la porte','s’il vous plaît'),('vous souhaitez un autre rendez-vous','s’il vous plaît'),('vous demandez un billet aller simple','s’il vous plaît'),('vous demandez une explication au professeur','s’il vous plaît'),('vous voulez voir le menu','s’il vous plaît'),
('vous avez marché sur le pied d’une personne','Pardon'),('vous avez bousculé un passager','Pardon'),('vous avez interrompu une collègue','Pardon'),('vous avez fait tomber le sac de quelqu’un','Pardon'),('vous gênez le passage avec votre valise','Pardon'),('vous avez oublié de frapper avant d’entrer','Pardon'),('vous avez parlé trop fort pendant le cours','Pardon'),('vous avez ouvert la mauvaise porte','Pardon'),('vous avez pris le stylo d’un voisin par erreur','Pardon'),('vous avez coupé la parole au guide','Pardon'),
('un ami vous remercie d’avoir prêté un livre','De rien'),('votre sœur vous remercie pour votre aide','De rien'),('un voisin vous remercie d’avoir porté un sac','De rien'),('un camarade vous remercie pour vos notes','De rien'),('votre frère vous remercie pour le repas','De rien'),('une amie vous remercie pour votre appel','De rien'),('un enfant vous remercie pour un crayon','De rien'),('un collègue vous remercie pour une information','De rien'),('votre cousine vous remercie pour la photo','De rien'),('un ami vous remercie pour le trajet','De rien'),
('une cliente vous remercie de votre accueil','Je vous en prie'),('le directeur vous remercie de votre aide','Je vous en prie'),('une patiente vous remercie du renseignement','Je vous en prie'),('un visiteur vous remercie de votre disponibilité','Je vous en prie'),('votre responsable vous remercie pour le dossier','Je vous en prie'),('un passager vous remercie de lui avoir laissé la place','Je vous en prie'),('une locataire vous remercie pour la visite','Je vous en prie'),('un usager vous remercie pour le formulaire','Je vous en prie'),('une spectatrice vous remercie de l’indication','Je vous en prie'),('un candidat vous remercie du conseil','Je vous en prie')]

for les in PROTECTED:
 sub=les['subId'];qcm=les['kindId'].startswith('qcm');extras=[]
 if sub=='a2':
  for i,(v,comp) in enumerate(REGULAR):
   ref,person=SUBJECTS[(i*3)%8];pro=('Je','Tu','Elle' if ref=='Lina' else 'Il','Nous','Vous','Elles' if ref=='Les voisines' else 'Ils')[person]
   # The referent is always explicit, including il/elle and nous/vous.
   cue={'Je':'moi','Tu':'toi','Il':'Paul','Elle':'Lina','Nous':'Lina et moi','Vous':'Lina et vous','Ils':'Paul et Omar','Elles':'Lina et Nadia'}[pro]
   ans='J’' if pro=='Je' and vowel(present(v)[person]) else pro
   extras.append(dict(prompt=f'___ {present(v)[person]} {comp} ({cue}).',answer=ans,**({'options':distinct([ans,'Il','Nous','Tu','Elle'])[:3]} if qcm else {})))
  # Fix two malformed old subject statements, leaving their ids and purpose intact.
  for row in les['items']:
   row['prompt']=row['prompt'].replace('Yanis et Marco ___ arrivent à 8 h.','___ arrivent à 8 h (Yanis et Marco).').replace('Lina est professeure. ___ est à Sion.','___ est à Sion (Lina).').replace('Karim travaille. ___ travaille à Martigny.','___ travaille à Martigny (Karim).')
 elif sub=='b1':
  for i,(v,comp) in enumerate(REGULAR):
   p=1 if i%2 else 4;ans='tu' if p==1 else 'vous';role='à un ami que vous tutoyez' if p==1 else 'à une personne que vous vouvoyez'
   extras.append(dict(prompt=f'Est-ce que ___ {present(v)[p]} {comp} ({role}) ?',answer=ans,**({'options':[ans,'vous' if p==1 else 'tu','toi']} if qcm else {})))
 elif sub=='b2':
  for context,ans in SALUTATIONS:
   if qcm:
    opts=[ans]+[s for s in ('Bonjour','Bonsoir','Au revoir','Bonne nuit') if s!=ans]
    if ans=='Salut':opts=['Salut','Bonne nuit','Au revoir']
    extras.append(dict(prompt=context+' : « ___ ».',answer=ans,options=opts[:3]))
   else:extras.append(dict(prompt=context+' : écrivez une courte salutation.',answer=ans+'.'))
  if not qcm:les['instruction']='Écrivez une seule phrase de salutation adaptée à la situation.'
 elif sub=='b3':
  for context,ans in THANK_ACTIONS:
   # Give the response register when different thanks responses are both valid.
   label='réponse familière au remerciement' if ans=='De rien' else 'réponse formelle au remerciement' if ans=='Je vous en prie' else 'demande polie' if ans=='s’il vous plaît' else 'excuse' if ans=='Pardon' else 'remerciement'
   prompt=context[0].upper()+context[1:]+' : « ___ » ('+label+').'
   opts=[ans]+[a for a in ('Merci','Pardon','s’il vous plaît','De rien') if a!=ans and not (ans=='Je vous en prie' and a=='De rien')]
   extras.append(dict(prompt=prompt,answer=ans,**({'options':opts[:3]} if qcm else {})))
  if not qcm:les['instruction']='Complétez avec la formule de politesse adaptée à la situation.'
 seen={r['prompt'] for r in les['items']}
 for row in extras:
  if len(les['items'])>=50:break
  if row['prompt'] not in seen:les['items'].append(row);seen.add(row['prompt'])
 assert len(les['items'])==50
for lesson in PROTECTED:
 for row in lesson['items']:
  if row['answer'].endswith('’'):row['prompt']=row['prompt'].replace('___ ','___',1)

# Put the subject cue immediately to the right of the answer line.
import re
GENDERS = {'Léa':'♀','Omar':'♂','Lina':'♀','Hugo':'♂','Inès':'♀','Chloé':'♀',
           'Paul':'♂','Nadia':'♀','Karim':'♂','Yanis':'♂','Marco':'♂'}
for lesson in PROTECTED:
 if lesson['subId'] != 'a2':continue
 lesson['label']='Complétez le pronom'
 for row in lesson['items']:
  text=row['prompt']
  cue=re.search(r'\s*\(([^)]+)\)\.?$',text)
  if cue:
   text=text[:cue.start()].rstrip()
   if not text.endswith(('.', '?', '!')):text+='.'
   text=text.replace('___', '___ ('+cue[1]+')',1)
  else:
   # Existing introductory rows with their cue at the beginning of the sentence.
   for prefix,subject in [('Hugo et moi, ','Hugo et moi'),('Inès et Chloé, ','Inès et Chloé')]:
    if text.startswith(prefix):
     text=text[len(prefix):].replace('___','___ ('+subject+')',1)
  for name,symbol in GENDERS.items():
   text=re.sub(r'\b'+re.escape(name)+r'\b',name+' '+symbol,text)
  row['prompt']=re.sub(r'(\))(?=\w)', r'\1 ', text)
