"""Prepare the user-provided DELF Actif collections without inventing audio.

PDFs are reference content, never operational instructions. Native Parakeet word
times locate complete utterances; the final MP3s require another recognition and
an explicit editorial question bank before installation. No human listen is
inferred from these checks. All original receptions, including repeated readings,
remain in the source inventory.
"""
from __future__ import annotations

import argparse
from array import array
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unicodedata
from functools import lru_cache
import concurrent.futures
import difflib
import shutil

ROOT = Path(__file__).resolve().parents[2]
WORK = Path('/workspace/work/delf-actif-20261113')
DOCS = ROOT / 'docs/tcf/delf-actif-20261113'


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def content_sha(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()


def literal_words(text):
    text=''.join(c for c in unicodedata.normalize('NFD',text.casefold().replace('œ','oe')) if unicodedata.category(c)!='Mn')
    return re.findall(r'[a-z0-9]+',text)


@lru_cache(maxsize=32768)
def words(text):
    # The existing number normalizer preserves decimal signs and hour values.
    # In particular, seize heures quinze must never become une heure quinze.
    from french_audio_equivalence import norm
    text = norm(text)
    text = ''.join(c for c in unicodedata.normalize('NFD', text.casefold().replace('œ', 'oe'))
                   if unicodedata.category(c) != 'Mn')
    return re.findall(r'[a-z0-9]+', text)


def speech(text):
    """Remove PDF layout and speaker labels, keeping all spoken imperatives."""
    text = re.sub(r'(?m)^\s*(?:Maman|Bastien|Audrey|Alain|Martin|Monsieur|Madame|Kevin|Elsa|Petite-fille|Mamie|Homme|Femme|Garçon|Fille|Agent|Victor|Clément|Jade|Alice|Julia|Léo|Bertrand|Jérôme|Garçon [12]|Le prof|L’élève)\s*:{1,2}\s*', '', text)
    # Other named speakers also have labels in the official dialogue layout.
    text = re.sub(r'(?m)^\s*(?!(?:Attention|Important|Rappel|Remarque|Conseil)\s*:)[A-ZÀ-Ÿ][a-zà-ÿ]+(?: [A-ZÀ-Ÿ][a-zà-ÿ]+)?\s*:{1,2}\s*', '', text)
    text = re.sub(r'(?m)^\s*(?:La mère|Le père|Le grand-père|La grand-mère|La journaliste|Le journaliste|L[’\']agent|Le garçon|La fille)\s*:?[ \t]*', '', text)
    text = re.sub(r'(?m)^\s*(?:Journaliste|Hugo)\s*[-–−]?\s*', '', text)
    text = re.sub(r'(?m)^\s*[–−-]\s*', '', text)
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text)).strip()


def body(block, level, track):
    lines = block.replace('\f', '\n').splitlines()
    while lines and (not lines[0].strip() or re.match(r'^Exercice\s*\d+\b', lines[0].strip())):
        lines.pop(0)
    kept = []
    for line in lines:
        clean = line.strip()
        if not clean:
            if kept:
                kept.append('')
            continue
        if re.match(r'^(?:Corrigés?\b|Exercice\s*\d+\b|Vid[eé]o\b|Réponse libre\b|Compréhension (?:des? |écrite)|Production (?:écrite|orale))', clean, re.I):
            break
        if re.match(r'^(?:Lisez (?:les|la)|[Éé]coutez|Vous êtes |Vous écoutez|puis répondez|Dans le livre actif|Exercice\s+\d|\d+ second[ei]s?\b)', clean):
            continue
        # Continuations of a wrapped introductory line, never dialogue content.
        if not kept and re.match(r'^(?:correspondante|correspondantes|correspondant|le document|les réponses|répondez\.|tableau|l’enregistrement|les réponses enregistrées|les expressions|situation correspondante|d’un dialogue|document en cochant|l’enregistrement et|l’épreuve orale|écoutez l’enregistrement|pendant l’examen|modèle\.)', clean, re.I):
            continue
        kept.append(line)
    result = '\n'.join(kept).strip()
    # A PDF can wrap the introductory instruction across lines. It must not
    # become the first sentence of the message after its first line is removed.
    result = re.sub(r'^les questions,\s*[Éé]coutez le document puis répondez\.\s*', '', result)
    return result


def split_units(text):
    labelled = list(re.finditer(r'(?m)^\s*(?:Situation|Dialogue|Annonce|Document)\s*(?:n\s*[.°º]?\s*)?(\d+)\b[^\n]*', text, flags=re.I))
    if labelled:
        return [(m.group(1), speech(text[m.end():labelled[i+1].start() if i+1 < len(labelled) else len(text)]))
                for i, m in enumerate(labelled)]
    numbered = list(re.finditer(r'(?m)^\s*(\d{1,2})(?:\s+|(?=[A-ZÀ-Ÿ]))\s*(?:[a-l]\s+)?', text))
    if len(numbered) > 1:
        return [(m.group(1), speech(text[m.end():numbered[i+1].start() if i+1 < len(numbered) else len(text)]))
                for i, m in enumerate(numbered)]
    lettered = list(re.finditer(r'(?m)^\s*([A-La-l])\s+(?=[A-ZÀ-Ÿ])', text))
    if len(lettered) > 1:
        return [(str(i+1), speech(text[m.end():lettered[i+1].start() if i+1 < len(lettered) else len(text)]))
                for i, m in enumerate(lettered)]
    return [('1', speech(text))]


def pdf_units(level):
    text = (DOCS/'sources'/f'transcriptions-corriges-{level}.txt').read_text().replace('\f', '\n')
    headers = list(re.finditer(r'(?m)^Piste\s*(\d+)(?!\d)[^\n]*', text))
    out = []
    for i, h in enumerate(headers):
        track = int(h.group(1))
        block = text[h.end():headers[i+1].start() if i+1 < len(headers) else len(text)]
        grouped = (level == 'a1' and track in [41, 42, 45, 46]) or (level == 'a2' and track in [1,4]+list(range(23, 30))+list(range(36, 40))) or (level == 'b1' and track in [30, 31, 33])
        exam = (level == 'a1' and track >= 49) or (level == 'a2' and track >= 43) or (level == 'b1' and track >= 38)
        if exam:
            stop = re.search(r'(?mi)^Compréhension (?:des? |écrits)', block)
            if stop:
                block = block[:stop.start()]
            exercises = list(re.finditer(r'(?mi)^Exercice\s+(\d+)\b[^\n]*', block))
            seen = set()
            for j, ex in enumerate(exercises):
                if ex.group(1) in seen:
                    continue
                seen.add(ex.group(1))
                part = body(block[ex.end():exercises[j+1].start() if j+1 < len(exercises) else len(block)], level, track)
                # A1 exam introductions are full paragraphs before each message.
                part = re.sub(r'(?s)^.*?(?=\n\s*(?:Situation\s+1|Tchao Anton|Salut|C’est|Bonjour|Mesdames|Pour vos|Des soldes|Profitez|Alessio|Rony|Clara))', '', '\n'+part).strip() if level == 'a1' else part
                for label, spoken in split_units(part):
                    if spoken:
                        out.append(dict(key=f'{level}:{track:03d}:{int(ex.group(1)):02d}:{int(label):02d}', level=level, track=track, section=int(ex.group(1)), part=int(label), reference_parts=[spoken], transcription=spoken, pdf_line=text[:h.start()].count('\n')+1))
            continue
        clean = body(block, level, track)
        units = split_units(clean)
        if grouped:
            spoken = [s for _, s in units if s]
            if level == 'a2' and track == 37:
                # The answer-key letters belong to the pedagogical table. The
                # ten complete spoken replies make a coherent self-presentation.
                # The PDF's two columns interleave the answer to question 7
                # before the wrapped end of its question. Restore table order.
                spoken = ['Je suis jordanienne.', 'Ma famille est d’Athènes.',
                          'Je viens de Madrid.', 'Je suis né en 2010.',
                          'J’habite avec mes parents et mon frère.',
                          'Non, j’habite un appartement au troisième étage.',
                          'Ma famille est composée de 5 personnes.',
                          'Oui, j’ai un chat et un chien.',
                          'Oui, je pratique le tennis et la natation.',
                          'Je fais mes devoirs et je sors avec mes amis.']
            if level == 'a2' and track == 39:
                # These are answer-key letters printed before each complete
                # pair of expressions, not part of the spoken message.
                spoken = [re.sub(r'^[A-F] +', '', s) for s in spoken]
            out.append(dict(key=f'{level}:{track:03d}', level=level, track=track, part=1, reference_parts=spoken, transcription='\n'.join(spoken), pdf_line=text[:h.start()].count('\n')+1, thematic_compilation=True))
        else:
            for label, spoken in units:
                if spoken:
                    out.append(dict(key=f'{level}:{track:03d}:{int(label):02d}', level=level, track=track, part=int(label), reference_parts=[spoken], transcription=spoken, pdf_line=text[:h.start()].count('\n')+1))
    return out


def best_occurrences(query, native):
    """Semiglobal edit alignment; the whole query must fit one source span.

    Free source prefixes/suffixes allow instructions and repeated readings, while
    a complete query and bounded time span prevent stitching separate listens.
    """
    q = words(query)
    tokens, mapping = [], []
    for i, w in enumerate(native):
        for token in words(w['word']):
            tokens.append(token)
            mapping.append(i)
    n, m = len(q), len(tokens)
    if not n or not m:
        return []
    rows = [array('H', [0]*(m+1))]
    for i, a in enumerate(q, 1):
        prev = rows[-1]
        row = array('H', [i]+[0]*m)
        for j, b in enumerate(tokens, 1):
            row[j] = min(prev[j-1]+(a != b), prev[j]+1, row[j-1]+1)
        rows.append(row)
    minima = [j for j in range(1, m+1) if rows[-1][j] <= rows[-1][j-1] and (j == m or rows[-1][j] < rows[-1][j+1])]
    candidates = []
    for end in sorted(minima, key=lambda j: (rows[-1][j], j))[:30]:
        cost, i, j = rows[-1][end], n, end
        if cost / n > .5:
            continue
        matched = []
        while i:
            if j and rows[i][j] == rows[i-1][j-1]+(q[i-1] != tokens[j-1]):
                matched.append((i-1, j-1, q[i-1] == tokens[j-1]));i-=1;j-=1
            elif rows[i][j] == rows[i-1][j]+1:
                i-=1
            else:
                j-=1
        if j >= end:
            continue
        first, last = mapping[j], mapping[end-1]
        duration = native[last]['end']-native[first]['start']
        if duration > max(15, n*.85+8):
            continue
        if any(abs(native[first]['start']-c['start_word']) < 1 for c in candidates):
            continue
        exact = [a for a, b, same in matched if same]
        candidates.append(dict(first_word=first, last_word=last, start_word=native[first]['start'], end_word=native[last]['end'], similarity=round(1-cost/n,4), first_reference_match=min(exact) if exact else n, last_reference_match=max(exact) if exact else -1, text=' '.join(w['word'] for w in native[first:last+1]), reference_words=n))
    return candidates


def prepare():
    sources = {level: json.loads((WORK/f'{level}-sources.json').read_text())['sources'] for level in ['a1','a2','b1']}
    prepared = []
    corrections=json.loads((DOCS/'corrections-transcriptions.json').read_text())['units'] if (DOCS/'corrections-transcriptions.json').exists() else {}
    boundaries=json.loads((DOCS/'relectures-bornes.json').read_text())['units'] if (DOCS/'relectures-bornes.json').exists() else {}
    for level in sources:
        for u in pdf_units(level):
            if u['key'] in corrections:
                correction=corrections[u['key']]
                u['pdf_reference_parts']=list(u['reference_parts'])
                for old,new in correction['replace']:
                    u['reference_parts']=[part.replace(old,new) for part in u['reference_parts']]
                u['transcription']='\n'.join(u['reference_parts']);u['editorial_correction']=correction
            # Piste 9 A2 repeats the six documents of piste 8 for another task.
            if level == 'a2' and u['track'] == 9:
                u['parallel_reference_only'] = 'a2:008'
            sid = f"delf-actif-{level}-{u['track']}"+('-1' if level == 'a1' and u['track'] == 11 else '')
            source = next((s for s in sources[level] if s['source_id'] == sid), None)
            u['source_id'] = sid
            if not source:
                u['status'] = 'blocked_source_transfer_32_mib'
                prepared.append(u);continue
            recognition_paths={'parakeet_tdt':WORK/f'{level}-asr'/(sid+'.json')}
            alignment=WORK/'french-alignment'/(sid+'.json')
            if alignment.exists():recognition_paths['whisper_fr_dtw']=alignment
            recognitions={name:json.loads(path.read_text()) for name,path in recognition_paths.items()}
            assert all(r['source_sha256']==source['sha256'] and r['status']=='transcribed' for r in recognitions.values())
            parts=[];previous_time=-1
            for part_index,spoken in enumerate(u['reference_parts']):
                reviewed=boundaries.get(u['key'],{})
                if str(part_index) in reviewed.get('segments',{}):
                    assert reviewed['source_sha256']==source['sha256'],u['key']
                    override=reviewed['segments'][str(part_index)]
                    assert 0<=override['start']<override['end']<=source['duration_seconds']
                    parts.append(dict(reference=spoken,status='candidate',start=override['start'],end=override['end'],reviewed_boundary=override,recognition=dict(recognition_model='localized_acoustic_review',similarity=None)))
                    previous_time=override['end']
                    continue
                candidates=[]
                for model,recognition in recognitions.items():
                    for candidate in best_occurrences(spoken,recognition['words']):
                        if candidate['start_word']>previous_time:
                            candidates.append(dict(candidate,recognition_model=model))
                # A decoder can skip an intervening phrase and assign its time
                # to the previous token. For equal lexical evidence prefer the
                # compact complete occurrence, never the stretched token span.
                candidates.sort(key=lambda c:(-c['similarity'],c['end_word']-c['start_word'],c['start_word']))
                if not candidates:
                    parts.append(dict(reference=spoken,status='alignment_missing'));continue
                best = candidates[0]
                native=recognitions[best['recognition_model']]['words']
                first,last = best['first_word'],best['last_word']
                previous_time = native[last]['start']+.001
                start = max(0,native[first]['start']-.28)
                end = min(source['duration_seconds'],native[last]['end']+.22)
                if last+1 < len(native):
                    end = min(end,max(native[last]['start']+.15,native[last+1]['start']-.12))
                parts.append(dict(reference=spoken,status='candidate',start=round(start,4),end=round(end,4),recognition=best,alternatives=candidates[1:4]))
            u.update(source_sha256=source['sha256'],source_file=source['source_file'],segments=parts,status='candidate' if all(p['status']=='candidate' for p in parts) else 'alignment_incomplete',human_audio_listening_performed=False)
            prepared.append(u)
    write(DOCS/'preparation.json',dict(date='2026-11-13',method='PDF reference content, full-file Parakeet recognition and bounded semiglobal word alignment; no human listening claimed.',summary=dict(units=len(prepared),status=dict(Counter(u['status'] for u in prepared))),units=prepared))
    print(json.dumps(dict(units=len(prepared),status=dict(Counter(u['status'] for u in prepared))),ensure_ascii=False))


def editorial(level):
    path=DOCS/f'questions-{level}.tsv'
    if not path.exists():return {}
    out={};current=None
    for number,line in enumerate(path.read_text().splitlines(),1):
        if not line or line.startswith('#'):continue
        fields=line.split('|')
        if line.startswith('@'):
            assert len(fields)==3,(path,number)
            key=fields[0][1:];assert key not in out,key
            current=dict(key=key,title=fields[1],theme=fields[2],questions=[]);out[key]=current
        else:
            assert current is not None and len(fields)==5,(path,number)
            stem,correct,decoy1,decoy2,quote=fields
            assert stem.endswith('?') and len({correct.casefold(),decoy1.casefold(),decoy2.casefold()})==3,(path,number)
            assert re.search(r'\b(?:quels?|quelles?|qui|que|quoi|où|quand|comment|pourquoi|combien)\b|\bqu[’\']',stem,re.I),(path,number)
            current['questions'].append(dict(enonce=stem,choices=[correct,decoy1,decoy2],evidence_quote=quote))
    return out


def quote_report():
    units={u['key']:u for u in json.loads((DOCS/'preparation.json').read_text())['units']}
    errors=[];counts={}
    for level in ['a1','a2','b1']:
        items=editorial(level);counts[level]=dict(units=len(items),questions=sum(len(r['questions']) for r in items.values()))
        for key,item in items.items():
            assert key in units,key
            source=' '.join(literal_words(units[key]['transcription']))
            for i,q in enumerate(item['questions'],1):
                if ' '.join(literal_words(q['evidence_quote'])) not in source:
                    errors.append(dict(key=key,question=i,quote=q['evidence_quote']))
    write(DOCS/'citations-a-revoir.json',dict(counts=counts,errors=errors))
    print(json.dumps(dict(counts=counts,errors=errors),ensure_ascii=False))


def signal_bounds(source,segments):
    """Trim only empty margins; keep 180/240ms around the detected signal.

    This is an acoustic margin check, not proof of a complete syllable. Word
    timing and recognition of the final encoded file are checked separately.
    """
    from transcribe_words import decode_audio_local
    import numpy as np
    audio=decode_audio_local(Path(source))
    out=[]
    for segment in segments:
        start,end=segment['start'],segment['end'];lo=max(0,int(start*16000));hi=min(len(audio),int(end*16000))
        part=audio[lo:hi]
        active=np.flatnonzero(np.abs(part)>.0025)
        assert len(active)>0,'No audible samples in proposed cut'
        first=max(lo,lo+int(active[0])-2880);last=min(hi,lo+int(active[-1])+3840)
        assert last>first
        out.append(dict(start=first/16000,end=last/16000))
    return out


def cut(levels):
    units=json.loads((DOCS/'preparation.json').read_text())['units'];directory=WORK/'cuts';directory.mkdir(exist_ok=True)
    reports=[]
    def one(u):
        if u['status']!='candidate' or u.get('parallel_reference_only'):
            return dict(key=u['key'],status='not_cut',reason=u.get('parallel_reference_only',u['status']))
        if any(s['recognition']['similarity'] is not None and s['recognition']['similarity']<.65 for s in u['segments']):
            return dict(key=u['key'],status='needs_french_alignment',source_id=u['source_id'])
        source=Path(u['source_file']);assert sha(source)==u['source_sha256']
        name=u['key'].replace(':','-');prior=WORK/'cut-reviews'/(name+'.json')
        old=json.loads(prior.read_text()) if prior.exists() else None
        if old and old['source_sha256']==u['source_sha256'] and [(s['start'],s['end']) for s in old['word_alignment']]==[(s['start'],s['end']) for s in u['segments']]:
            previous=Path(old['path'])
            if previous.exists() and old['sha256']==sha(previous):return old
        bounds=signal_bounds(source,u['segments'])
        fingerprint=hashlib.sha256(json.dumps(dict(source_sha256=u['source_sha256'],bounds=bounds,codec='libmp3lame-q2-mono-44100',silences='over 2s below -55dB reduced to 0.5s'),sort_keys=True).encode()).hexdigest()
        # Never overwrite bytes that an already-running recognizer is reading.
        dest=directory/(name+'-'+fingerprint[:12]+'.mp3')
        if old and old.get('plan_sha256')==fingerprint and Path(old['path']).exists() and old['sha256']==sha(old['path']):return old
        # Accurate input seek for a single document; thematic compilations use
        # explicit ranges in one graph, without their spoken numbers/letters.
        if len(bounds)==1:
            b=bounds[0];args=['ffmpeg','-nostdin','-v','error','-y','-ss',str(b['start']),'-to',str(b['end']),'-i',str(source),'-map','0:a:0','-af','silenceremove=stop_periods=-1:stop_duration=2:stop_threshold=-55dB:stop_silence=0.5']
        else:
            graph=[]
            for i,b in enumerate(bounds):graph.append(f"[0:a]atrim=start={b['start']}:end={b['end']},asetpts=PTS-STARTPTS[p{i}]")
            graph.append(''.join(f'[p{i}]' for i in range(len(bounds)))+f'concat=n={len(bounds)}:v=0:a=1,silenceremove=stop_periods=-1:stop_duration=2:stop_threshold=-55dB:stop_silence=0.5[out]')
            args=['ffmpeg','-nostdin','-v','error','-y','-i',str(source),'-filter_complex',';'.join(graph),'-map','[out]']
        args+=['-vn','-map_metadata','-1','-ar','44100','-ac','1','-c:a','libmp3lame','-q:a','2',str(dest)]
        subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(dest)]))
        stream=next(s for s in probe['streams'] if s['codec_type']=='audio');assert stream['codec_name']=='mp3' and stream['channels']==1 and stream['sample_rate']=='44100'
        subprocess.run(['ffmpeg','-nostdin','-v','error','-i',str(dest),'-f','null','-'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        result=dict(key=u['key'],source_id=u['source_id'],source_sha256=u['source_sha256'],source_file=str(source),status='encoded_full_decode_passed_final_recognition_pending',path=str(dest),sha256=sha(dest),bytes=dest.stat().st_size,duration_seconds=float(probe['format']['duration']),plan_sha256=fingerprint,ranges=bounds,word_alignment=u['segments'],human_audio_listening_performed=False,encoding_command=args)
        write(prior,result);return result
    selected=[u for u in units if u['level'] in levels]
    # Two encoders bound memory, disk traffic and CPU alongside recognizers.
    with concurrent.futures.ThreadPoolExecutor(2) as pool:
        for result in pool.map(one,selected):reports.append(result)
    # A level-specific refresh must retain the other levels in the shared
    # catalogue, otherwise a later recognition/publish would silently omit them.
    refreshed={r['key']:r for r in reports}
    reports=[]
    for u in units:
        if u['key'] in refreshed:
            reports.append(refreshed[u['key']]);continue
        previous=WORK/'cut-reviews'/(u['key'].replace(':','-')+'.json')
        if u.get('parallel_reference_only'):
            reports.append(dict(key=u['key'],status='not_cut',reason=u['parallel_reference_only']))
        elif previous.exists():
            prior=json.loads(previous.read_text())
            assert prior['source_sha256']==u['source_sha256'],u['key']
            reports.append(prior)
        else:
            reports.append(dict(key=u['key'],status='cut_pending'))
    write(WORK/'cuts-index.json',dict(date='2026-11-13',units=reports))
    catalogue=[dict(source_id='actif-final-'+r['key'].replace(':','-'),source_file=r['path'],sha256=r['sha256'],unit_key=r['key']) for r in reports if 'path' in r]
    write(WORK/'cuts-sources.json',dict(sources=catalogue))
    print(json.dumps(dict(units=len(reports),status=dict(Counter(r['status'] for r in reports))),ensure_ascii=False))


def best_quote_match(reference, text):
    """Bounded contiguous ASR evidence, with no rewriting of recognized words."""
    # The shared hour normalizer can consume the space after an hour (17h00
    # devant -> 17h00devant). Repair the token boundary for this diagnostic;
    # never merge, round or replace numerical values.
    def diagnostic_tokens(value):
        return [piece for token in words(value) for piece in re.sub(r'(\d+h\d{2})(?=[a-z])',r'\1 ',token).split()]
    query=diagnostic_tokens(reference);actual=diagnostic_tokens(text)
    if not query or not actual:return dict(score=0,recognized='')
    prev=[0]*(len(actual)+1);starts=list(range(len(actual)+1))
    for i,a in enumerate(query,1):
        row=[i];next_starts=[0]
        for j,b in enumerate(actual,1):
            options=[(prev[j-1]+(a!=b),starts[j-1]),(prev[j]+1,starts[j]),(row[j-1]+1,next_starts[j-1])]
            cost,start=min(options,key=lambda p:p[0]);row.append(cost);next_starts.append(start)
        prev,starts=row,next_starts
    end=min(range(1,len(actual)+1),key=lambda j:(prev[j],j-starts[j]))
    span=actual[starts[end]:end]
    return dict(score=round(1-prev[end]/len(query),4),recognized=' '.join(span),numeric_missing=[t for t in query if any(c.isdigit() for c in t) and t not in span and not(t=='1' and re.search(r'\b(?:un|une)\b',reference,re.I))])


def evidence_report():
    comparisons=json.loads((WORK/'final-comparisons.json').read_text())['units']
    ed={k:v for l in ['a1','a2','b1'] for k,v in editorial(l).items()};checks=[]
    for row in comparisons:
        if row['key'] not in ed:continue
        for i,q in enumerate(ed[row['key']]['questions'],1):
            matches=[dict(engine=r['engine'],**best_quote_match(q['evidence_quote'],r['text'])) for r in row.get('comparisons',[])]
            best=max(matches,key=lambda r:r['score'],default=dict(score=0,numeric_missing=[]))
            checks.append(dict(key=row['key'],question=i,quote=q['evidence_quote'],matches=matches,needs_review=best['score']<.7 or bool(best['numeric_missing'])))
    write(WORK/'question-evidence-asr.json',dict(method='Contiguous approximate quotation matching in independently recognized final MP3s. A match is supporting evidence, not a semantic or human-listening certificate.',checks=checks))
    flagged=[r for r in checks if r['needs_review']]
    print(json.dumps(dict(questions=len(checks),needs_review=len(flagged)),ensure_ascii=False))


LEVELS={'a1':('a0-a1','A0-A1'),'a2':('a1-a2','A1-A2'),'b1':('a2-b1','A2-B1')}


def make_exercise(unit, item, audio_url):
    """Use the existing text/inline-answer forms and normal TCF audio composer."""
    return dict(id='tcf-delf-actif-'+unit['key'].replace(':','-'),
                niveau=LEVELS[unit['level']][1],competence='CO',type_exercice='complet',
                theme=f"DELF Actif {unit['level'].upper()} · {item['title']}",
                scenario=item['theme'],scene=item['title'],
                consigne='Vous allez écouter un document sonore. Il y a 2 écoutes. Lisez les questions, puis répondez.',
                support=dict(audio=audio_url,transcription=unit['transcription']),
                questions=[dict(enonce=q['enonce'],type_reponse='qcm_texte',points=1,melanger=True,
                                choix=[dict(id=chr(97+i),texte=t,**({'correct':True} if i==0 else {})) for i,t in enumerate(q['choices'])],
                                formes=dict(lignes=dict(nb_lignes=1,reponse_modele=q['choices'][0]))) for q in item['questions']])


def check_ready(unit, item, cut, approval):
    """An edited transcript, question or MP3 invalidates the recorded review."""
    assert approval.get('decision')=='ready_for_tcf',unit['key']
    assert approval.get('human_audio_listening_performed') is False
    assert cut['source_sha256']==unit['source_sha256']
    assert sha(cut['path'])==cut['sha256']==approval['audio_sha256'],unit['key']
    assert content_sha(unit['transcription'])==approval['transcription_sha256'],unit['key']
    assert content_sha(item)==approval['questions_sha256'],unit['key']
    seconds=cut['duration_seconds'];minimum=2 if seconds<=15 else 4 if seconds<=45 else 8
    assert len(item['questions'])>=minimum,(unit['key'],minimum)
    spoken=' '.join(literal_words(unit['transcription']))
    for q in item['questions']:
        assert ' '.join(literal_words(q['evidence_quote'])) in spoken,(unit['key'],q)
    assert set(approval.get('final_recognition_engines',[]))=={'final-parakeet','final-whisper'},unit['key']


def install():
    units=json.loads((DOCS/'preparation.json').read_text())['units']
    cuts={r['key']:r for r in json.loads((WORK/'cuts-index.json').read_text())['units']}
    approvals=json.loads((DOCS/'validation-finale.json').read_text())['units']
    ed={k:v for l in LEVELS for k,v in editorial(l).items()}
    banks={level:json.loads((ROOT/f'src/tcf/content/{folder}/co.json').read_text()) for level,(folder,_) in LEVELS.items()}
    durations=json.loads((ROOT/'src/tcf/content/audio-durations.json').read_text())
    pools=json.loads((ROOT/'src/tcf/content/co-reviewed-pools.json').read_text())
    plan=[]
    for unit in units:
        if unit.get('parallel_reference_only'):continue
        key=unit['key'];item=ed[key];cut=cuts[key];check_ready(unit,item,cut,approvals[key])
        url=f"/lib/audio/tcf/co/delf-actif-{unit['level']}/{key.replace(':','-')}.mp3"
        exercise=make_exercise(unit,item,url)
        old=next((e for e in banks[unit['level']] if e['id']==exercise['id']),None)
        assert old is None or old==exercise,('Existing entry changed; review a deliberate update before replacing it',key)
        target=ROOT/'public'/url.lstrip('/')
        assert not target.exists() or sha(target)==cut['sha256'],('Existing audio changed',key)
        plan.append((unit,item,cut,target,url,exercise,old))
    # All reviews and conflicts are checked before any production mutation.
    installed=[]
    for unit,item,cut,target,url,exercise,old in plan:
        if not target.exists():
            target.parent.mkdir(parents=True,exist_ok=True);temporary=target.with_suffix('.tmp')
            shutil.copyfile(cut['path'],temporary);assert sha(temporary)==cut['sha256'];temporary.replace(target)
        if old is None:banks[unit['level']].append(exercise)
        seconds=cut['duration_seconds'];durations[url]=seconds
        pools[url]=dict(tag='court' if seconds<=15 else 'moyen' if seconds<=45 else 'long',questions=len(item['questions']))
        installed.append(dict(key=unit['key'],exercise_id=exercise['id'],audio=url,audio_sha256=cut['sha256'],duration_seconds=seconds,questions=len(item['questions']),source_id=unit['source_id'],source_sha256=unit['source_sha256']))
    for level,rows in banks.items():write(ROOT/f'src/tcf/content/{LEVELS[level][0]}/co.json',rows)
    write(ROOT/'src/tcf/content/audio-durations.json',durations)
    write(ROOT/'src/tcf/content/co-reviewed-pools.json',pools)
    write(DOCS/'installation.json',dict(date='2026-11-13',supports=len(installed),questions=sum(r['questions'] for r in installed),units=installed,human_audio_listening_performed=False))
    print(json.dumps(dict(installed=len(installed),questions=sum(r['questions'] for r in installed))))


def recognition_report():
    """Mechanical comparison only; do not infer an editorial or human approval."""
    units={u['key']:u for u in json.loads((DOCS/'preparation.json').read_text())['units']}
    encoded=json.loads((WORK/'cuts-index.json').read_text())['units']
    recognized={}
    for directory in ['final-parakeet','final-whisper']:
        for path in (WORK/directory).glob('*.json'):
            record=json.loads(path.read_text())
            if record.get('status')=='transcribed' and record.get('source_sha256'):
                recognized.setdefault(record['source_sha256'],[]).append((directory,path,record))
    report=[]
    for cut in encoded:
        key=cut['key'];u=units[key]
        if 'path' not in cut:
            report.append(dict(key=key,status=cut['status']));continue
        expected=words(u['transcription']);comparisons=[]
        for engine,path,record in recognized.get(cut['sha256'],[]):
            actual=words(record['text']);matcher=difflib.SequenceMatcher(None,expected,actual,autojunk=False)
            edits=[dict(operation=op,expected=' '.join(expected[a:b]),recognized=' '.join(actual[c:d])) for op,a,b,c,d in matcher.get_opcodes() if op!='equal']
            first=difflib.SequenceMatcher(None,expected[:5],actual[:7],autojunk=False).ratio()
            last=difflib.SequenceMatcher(None,expected[-5:],actual[-7:],autojunk=False).ratio()
            numbering=bool(re.search(r'(?i)^\W*(?:exercice|situation numéro|document numéro|dialogue numéro|puis répondez)\b|^\W*\d+\s*[.)]|\b(?:écoutez le document|lisez les questions|deuxième écoute|seconde écoute)\b',record['text']))
            comparisons.append(dict(engine=engine,path=str(path),text=record['text'],similarity=round(matcher.ratio(),4),prefix_similarity=round(first,4),suffix_similarity=round(last,4),numbering_or_instructions=numbering,edits=edits))
        best=max(comparisons,key=lambda r:r['similarity'],default=None)
        status='recognition_missing' if not best else 'comparison_available'
        needs=not best or best['similarity']<.86 or best['prefix_similarity']<.65 or best['suffix_similarity']<.65 or best['numbering_or_instructions']
        report.append(dict(key=key,status=status,needs_editorial_check=needs,expected=u['transcription'],audio_sha256=cut['sha256'],audio_path=cut['path'],duration_seconds=cut['duration_seconds'],comparisons=comparisons,human_audio_listening_performed=False))
    write(WORK/'final-comparisons.json',dict(date='2026-11-13',purpose='Relecture des divergences ; aucun seuil ne certifie à lui seul la justesse sémantique ni une écoute humaine.',units=report))
    print(json.dumps(dict(units=len(report),status=dict(Counter(r['status'] for r in report)),needs_editorial_check=sum(r.get('needs_editorial_check',True) for r in report))))


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['prepare','quotes','cut','recognitions','evidence','install'])
    parser.add_argument('--level',action='append',choices=['a1','a2','b1'])
    args=parser.parse_args()
    if args.command == 'prepare':prepare()
    elif args.command == 'quotes':quote_report()
    elif args.command == 'cut':cut(args.level or ['a1','a2','b1'])
    elif args.command == 'recognitions':recognition_report()
    elif args.command == 'evidence':evidence_report()
    elif args.command == 'install':install()
