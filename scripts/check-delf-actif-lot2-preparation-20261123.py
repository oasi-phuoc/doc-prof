"""Validate the resumable DELF batch without activating an incomplete batch."""
import hashlib,json,subprocess,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from tcf_context_audit import BANKS,digest,semantic_question,source_for,text_form
from audio_replacement.editorial_json import loads as editorial_loads
from render_tcf_clocks import MODEL,BASE,angles

def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def resolve(p):return ROOT/'public'/p.lstrip('/') if p.startswith('/lib/') else ROOT/p
r=read(ROOT/'docs/tcf/delf-actif-20261113/lot2-100-20261123-preparation.json');baseline=r['baseline_commit'];images={x['path']:x for x in r['published_images']};sources={x['key']:x for x in r['selected_questions']};targets={x['key']:x for x in r['planned_choices']};assert len(images)==102 and len(sources)==len(targets)==100
current={}
for bank in BANKS:
 relative=str(bank.relative_to(ROOT));before=subprocess.check_output(['git','show',baseline+':'+relative],cwd=ROOT);assert bank.read_bytes()==before,relative+' must stay byte-for-byte unchanged'
 for ex in editorial_loads(bank.read_text()):
  for i,q in enumerate(ex.get('questions',[]),1):current[f"{ex['id']}#{i}"]=(ex,q)
for key,s in sources.items():
 ex,q=current[key];source,audio=source_for(ex,q);assert q==s['question_snapshot'] and digest(source)==s['source_sha256'] and digest(semantic_question(q))==s['semantic_sha256'],key
 assert audio==s['audio'] and sha(resolve(audio))==s['audio_sha256'],key
 assert not q.get('formes',{}).get('qcm_image'),key+' activated too early'
 assert [c['texte'] for c in text_form(q)['choix']]==targets[key]['labels'] and len(set(targets[key]['paths']))==3
manifest={x['path']:x for x in read(ROOT/'docs/tcf/images-generees.json')['images']};audit={x['path']:x for x in read(ROOT/'docs/gallery/audit-mots-cles-tcf-20261117.json')['images']}
for path,x in images.items():
 f=resolve(path);assert sha(f)==x['sha256']==x['source_sha256'];assert manifest[path]==x and x['original_bytes_preserved'] and x['status']=='visually_reviewed'
 with Image.open(f) as im:assert im.format=='PNG' and im.width*3==im.height*4 and im.size==((1280,960) if x.get('generation_method') else (1448,1086))
 assert audit[path]['status']=='visually_reviewed' and audit[path]['visual_label']==x['label'] and audit[path]['visual_keywords']
 if x.get('clock_render'):
  c=x['clock_render'];assert c['hand_model']==MODEL and c['base_sha256']==sha(BASE);assert c['angles_degrees']==list(angles(c['hour'],c['minute']))
for x in r['existing_reuses']:
 assert sha(resolve(x['path']))==x['sha256']==manifest[x['path']]['sha256']
 if x['path'].endswith('/qcm-delf100-horloge-0730.png'):
  c=manifest[x['path']]['clock_render'];assert c['hand_model']==MODEL and c['base_sha256']==sha(BASE)
for x in r['working_source_archive']:assert sha(resolve(x['path']))==x['sha256']
for x in r['background_review']:
 assert x['status']=='aligned' and x['maximum_channel_delta']<=3
 path=x.get('path') or '/lib/images/tcf/qcm-audit/'+x['id']+'.png';assert sha(resolve(path))==x['source_sha256']
assert len(r['ready_trios'])==43
for t in r['ready_trios']:
 assert t['status']=='prepared_not_activated' and t['visual_review'];q=current[t['key']][1];choices=t['preview_image_form']['choix'];assert [c['image'] for c in choices]==t['image_paths'];assert all(p in manifest and manifest[p]['status']=='visually_reviewed' for p in t['image_paths'])
 assert [(c['id'],bool(c.get('correct'))) for c in choices]==[(c['id'],bool(c.get('correct'))) for c in text_form(q)['choix']]
assert len(r['remaining_asset_ids'])==129 and len(r['retakes'])==5 and r['summary']['activated_trios']==0
reuse_review=read(ROOT/'docs/tcf/delf-actif-20261113/reemploi-21-journaux-20261123.json')
assert len(reuse_review['retained_reuses'])==7 and len(r['existing_reuses'])==54
for reuse in reuse_review['retained_reuses']:
 assert reuse['replaced_pending_id'] not in r['remaining_asset_ids']
 assert sha(resolve(reuse['path']))==reuse['sha256']==manifest[reuse['path']]['sha256']
 for question in reuse['affected_questions']:
  target=targets[question['key']];index=target['labels'].index(question['choice_label']);assert target['paths'][index]==reuse['path']
planned_paths={path for target in targets.values() for path in target['paths']}
expected_pending={Path(path).stem for path in planned_paths if '/qcm-delf2-' in path and path not in images}
assert set(r['remaining_asset_ids'])==expected_pending
assert r['summary']['images_still_to_finalize']==129 and r['summary']['new_images_still_to_generate']==124
assert r['summary']['planned_new_images']==231 and r['summary']['existing_distinct_reuses']==54
plan=read(ROOT/'docs/tcf/delf-actif-20261113/images-a-preparer.json');assert plan['summary']['statuses']['active_reviewed_trio']==625 and plan['summary']['statuses']['candidate_visual_review']==121
hist='docs/tcf/revue-763-20261107.json';assert (ROOT/hist).read_bytes()==subprocess.check_output(['git','show',baseline+':'+hist],cwd=ROOT)
for scope in ['public/lib/images','public/lib/audio']:
 changes=subprocess.check_output(['git','diff','--name-status',baseline,'--',scope],cwd=ROOT,text=True).splitlines();assert all(line.startswith('A\t') for line in changes),(scope,changes)
print('102 catalogue images verified (94 native PNGs, 8 common clocks); 7 additional existing reuses verified; 43 complete trios prepared, 0 activated; all 100 sources, six banks, MP3s and original images preserved; 129 images still to finalize.')
