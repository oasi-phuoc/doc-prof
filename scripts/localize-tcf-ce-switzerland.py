#!/usr/bin/env python3
"""Localise la banque CE CSC et conserve un relevé des changements à relire."""
import copy,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BANK=ROOT/'src/tcf/content/a0-a1/ce.json'
REPLACEMENTS=[
 ('Elle est proche de la France.','Elle est proche de Delémont.'),
 ('Dans l’ouest de la France','Dans le sud de la Suisse'),('Dans l\'ouest de la France','Dans le sud de la Suisse'),
 ('de la France','de la Suisse'),('de France','de Suisse'),('En France','En Suisse'),('en France','en Suisse'),
 ('La Région Centre','Le canton du Valais'),('la Région Centre','le canton du Valais'),
 ('www.region-centre.fr/lecture','www.lecture-valais.ch'),
 ('www.tourisme-paris.fr','www.tourisme-zurich.ch'),
 ('www.museemagie.fr','www.musee-magie-fribourg.ch'),
 ('www.federation-chessboxing.fr','www.chessboxing-suisse.ch'),
 ('capitale française','ville suisse'),
 ('histoire de Paris','histoire de la Suisse'),
 ('au jardin du Luxembourg','au parc du Zürichhorn'),('Au jardin du Luxembourg','Au parc du Zürichhorn'),('jardin du Luxembourg','parc du Zürichhorn'),
 ('la tour Eiffel','l’église Fraumünster'),('La tour Eiffel','L’église Fraumünster'),
 ('l’Arc de Triomphe','l’église du Grossmünster'),("L'Arc de Triomphe",'L’église du Grossmünster'),('L’Arc de Triomphe','L’église du Grossmünster'),
 ('Le Sacré-Cœur','L’église Saint-Pierre de Zurich'),('le Sacré-Cœur','l’église Saint-Pierre de Zurich'),
 ('le musée du Louvre','le Kunsthaus de Zurich'),('Le musée du Louvre','Le Kunsthaus de Zurich'),
 ("le musée d'Orsay",'le musée Rietberg'),("Le musée d'Orsay",'Le musée Rietberg'),('le musée d’Orsay','le musée Rietberg'),
 ('le musée Carnavalet','le Musée national suisse'),('Le musée Carnavalet','Le Musée national suisse'),('du musée Carnavalet','du Musée national suisse'),
 ('Versailles','Kybourg'),('Chambord','Chillon'),('Fontainebleau','Gruyères'),
 ('Comédie-Française','Schauspielhaus'),('Champs-Élysées','Bahnhofstrasse'),
 ('musée Carnavalet','Musée national suisse'),('musée du Louvre','Kunsthaus de Zurich'),('musée d’Orsay','musée Rietberg'),
 ('à la Schauspielhaus','au Schauspielhaus'),('À la Schauspielhaus','Au Schauspielhaus'),('près des Bahnhofstrasse','près de la Bahnhofstrasse'),
 ('Paris','Zurich'),('Lille','Fribourg'),('Limoges','Lausanne'),('Briançon','Sion'),
 ('Rhode-Saint-Genèse','Aubonne'),('Bruxelles','Lausanne'),
 ('en Bretagne','à Zermatt'),('En Bretagne','À Zermatt'),('Bretagne','Zermatt'),
 ('37100 Tours','2000 Neuchâtel'),('rue de Loire','rue du Rhône'),
 ('rue Auguste Renoir','rue des Alpes'),('rue Émile Zola','rue du Lac'),
 ('avenue Jean Jaurès','avenue du Lac'),('place Pantiero','place du Port'),('avenue de Sceaux','avenue de Montbenon'),
 ('rue Leclerc','rue Dufour'),('place Foch','place de la Gare'),('rue Pierre Dupré','rue Dufour'),
 ('rue d’Arcole','rue des Alpes'),("rue d'Arcole",'rue des Alpes'),('quai de la Corse','quai du Rhône'),
 ('22, rue du Mayotte, 1204 Genève','22, rue du Mont-Blanc, 1201 Genève'),
 ('l’île aux Pirates','l’île Saint-Pierre'),('L’île aux Pirates','L’île Saint-Pierre'),("L'île aux Pirates",'L’île Saint-Pierre'),
 ('en bord de mer','au bord du lac'),('Septime','Restaurant des Alpes'),
 ('07 58 78 54 63','079 578 54 63'),('06 78 26 03 29','079 826 03 29'),('06 12 15 18 99','078 215 18 99'),
 ('06 38 46 27 11','078 846 27 11'),('04 44 57 65 00','021 445 76 50'),('06 89 64 53 20','079 896 45 32'),
 ('04 92 21 43 28','027 922 14 32'),('06 06 78 43 21','076 678 43 21'),('06 98 65 34 91','078 865 34 91'),('06 67 32 32 01','077 732 32 01'),
 ('du 1er septembre au 30 février','du 1er septembre au 28 février'),('du 28 mai au 12 avril','du 28 mai au 12 juin'),
 ('classe 4e B','classe 10e B'),('La 4e B','La 10e B'),('la 4e B','la 10e B'),
]
CITY_MAP={'Lyon':'Berne','Marseille':'Bâle','Bordeaux':'Lucerne','Nantes':'Winterthour','Nice':'Lugano','Toulouse':'Saint-Gall','Grenoble':'Coire','Chamonix':'Zermatt','Strasbourg':'Neuchâtel','Annecy':'Montreux'}
def localize(text):
 if text.startswith('/lib/'):return text
 for before,after in REPLACEMENTS:text=text.replace(before,after)
 for before,after in CITY_MAP.items():text=re.sub(r'\b'+re.escape(before)+r'\b',after,text)
 text=re.sub(r'\bFrance\b','Suisse',text)
 text=re.sub(r'(?<=[\w-])\.fr\b','.ch',text)
 text=re.sub(r'\beuros?\b|\bfrancs?(?:\s+suisses?)?\b','CHF',text,flags=re.I).replace('€','CHF')
 return text

def transform(value,key=''):
 if isinstance(value,str):return value if key in ['id','image','audio'] else localize(value)
 if isinstance(value,list):return [transform(v,key) for v in value]
 if isinstance(value,dict):return {k:transform(v,k) for k,v in value.items()}
 return value

def repair_choices(ex):
 changed=[]
 for number,q in enumerate(ex['questions'],1):
  for choices in [q.get('choix',[]),q.get('formes',{}).get('qcm_texte',{}).get('choix',[])]:
   seen=set()
   # Garder d’abord la réponse correcte ; adapter seulement un distracteur devenu identique.
   for c in sorted(choices,key=lambda c:not c.get('correct',False)):
    label=c.get('texte')
    if label is None:continue
    normalized=label.casefold().replace('’',"'").strip()
    if normalized in seen:
     alternatives=['Dans le centre de la Suisse','Dans l’est de la Suisse','Dans le sud de la Suisse'] if label.startswith('Dans ') else ['En Autriche','En Allemagne','En Italie'] if label.startswith('En ') else ['L’Autriche','L’Allemagne','L’Italie'] if label.startswith(('La ','Le ','L’',"L'")) else ['Autriche','Allemagne','Italie']
     for alternative in alternatives:
      if alternative.casefold() not in seen:
       c['texte']=alternative;normalized=alternative.casefold();changed.append(number);break
    seen.add(normalized)
 return changed

def main():
 old=json.loads(BANK.read_text());data=transform(old)
 # Le récit genevois remplace l’historique français et ses chiffres de participation.
 for e in data:
  if e['id']=='delf-a1-2022-ce-ex4-voisins':
   e['support']['texte']='En Suisse, plusieurs communes organisent la fête des voisins. C’est un rendez-vous pour connaître ses voisins. La fête se déroule dans la rue. On installe des tables. Dans les immeubles, on organise la fête dans le jardin ou dans le hall. Tous les voisins apportent de la nourriture et des boissons. Chaque année, de nombreux habitants participent. À Genève, cette fête est organisée depuis 2003. Dans ce programme, la fête est prévue un vendredi, à partir de 19 h.'
   for index,enonce,answer in [(6,'Comment le texte décrit-il la participation à cette fête ?','De nombreux habitants participent'),(7,'Depuis quelle année cette fête est-elle organisée à Genève selon le texte ?','2003')]:
    q=e['questions'][index];q['enonce']=enonce
    for c in q.get('choix',[]):
     if c.get('correct'):c['texte']=answer
    q.setdefault('formes',{}).setdefault('lignes',{})['reponse_modele']=answer
 report=[]
 for original,e in zip(old,data):
  repaired=repair_choices(e);pending=[]
  for n,(before,q) in enumerate(zip(original['questions'],e['questions']),1):
   old_labels=[c.get('texte') for c in before.get('choix',[])];new_labels=[c.get('texte') for c in q.get('choix',[])]
   if old_labels!=new_labels and q.get('formes',{}).get('qcm_image'):
    pending.append({'question':n,'oldLabels':old_labels,'newLabels':new_labels,'images':q['formes'].pop('qcm_image')})
  if original!=e:report.append({'id':e['id'],'supportChanged':original['support']!=e['support'],'questionsChanged':[i for i,(a,b) in enumerate(zip(original['questions'],e['questions']),1) if a!=b],'repairedDistractors':sorted(set(repaired)),'imageVariantsToRegenerate':pending})
 BANK.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 report_path=ROOT/'docs/tcf/ce-swiss-localization.json'
 # Un second passage ne doit pas effacer l’historique du premier.
 if report_path.exists():
  previous=json.loads(report_path.read_text())['changedExercises']
  by_id={x['id']:x for x in previous}
  for row in report:
   if row['id'] in by_id:
    old_row=by_id[row['id']];row['supportChanged']|=old_row['supportChanged']
    row['questionsChanged']=sorted(set(row['questionsChanged']+old_row['questionsChanged']))
    row['repairedDistractors']=sorted(set(row['repairedDistractors']+old_row['repairedDistractors']))
    row['imageVariantsToRegenerate']=old_row['imageVariantsToRegenerate']+row['imageVariantsToRegenerate']
   by_id[row['id']]=row
  report=list(by_id.values())
 if report:report_path.write_text(json.dumps({'scope':'CE TCF CSC','replacements':REPLACEMENTS,'cityReplacements':CITY_MAP,'changedExercises':report,'note':'Questions et corrigés adaptés. Les anciens chemins techniques sont conservés ; les variantes d’images dont le sens a changé sont retirées jusqu’à leur régénération.'},ensure_ascii=False,indent=2)+'\n')
 print(f'{len(report)} exercices adaptés au contexte suisse ; {sum(len(x["imageVariantsToRegenerate"]) for x in report)} variantes d’images à reprendre.')
if __name__=='__main__':main()
