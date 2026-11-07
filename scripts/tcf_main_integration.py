"""Exact non-image bank changes inherited from a fixed, reviewed upstream commit."""
import json,subprocess,importlib.util,hashlib
from tcf_context_audit import ROOT,BANKS
REPORT=ROOT/'docs/tcf/integration-main-20261107.json'

def at(value,node):
 for key in node:value=value[key]
 return value

def git_bank(commit,bank):
 return {e['id']:e for e in json.loads(subprocess.check_output(['git','show',f'{commit}:{bank}'],cwd=ROOT,text=True))}

def differences(before,after,node=()):
 if before==after:return
 if isinstance(before,dict) and isinstance(after,dict):
  # Image variants are audited by the exact contextual journal; their addition
  # does not change the inherited source, text choices or written answer.
  assert before.keys()^after.keys() <= {'qcm_image'},node
  for k in before.keys()&after.keys():
   if k!='qcm_image':yield from differences(before[k],after[k],node+(k,))
 elif isinstance(before,list) and isinstance(after,list):
  assert len(before)==len(after),node
  for i,(a,b) in enumerate(zip(before,after)):yield from differences(a,b,node+(i,))
 elif isinstance(before,str) and isinstance(after,str) and (before.startswith('/lib/images/') or after.startswith('/lib/images/')):
  return
 else:yield node,before,after

def verify():
 if not REPORT.exists():return []
 report=json.loads(REPORT.read_text());ops=report['bank_operations'];corrections=report.get('local_model_corrections',[]);expected={}
 correction_map={(r['bank'],r['exercise'],tuple(r['node'])):r for r in corrections}
 script=ROOT/'scripts/localize-tcf-ce-switzerland.py'
 assert script.read_bytes()==subprocess.check_output(['git','show',report['remote_commit']+':scripts/localize-tcf-ce-switzerland.py'],cwd=ROOT)
 spec=importlib.util.spec_from_file_location('upstream_swiss_transform',script);swiss=importlib.util.module_from_spec(spec);spec.loader.exec_module(swiss)
 for op in ops:
  if op['review']=='exact_canonical_swiss_localization':assert swiss.localize(op['before'])==op['after'],op
 for bank in BANKS:
  relative=str(bank.relative_to(ROOT));old=git_bank(report['local_commit'],relative);remote=git_bank(report['remote_commit'],relative);current={e['id']:e for e in json.loads(bank.read_text())}
  assert old.keys()==remote.keys()==current.keys(),relative
  for key in old:
   for node,before,after in differences(old[key],current[key]):
    correction=correction_map.get((relative,key,node))
    if correction:
     assert node[-3:]==('formes','lignes','reponse_modele')
     assert at(remote[key],node)==correction['before']==before
     q=current[key]['questions'][node[1]]
     from tcf_context_audit import text_form
     assert after==correction['after']==next(c['texte'] for c in text_form(q)['choix'] if c.get('correct'))=='Faire du vélo'
    else:assert at(remote[key],node)==after,(key,node,'must match the recorded upstream commit')
    expected[(relative,key,node)]=(before,after)
 for op in ops+corrections:
  key=(op['bank'],op['exercise'],tuple(op['node']))
  assert expected.pop(key)==(op['before'],op['after']),key
 assert not expected,expected
 for asset in report.get('upstream_asset_updates',[]):
  old=subprocess.check_output(['git','show',report['local_commit']+':public'+asset['path']],cwd=ROOT)
  new=subprocess.check_output(['git','show',report['remote_commit']+':public'+asset['path']],cwd=ROOT)
  assert hashlib.sha256(old).hexdigest()==asset['before_sha256']
  assert hashlib.sha256(new).hexdigest()==asset['sha256']
  assert (ROOT/'public'/asset['path'].lstrip('/')).read_bytes()==new
  assert (ROOT/'public'/asset['archive'].lstrip('/')).read_bytes()==old
 return ops+corrections

def original_preserved(path,expected):
 if (ROOT/'public'/path.lstrip('/')).read_bytes()==expected:return True
 if not REPORT.exists():return False
 report=json.loads(REPORT.read_text())
 for asset in report.get('upstream_asset_updates',[]):
  if asset['path']==path and hashlib.sha256(expected).hexdigest()==asset['before_sha256']:
   return (ROOT/'public'/asset['archive'].lstrip('/')).read_bytes()==expected
 return False

def reverse(value,operations):
 byid={e['id']:e for e in value}
 for op in reversed(operations):
  node=byid[op['exercise']]
  for key in op['node'][:-1]:node=node[key]
  node[op['node'][-1]]=op['before']
