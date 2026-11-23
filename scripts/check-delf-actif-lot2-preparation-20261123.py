"""Validate the resumable DELF batch before preparation and after complete activation."""
import hashlib,json,subprocess,sys
from copy import deepcopy
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT/'scripts'))
from tcf_context_audit import BANKS,digest,semantic_question,source_for,text_form
from audio_replacement.editorial_json import loads as editorial_loads
from render_tcf_clocks import MODEL,BASE,angles

def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def resolve(p):return ROOT/'public'/p.lstrip('/') if p.startswith('/lib/') else ROOT/p
r=read(ROOT/'docs/tcf/delf-actif-20261113/lot2-100-20261123-preparation.json');baseline=r['baseline_commit'];images={x['path']:x for x in r['published_images']};sources={x['key']:x for x in r['selected_questions']};targets={x['key']:x for x in r['planned_choices']};summary=r['summary'];assert len(images)==summary['published_images'] and len(sources)==len(targets)==100
assert sum(not x.get('generation_method') for x in images.values())==summary['native_png']
assert sum(bool(x.get('generation_method')) for x in images.values())==summary['procedural_common_clocks']==8
activated=summary['activated_trios']==100
assert summary['activated_trios'] in (0,100)
proofs={}
if activated:
 register=read(ROOT/'docs/tcf/delf-actif-20261113/revue-lot2-100-20261123.json');proofs={p['key']:p for p in register['trios']};assert set(proofs)==set(sources)
 assert r['status']=='completed' and r['preactivation_validation']['result'] and len(r['trio_review_notes'])==100
current={}
for bank in BANKS:
 relative=str(bank.relative_to(ROOT));before=subprocess.check_output(['git','show',baseline+':'+relative],cwd=ROOT)
 data=editorial_loads(bank.read_text())
 if activated:
  restored=json.loads(bank.read_text())
  for ex in restored:
   for i,q in enumerate(ex.get('questions',[]),1):
    key=f"{ex['id']}#{i}"
    if key not in sources:continue
    assert q['formes'].pop('qcm_image')==proofs[key]['after_image_form'],key
    if not q['formes'] and 'formes' not in sources[key]['question_snapshot']:q.pop('formes')
  assert restored==json.loads(before),relative+' changed beyond the 100 image forms (including editorial fragments)'
  assert r['preactivation_validation']['bank_sha256'][relative]==hashlib.sha256(before).hexdigest()
 else:assert bank.read_bytes()==before,relative+' must stay byte-for-byte unchanged'
 for ex in data:
  for i,q in enumerate(ex.get('questions',[]),1):current[f"{ex['id']}#{i}"]=(ex,q)
for key,s in sources.items():
 ex,q=current[key];source,audio=source_for(ex,q);original=deepcopy(q)
 if activated:
  form=original['formes'].pop('qcm_image');assert form==proofs[key]['after_image_form']
  if not original['formes'] and 'formes' not in s['question_snapshot']:original.pop('formes')
  assert proofs[key]['source']==source and proofs[key]['semantic_sha256']==digest(semantic_question(q))
 assert original==s['question_snapshot'] and digest(source)==s['source_sha256'] and digest(semantic_question(q))==s['semantic_sha256'],key
 assert audio==s['audio'] and sha(resolve(audio))==s['audio_sha256'],key
 assert bool(q.get('formes',{}).get('qcm_image'))==activated,key+' activation mismatch'
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
assert len(r['ready_trios'])==summary['prepared_trios']
assert summary['unfinished_trios']==100-summary['prepared_trios']
assert {x['key'] for x in r['ready_trios']}=={t['key'] for t in targets.values() if all(p in manifest and manifest[p]['status']=='visually_reviewed' for p in t['paths']) and str(t['index']) in r['trio_review_notes']}
for t in r['ready_trios']:
 assert t['status']==('activated' if activated else 'prepared_not_activated') and t['visual_review'];q=current[t['key']][1];choices=t['preview_image_form']['choix'];assert [c['image'] for c in choices]==t['image_paths'];assert all(p in manifest and manifest[p]['status']=='visually_reviewed' for p in t['image_paths'])
 assert [(c['id'],bool(c.get('correct'))) for c in choices]==[(c['id'],bool(c.get('correct'))) for c in text_form(q)['choix']]
assert len(r['remaining_asset_ids'])==summary['images_still_to_finalize'] and len(r['retakes'])==summary['retakes_pending'] and summary['activated_trios']==(100 if activated else 0)
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
assert summary['new_images_still_to_generate']==len(expected_pending)-len(r['retakes'])
assert len(expected_pending)+len(images)==summary['planned_new_images']
assert not {x['id'].removeprefix('qcm-delf2-') for x in images.values()} & set(r['retakes'])
journal_path=ROOT/'docs/tcf/delf-actif-20261113/reprise-generation-20261123.json'
if journal_path.exists():
 journal=read(journal_path);assert len(journal['images'])==len(images)-102 and len({x['id'] for x in journal['images']})==len(journal['images'])
 for x in journal['images']:
  assert x['label']==audit[x['path']]['visual_label'] and x['keywords']==audit[x['path']]['visual_keywords'] and x['review_note']
  assert x['sha256']==sha(resolve(x['path']))
 assert journal['summary']==summary
assert r['summary']['planned_new_images']==231 and r['summary']['existing_distinct_reuses']==54
plan=read(ROOT/'docs/tcf/delf-actif-20261113/images-a-preparer.json');assert plan['summary']['statuses']['active_reviewed_trio']==(725 if activated else 625) and plan['summary']['statuses']['candidate_visual_review']==(21 if activated else 121)
hist='docs/tcf/revue-763-20261107.json';assert (ROOT/hist).read_bytes()==subprocess.check_output(['git','show',baseline+':'+hist],cwd=ROOT)
for scope in ['public/lib/images','public/lib/audio']:
 changes=subprocess.check_output(['git','diff','--name-status',baseline,'--',scope],cwd=ROOT,text=True).splitlines();assert all(line.startswith('A\t') for line in changes),(scope,changes)
print(f"{len(images)} catalogue images verified ({summary['native_png']} native PNGs, 8 common clocks); 7 additional existing reuses verified; {len(r['ready_trios'])} complete trios reviewed, {summary['activated_trios']} activated; all 100 sources, other bank data, MP3s and original images preserved; {len(expected_pending)} images still to finalize.")
