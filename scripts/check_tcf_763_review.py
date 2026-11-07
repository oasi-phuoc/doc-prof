"""Verify every decision and every activated trio in the 763-question review."""
from collections import Counter
import json
from tcf_context_audit import ROOT,BANKS,source_for,digest,semantic_question,text_form
from tcf_replace_vocabulary_images import checked_images
from tcf_visual_durations import duration,exact_duration_seconds

def verify():
 review=json.loads((ROOT/'docs/tcf/revue-763-20261107.json').read_text())
 assert review['initial_count']==763 and review['initial_review_complete']
 assert review['review_pending']==0
 assert len(review['questions'])==len({r['key'] for r in review['questions']})==763
 assert {r['review_index'] for r in review['questions']}==set(range(763))
 bank={e['id']:e for path in BANKS for e in json.loads(path.read_text())}
 approved=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
 counts=Counter()
 for row in review['questions']:
  ex=bank[row['exercise']];q=ex['questions'][row['question']-1];source,_=source_for(ex,q)
  assert row['reviewed'] and row['reason'],row['key']
  assert digest(source)==row['source_sha256'],row['key']
  assert digest(semantic_question(q))==row['semantic_sha256'],row['key']
  assert [c['texte'] for c in text_form(q)['choix']]==row['labels'],row['key']
  form=q.get('formes',{}).get('qcm_image');counts[row['status']]+=1
  if row['status']=='active_reviewed_trio':
   assert len(form['choix'])==3
   assert [c['image'] for c in form['choix']]==row['selected_images']
   assert len(set(row['selected_images']))==3
   assert [(c['id'],bool(c.get('correct'))) for c in form['choix']]==[(c['id'],bool(c.get('correct'))) for c in text_form(q)['choix']]
   for path,sha in zip(row['selected_images'],row['selected_sha256']):assert approved[path]['sha256']==sha
   if 'temps' in q['enonce'].lower():
    for label,path in zip(row['labels'],row['selected_images']):
     render=approved[path]['clock_render']
     if 'duration_seconds' in render:
      assert render['duration_seconds']==exact_duration_seconds(label),(row['key'],label,path)
      assert render['duration_unit']=='h:min' and render['duration_caption_revision']==2
     else:
      value,unit=duration(label)
      assert render['elapsed_seconds' if unit=='secondes' else 'elapsed_minutes']==value,(row['key'],label,path)
      assert render.get('unit_left'),(row['key'],'unit must not be hidden by the hand')
  else:
   assert not form,row['key']
   if row['status'].startswith('artwork_needed'):assert row['brief']['choices_to_illustrate']==row['labels']
 assert dict(counts)==review['summary']
 assert sum(counts.values())==763
 # These source words do not justify an arbitrary helmet or bank-card picture.
 for index in [150,330,671]:assert review['questions'][index]['status']=='keep_text_source_referent_unspecified'
 if review['questions'][310]['status']=='active_reviewed_trio':
  assert all(approved[p].get('subject_colour')=='red' for p in review['questions'][310]['selected_images']),'red clothing cannot be replaced with blue clothing'
 print(f"763 décisions vérifiées : {review['activated_total']} trios actifs, {review['retained_text_total']} textes conservés, {review['artwork_pending_total']} trios à préparer.")
if __name__=='__main__':verify()
