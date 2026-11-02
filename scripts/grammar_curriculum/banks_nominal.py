from bank_common import *

for sub,label,kind,instruction in [
 ('f1','Choisir ce, cet, cette, ces','demo','Complétez avec un déterminant démonstratif.'),
 ('g1','Choisir un, une ou des','indef','Complétez avec un article indéfini.'),
 ('g2','Choisir le, la, l’ ou les','def','Complétez avec un article défini.'),
 ('l2','Reconnaître le genre','indef','Complétez avec un ou une selon le genre du nom.')]:
 rows=[]
 for i,(sing,plur,g) in enumerate(NOUNS):
  plural=i%3==0 and sub!='l2';noun=plur if plural else sing;answer=noun_article(noun,g,plural,kind)
  opts={'demo':['ce','cet','cette','ces'],'indef':['un','une','des'],'def':['le','la','l’','les']}[kind]
  rows.append(item(noun_phrase(NOUN_FRAMES[i],noun),answer,opts))
 add(sub,label,instruction,rows)

rows=[]
for i,(noun,plur,g) in enumerate(NOUNS):
 owner=i%6;plural=i%4==0;n=plur if plural else noun
 forms=[('mes' if plural else 'mon' if g=='m' or vowel(n) else 'ma'),('tes' if plural else 'ton' if g=='m' or vowel(n) else 'ta'),
        ('ses' if plural else 'son' if g=='m' or vowel(n) else 'sa'),('nos' if plural else 'notre'),('vos' if plural else 'votre'),('leurs' if plural else 'leur')]
 who=('à moi','à toi','à elle','à nous','à vous','à eux')[owner]
 rows.append(item(noun_phrase(NOUN_FRAMES[i],n)[:-1]+' ('+who+').',forms[owner],forms))
add('f6','Indiquer à qui cela appartient','Complétez avec le déterminant possessif correspondant à la personne entre parenthèses.',rows)

rows=[]
for i,(noun,plur,g) in enumerate(NOUNS):
 frame=NOUN_FRAMES[i];a=noun_article(plur,g,True,'indef')
 rows.append(item(frame.replace('{d} {n}','des ___')[:-1]+' (pluriel de '+noun+').',plur,[plur,noun,noun+'es',noun+'x',noun+'s']))
add('l3','Mettre le nom au pluriel','Écrivez le nom entre parenthèses au pluriel.',rows)

for sub,label,mode in [('l4','Former le féminin','f'),('l5','Former le pluriel','pl'),('f7','Accorder l’adjectif','all')]:
 rows=[]
 for i,forms in enumerate(ADJECTIVES):
  index=1 if mode=='f' else (2+i%2) if mode=='pl' else i%4
  n=ADJ_NOUNS[i][index%2];n=plural_noun(n) if index>=2 else n
  det='Les' if index>=2 else 'La' if index%2 else 'Le'
  answer=forms[index];options=distinct([*forms,forms[0]+'e',forms[0]+'s',forms[0]+'es'])
  rows.append(item(f'{det} {n} '+('sont' if index>=2 else 'est')+f' ___ ({forms[0]}).',answer,options))
 add(sub,label,'Accordez l’adjectif entre parenthèses avec le nom.',rows)

# A profession with être takes no indefinite article in these neutral statements.
rows=[]
for i,(masc,fem) in enumerate(JOBS):
 plural=i%4==0;female=i%2==0;subject=('Les voisines' if female else 'Les voisins') if plural else ('Lina' if female else 'Paul')
 noun=fem if female else masc;answer=plural_noun(noun) if plural else noun
 rows.append(item(subject+(' sont ' if plural else ' est ')+f'___ ({masc}).',answer,[masc,fem,plural_noun(masc),plural_noun(fem),noun+'e']))
add('f8','Nommer une profession','Accordez le nom de profession avec la personne.',rows)

# Comparisons based on explicit facts; each item has one factual direction.
rows=[];superrows=[];nounrows=[]
for i,(adj,af,ap,afp) in enumerate(ADJECTIVES):
 n=ADJ_NOUNS[i][0];n2=ADJ_NOUNS[i][1]
 # A lexical scale is explicit, so no assumptions about the two nouns are needed.
 degree=('plus','moins','aussi')[i%3]
 clue={'plus':'davantage','moins':'moins','aussi':'autant'}[degree]
 rows.append(item(f'Le premier {n} est ___ {adj} que le second (degré : {clue}).',degree,['plus','moins','aussi']))
 female=i%2==0;n=ADJ_NOUNS[i][1 if female else 0];form=af if female else adj;article='la' if female else 'le'
 answer=article+' '+('plus' if i%3 else 'moins')
 superrows.append(item(f'Ce groupe comprend plusieurs {plural_noun(n)} ; '+('celle-ci' if female else 'celui-ci')+f' est ___ {form} (superlatif '+('de supériorité' if i%3 else 'd’infériorité')+').',answer,[answer,('le' if female else 'la')+' plus','aussi']))
 # Nom comparisons use explicit degree and teach de rather than adjective syntax.
 noun,plur,g=NOUNS[i];answer=('plus de','moins de','autant de')[i%3]
 nounrows.append(item(f'Notre réserve contient ___ {plur} que la vôtre (quantité : {clue}).',answer,['plus de','moins de','autant de']))
add('f9','Comparer une qualité','Complétez la comparaison selon le degré indiqué.',rows)
add('f13','Former le superlatif','Complétez avec le superlatif demandé et le bon article.',superrows)
add('f14','Comparer une quantité','Complétez selon la quantité indiquée.',nounrows)

rows=[]
for i,(sing,plur,g) in enumerate(NOUNS):
 plural=i%3==0;word=plur if plural else sing;answer=('quelles' if g=='f' else 'quels') if plural else ('quelle' if g=='f' else 'quel')
 base=NOUN_FRAMES[i]
 rows.append(item(f'___ {word} '+('voulez-vous choisir' if i%2 else 'avez-vous trouvé'+('e' if g=='f' else '')+('s' if plural else ''))+' ?',answer.capitalize(),['Quel','Quelle','Quels','Quelles']))
add('c3','Accorder quel','Accordez quel avec le nom dans la question.',rows)

rows=[]
for i,(sing,plur,g) in enumerate(NOUNS):
 plural=i%3==0;word=plur if plural else sing;answer=('Quelles' if g=='f' else 'Quels') if plural else ('Quelle' if g=='f' else 'Quel')
 rows.append(item(f'___ {word} '+('surprenantes' if g=='f' else 'surprenants')+' !' if plural else f'___ {word} '+('surprenante' if g=='f' else 'surprenant')+' !',answer,['Quel','Quelle','Quels','Quelles']))
add('c4','Former une exclamation','Complétez l’exclamation avec quel, quelle, quels ou quelles.',rows)

rows=[];demorows=[]
for i,(sing,plur,g) in enumerate(NOUNS):
 plural=i%3==0;noun=plur if plural else sing;owner=i%6
 roots=('mien','tien','sien','nôtre','vôtre','leur');root=roots[owner]
 if root.endswith('ien'):root+=('ne' if g=='f' else '')+('s' if plural else '')
 elif plural:root+='s'
 article='les' if plural else 'la' if g=='f' else 'le';answer=article+' '+root
 pron=('Ce sont' if plural else 'C’est');dem=noun_article(noun,g,plural,'def')
 # Keep the antecedent overt and the owner explicit.
 prompt=f'Pour ces {noun}' if plural else f'Pour ce {noun}' if g=='m' and not vowel(noun) else f'Pour cet {noun}' if g=='m' else f'Pour cette {noun}'
 rows.append(item(prompt+', '+pron.lower()+' ___ ('+('à moi','à toi','à elle','à nous','à vous','à eux')[owner]+').',answer,[answer,('la' if article=='le' else 'le')+' '+root,'les '+root,'la '+root,'le '+root]))
 answer=('celles' if g=='f' else 'ceux') if plural else ('celle' if g=='f' else 'celui')
 demorows.append(item(prompt+', je préfère ___ de la vitrine.',answer,['celui','celle','ceux','celles']))
add('i2','Employer le pronom possessif','Remplacez le nom par le pronom possessif correspondant à la personne indiquée.',rows)
add('i3','Employer celui ou celle','Complétez avec le pronom démonstratif accordé avec le nom.',demorows)

PLACE_NOUNS=[('musée','m'),('bibliothèque','f'),('école','f'),('jardins','p'),('marché','m'),('poste','f'),('hôpital','m'),('archives','p'),('cinéma','m'),('piscine','f'),('aéroport','m'),('toilettes','p'),('théâtre','m'),('mairie','f'),('atelier','m'),('urgences','p'),('stade','m'),('gare','f'),('épicerie','f'),('bains','p'),('restaurant','m'),('banque','f'),('office du tourisme','m'),('vestiaires','p'),('parc','m'),('pharmacie','f'),('université','f'),('restaurants','p'),('port','m'),('boulangerie','f'),('arrêt du bus','m'),('commerces','p'),('collège','m'),('crèche','f'),('entrée','f'),('guichets','p'),('garage','m'),('cuisine','f'),('étage supérieur','m'),('rayons','p'),('bureau','m'),('salle de sport','f'),('accueil','m'),('caisses','p'),('chalet','m'),('réception','f'),('exposition','f'),('services sociaux','p'),('château','m'),('médiathèque','f')]
for sub,label in [('e7','Contracter à et de'),('aller-destination','Indiquer la destination')]:
 rows=[]
 for i,(noun,g) in enumerate(PLACE_NOUNS):
  prep='à' if sub=='aller-destination' or i%2 else 'de';answer=('aux' if g=='p' else 'à l’' if vowel(noun) else 'au' if g=='m' else 'à la') if prep=='à' else ('des' if g=='p' else 'de l’' if vowel(noun) else 'du' if g=='m' else 'de la')
  prompt=('Je vais' if prep=='à' else 'Je reviens')+' ___ '+noun+'.'
  rows.append(item(prompt,answer,[answer,'à les' if g=='p' else 'à le','de les' if g=='p' else 'de le']))
 add(sub,label,'Complétez avec la préposition et l’article qui conviennent.',rows)

# The adjective cue prevents a second position with a different meaning.
PLACE_ADJ=[('un','sac','vert','après'),('une','veste','bleue','après'),('un','manteau','noir','après'),('une','chemise','blanche','après'),('un','pantalon','gris','après'),('une','robe','rouge','après'),('un','pull','jaune','après'),('une','écharpe','violette','après'),('un','chapeau','orange','après'),('des','chaussures','marron','après'),('un','cours','public','après'),('une','réunion','mensuelle','après'),('un','rapport','annuel','après'),('une','carte','bancaire','après'),('un','contrat','local','après'),('une','visite','médicale','après'),('un','document','administratif','après'),('une','adresse','professionnelle','après'),('un','voyage','scolaire','après'),('une','formation','pratique','après'),('un','bâtiment','grand','avant'),('une','valise','petite','avant'),('un','livre','bon','avant'),('une','nouvelle','mauvaise','avant'),('un','jardin','beau','avant'),('une','fleur','jolie','avant'),('un','pont','vieux','avant'),('une','école','nouvelle','avant'),('un','chemin','long','avant'),('une','route','large','après'),('un','billet','gratuit','après'),('une','place','libre','après'),('un','service','rapide','après'),('une','chambre','calme','après'),('un','quartier','bruyant','après'),('une','table','ronde','après'),('un','bureau','carré','après'),('une','boisson','chaude','après'),('un','repas','froid','après'),('une','bouteille','pleine','après'),('un','bus','vide','après'),('une','maison','moderne','après'),('un','cheval','blanc','après'),('une','histoire','vraie','après'),('un','jeu','amusant','après'),('une','question','simple','après'),('un','exercice','difficile','après'),('une','réponse','courte','après'),('un','plan','détaillé','après'),('une','image','colorée','après')]
rows=[]
for det,noun,adj,pos in PLACE_ADJ:
 good=f'{det} {adj} {noun}' if pos=='avant' else f'{det} {noun} {adj}'
 wrong=f'{det} {noun} {adj}' if pos=='avant' else f'{det} {adj} {noun}'
 rows.append(item(f'Je choisis ___ ({noun} ; {adj} ; adjectif {pos} le nom).',good,[wrong,det+' '+noun+' '+adj+'s']))
add('f12','Placer l’adjectif','Respectez la position de l’adjectif indiquée entre parenthèses.',rows)
