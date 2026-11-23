"""Independent preservation checks for the first DELF Actif batch of 100."""
import hashlib,json,subprocess,sys
from copy import deepcopy
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from tcf_context_audit import BANKS,digest,semantic_question,source_for,text_form
def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
r=read(ROOT/'docs/tcf/delf-actif-20261113/revue-lot100-20261122.json');baseline=r['baseline_commit']
proof={p['key']:p for p in r['trios']};assert len(proof)==100
seen=set()
for bank in BANKS:
 relative=str(bank.relative_to(ROOT));before=json.loads(subprocess.check_output(['git','show',baseline+':'+relative],cwd=ROOT,text=True));current=read(bank);restored=deepcopy(current)
 old={e['id']:e for e in before}
 for e in restored:
  for i,q in enumerate(e.get('questions',[]),1):
   key=f"{e['id']}#{i}"
   if key not in proof:continue
   p=proof[key];seen.add(key);source,audio=source_for(e,q);assert p['source']==source and p['source_sha256']==digest(source),key
   assert p['semantic_sha256']==digest(semantic_question(q)) and p['question']==semantic_question(q),key
   assert p['audio']==audio and p['audio_sha256']==sha(ROOT/'public'/audio.lstrip('/')),key
   text=text_form(q)['choix'];image=q['formes'].pop('qcm_image')['choix'];assert len(image)==len({c['image'] for c in image})==3,key
   assert [(c['id'],bool(c.get('correct'))) for c in image]==[(c['id'],bool(c.get('correct'))) for c in text],key
   assert [c['image'] for c in image]==p['image_paths'],key
   for path,expected in zip(p['image_paths'],p['image_sha256']):
    f=ROOT/'public'/path.lstrip('/');assert sha(f)==expected
    with Image.open(f) as im:assert im.width*3==im.height*4
   if not q['formes'] and 'formes' not in old[e['id']]['questions'][i-1]:q.pop('formes')
 assert restored==before,relative+' changed outside the 100 added image forms'
assert seen==set(proof)
for x in r['new_images']:
 f=ROOT/'public'/x['path'].lstrip('/');assert f.is_file() and sha(f)==x['sha256']==x['source_sha256']
 with Image.open(f) as im:assert im.format=='PNG' and im.width*3==im.height*4
 assert x['original_bytes_preserved'] is True and x['status']=='visually_reviewed'
 assert not x['label'].startswith('Illustration à examiner')
for scope in ['public/lib/images','public/lib/audio']:
 changes=subprocess.check_output(['git','diff','--name-status',baseline,'--',scope],cwd=ROOT,text=True).splitlines()
 assert all(line.startswith('A\t') for line in changes),(scope,changes)
hist=read(ROOT/'docs/tcf/revue-763-20261107.json');old=json.loads(subprocess.check_output(['git','show',baseline+':docs/tcf/revue-763-20261107.json'],cwd=ROOT,text=True));assert hist==old
print('100 complete trios; original sources, written choices, answers and MP3s preserved; other CE/CO data and historical ledger unchanged; original image/audio files preserved.')
