import re,unicodedata
words={'une':1,'un':1,'deux':2,'trois':3,'quatre':4,'cinq':5,'six':6,'sept':7,'huit':8,'neuf':9,'dix':10,'quinze':15,'vingt':20,'vingt cinq':25,'trente':30,'quarante':40,'quarante cinq':45,'soixante':60}
def duration(label):
 s=''.join(c for c in unicodedata.normalize('NFD',label.lower()) if not unicodedata.combining(c)).replace('-',' ')
 s=re.sub(r'^(?:dans |environ )','',s)
 if s in ['une heure','1 heure','1 h']:return (60,'minutes')
 if s in ['une demi heure']:return (30,'minutes')
 if s=='deux minutes trente':return (2.5,'minutes')
 m=re.fullmatch(r'(\d+|'+ '|'.join(words)+r') (minutes?|secondes?)',s)
 if not m:return None
 n=words.get(m[1],int(m[1]) if m[1].isdigit() else 0)
 if 0<n<=60:return(n,'secondes' if m[2].startswith('seconde') else 'minutes')
