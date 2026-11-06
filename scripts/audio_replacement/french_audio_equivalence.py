"""Canonical spelling only: preserve signs, decimal positions and hour values."""
import re
import unicodedata
from text_to_num import alpha2digit

def norm(text):
 text=text.replace('’',"'").replace('\u202f',' ')
 text=re.sub(r'(?<!\w)[−-]\s*(?=\d)','moins ',text)
 text=re.sub(r'(?<!\w)\+\s*(?=\d)','plus ',text)
 text=re.sub(r'(?<=\d)[,.](?=\d)',' virgule ',text)
 text=re.sub(r'\b\d{1,3}(?:[ ]\d{3})+\b',lambda m:m[0].replace(' ',''),text)
 text=alpha2digit(text,'fr',threshold=0)
 text=re.sub(r'\b118[ -](\d{3})\b',r'118\1',text)
 text=re.sub(r'(?i)(\d+)\s*(?:heures?|h)\s*(?:et\s+)?demie?\b',r'\1h30',text)
 text=re.sub(r'\bM\.\s+(?=[A-ZÀ-Ý])','Monsieur ',text)
 text=re.sub(r'\bMme\.?\s+','Madame ',text)
 text=re.sub(r'(?i)(\d+)\s*(?:heures?|h)\s*(\d*)',lambda m: str(int(m[1]))+'h'+str(int(m[2] or '0')).zfill(2),text)
 text=re.sub(r'(?i)\b(\d+)(?:er|e|ème|eme)\b',r'\1',text)
 text=unicodedata.normalize('NFD',text.casefold());text=''.join(c for c in text if unicodedata.category(c)!='Mn')
 return re.sub(r'[^a-z0-9]+',' ',text).strip()

assert norm('À trois heures quarante.') == norm('À 3 h 40.')
assert norm('À trois heures quarante.') != norm('À 15 h 40.')
assert norm('Il fera -5 degrés.') == norm('Il fera moins cinq degrés.')
assert norm('Il fera -5 degrés.') != norm('Il fera 5 degrés.')
assert norm('Il faut 3,5 litres.') != norm('Il faut 35 litres.')
assert norm('Il faut 3,5 litres.') == norm('Il faut 3.5 litres.')
assert norm('Avec quatre enfants.') == norm('Avec 4 enfants.')

assert norm('À 13 heures.') == norm('À 13h00.')
assert norm('À huit heures et demie.') == norm('À 8 h 30.')
assert norm('Appelez le 118-712.') == norm('Appelez le 118712.')
