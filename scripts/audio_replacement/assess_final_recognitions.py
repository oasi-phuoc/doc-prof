"""Assess final-file evidence; editorial changes require two qualified recognitions."""
import json,re,collections,difflib,hashlib
from pathlib import Path
from french_audio_equivalence import norm
import argparse
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--work',type=Path,required=True)
work=parser.parse_args().work
read=lambda p:json.loads(Path(p).read_text())

def canonical(text,engine=None):
 if engine=='ctc':text=re.sub(r'(?<=[A-Za-zÀ-ÿ])\s+-\s+(?=[A-Za-zÀ-ÿ])','-',text)
 return norm(text)

def numbers(text,engine=None):
 text=canonical(text,engine)
 text=re.sub(r'\b0\d(?: ?\d){8}\b',lambda m:m[0].replace(' ',''),text)
 return [('−' if sign=='moins' else '')+value for sign,value in re.findall(r'(?:(moins|plus)\s+)?(\d+)',text)]

def leading_instruction(text):
 return bool(re.match(r'(?i)^\s*(?:page|exercice|document|situation|dialogue|objet)\s+(?:num[eé]ro\s*)?\d+',text))

def verified_resolution(resolution,digest):
 path=Path(resolution.get('evidence_file','/nonexistent'))
 return bool(path.is_file() and resolution.get('candidate_sha256')==digest and hashlib.sha256(path.read_bytes()).hexdigest()==resolution.get('evidence_sha256') and read(path).get('source_sha256')==digest)

recognitions={}
for h,engines in read(work/'existing-recognitions.json').items():
 for engine,path in engines.items():
  data=read(path);assert data['source_sha256']==h
  recognitions.setdefault(h,{})[engine]=data
for engine in ['parakeet','whisper','ctc']:
 for path in (work/engine).glob('*.json'):
  try:data=read(path)
  except (ValueError,OSError):continue
  if (data.get('status')=='transcribed' or (engine=='ctc' and data.get('engine') and data.get('source_sha256') and isinstance(data.get('text'),str))):
   recognitions.setdefault(data['source_sha256'],{})[engine]=data
technical=read(work/'technical-checks.json');decisions=read(work/'editorial-decisions.json');rows=read(work/'review-queue.json');result=[]
for row in rows:
 h=row['candidate_sha256'];rs=recognitions.get(h,{});t=technical.get(h,{})
 both=all(e in rs for e in ['parakeet','whisper'])
 triple=bool(both and all(norm(c['transcription'])==norm(row['candidate_text']) for c in row['contexts']) and norm(rs['parakeet']['text'])==norm(row['candidate_text'])==norm(rs['whisper']['text']))
 minimum={'court':2,'moyen':4,'long':8}.get(t.get('category'),999)
 coverage=all(len(c['questions'])>=minimum for c in row['contexts'])
 boundaries=bool(t.get('boundary_signal',{}).get('safe_quiet_margins') or t.get('boundary_vad',{}).get('safe_voiced_margins'))
 technical_ok=t.get('status')=='technical_integrity_passed' and boundaries and coverage
 decision=decisions.get(row['ref']);blocked=(decision or {}).get('blocked_reasons',[]);flags=list(blocked);qualified=[];per_engine={}
 if decision:
  selected=decision['selected_text'];expected=norm(selected);resolution=decision.get('numeric_resolution',{})
  for engine in ['parakeet','whisper','ctc']:
   if engine not in rs:continue
   actual=canonical(rs[engine]['text'],engine);issues=[]
   similarity=difflib.SequenceMatcher(None,expected.split(),actual.split(),autojunk=False).ratio()
   # Token fusion (e.g. salucarine) can distort a short transcript's word
   # score. A nearly identical character sequence is supplementary evidence;
   # numbers, technical announcements and both boundaries remain checked.
   expected_chars=expected.replace(' ','');actual_chars=actual.replace(' ','')
   character_similarity=difflib.SequenceMatcher(None,expected_chars,actual_chars,autojunk=False).ratio()
   if similarity<.88 and character_similarity<.97:issues.append(engine+'_text_difference')
   if numbers(selected)!=numbers(rs[engine]['text'],engine):
    adjudicated=(resolution.get('verification_mode')=='span_review_across_three_recognitions' and bool(resolution.get('span_review_notes')))
    other_support=any(numbers(selected)==numbers(v['text'],other) for other,v in rs.items())
    confirmed=(verified_resolution(resolution,h) and resolution.get('reviewed_numbers')==numbers(selected) and (adjudicated or other_support))
    if not confirmed:issues.append(engine+'_numeric_difference')
   start_chars=difflib.SequenceMatcher(None,expected_chars[:24],actual_chars[:24],autojunk=False).ratio()
   end_chars=difflib.SequenceMatcher(None,expected_chars[-24:],actual_chars[-24:],autojunk=False).ratio()
   if (expected.split()[0] not in actual.split()[:6] or len(set(expected.split()[:3])&set(actual.split()[:6]))<min(2,len(set(expected.split()[:3])))) and start_chars<.90:issues.append(engine+'_start_difference')
   if (expected.split()[-1] not in actual.split()[-6:] or len(set(expected.split()[-3:])&set(actual.split()[-6:]))<min(2,len(set(expected.split()[-3:])))) and end_chars<.90:issues.append(engine+'_end_difference')
   if leading_instruction(rs[engine]['text']):issues.append(engine+'_instruction_flag')
   per_engine[engine]=dict(word_similarity=round(similarity,4),character_similarity=round(character_similarity,4),start_character_similarity=round(start_chars,4),end_character_similarity=round(end_chars,4),flags=issues)
   if not issues:qualified.append(engine)
   flags.extend(issues)
 manual_ready=bool(decision and len(qualified)>=2 and technical_ok and not blocked)
 auto_ready=bool(not decision and triple and technical_ok and not any(leading_instruction(rs[e]['text']) for e in ['parakeet','whisper']))
 selected_engines=qualified[:2] if manual_ready else ['parakeet','whisper'] if auto_ready else []
 result.append(dict(ref=row['ref'],candidate_sha256=h,recognitions=list(rs),technical_status=t.get('status'),exact_triple_transcript=triple,coverage_sufficient=coverage,instruction_flag=bool(any(leading_instruction(rs[e]['text']) for e in ['parakeet','whisper'] if e in rs)),automatic_equivalence_ready=auto_ready,editorial_decision_present=bool(decision),manual_review_ready=manual_ready,manual_flags=flags,recognition_assessments=per_engine,qualified_recognitions=qualified,selected_recognition_engines=selected_engines))
summary=dict(pending_references_initial=len(rows),unique_candidates=len({r['candidate_sha256'] for r in rows}),parakeet_recognitions=len({r['candidate_sha256'] for r in result if 'parakeet' in r['recognitions']}),french_whisper_recognitions=len({r['candidate_sha256'] for r in result if 'whisper' in r['recognitions']}),third_ctc_recognitions=len({r['candidate_sha256'] for r in result if 'ctc' in r['recognitions']}),technical_files_checked=len(technical),exact_equivalence_ready=sum(r['automatic_equivalence_ready'] for r in result),editorial_decisions=len(decisions),manual_reviews_ready=sum(r['manual_review_ready'] for r in result),instruction_flags=sum(r['instruction_flag'] for r in result))
(work/'readiness.json').write_text(json.dumps(dict(summary=summary,rows=result),ensure_ascii=False,indent=2));print(json.dumps(summary))
