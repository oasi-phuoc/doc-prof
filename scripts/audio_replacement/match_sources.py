#!/usr/bin/env python3
"""Read-only candidate search from existing CO transcripts into ASR originals.

This provides lexical evidence and seed intervals, never acoustically validated cuts.
"""
import argparse
import collections
import datetime
import difflib
import hashlib
import json
import math
import pathlib
import re
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORK = pathlib.Path('/workspace/work/tcf-audio-replacement')

TOKEN_ALIASES = dict(zip(
    'zero deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize vingt trente quarante cinquante soixante cent mille'.split(),
    '0 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 20 30 40 50 60 100 1000'.split()))
TOKEN_ALIASES.update({'heure': 'h', 'heures': 'h', 'kilo': 'kg', 'kilos': 'kg', 'kilogramme': 'kg', 'kilogrammes': 'kg',
                      'prof': 'professeur', 'professeure': 'professeur'})

def norm_words(text):
    text = str(text).lower().replace('œ', 'oe').replace('æ', 'ae')
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if not unicodedata.combining(c))
    return [TOKEN_ALIASES.get(word, word) for word in re.findall(r'[a-z]+|[0-9]+', text)]

STOPWORDS = set('a au aux avec ce ces cet cette dans de des du elle en est et il ils je la le les leur leurs lui ma mais me mes mon ne nos notre nous on ou par pas pour qu que quel quelle quels quelles qui sa se ses son sont sur ta te tes ton tu un une vos votre vous y l d c s m n t'.split())

def content_tokens(text):
    return {word[:-1] if len(word) > 4 and word.endswith('s') else word
            for word in norm_words(text) if word not in STOPWORDS}

def answer_impacts(current_doc, candidate, source_text):
    available = content_tokens(source_text)
    issues = []
    for use in current_doc['uses']:
        for question in use['questions']:
            for answer in question['correct_answers']:
                if not answer or not isinstance(answer, str) or answer.startswith('/'):
                    continue
                important = content_tokens(answer)
                absent = sorted(important - available)
                if absent:
                    issues.append({'exercise_id': use['exercise_id'], 'question_index_0based': question['index_0based'],
                                   'question': question['enonce'], 'current_correct_answer': answer,
                                   'absent_content_tokens': absent,
                                   'status': 'semantic_review_required_lexical_absence_is_not_proof_of_wrong_answer'})
    return issues

def atomic_json(path, value):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)

def current_index(repo=ROOT):
    indexed = {}
    for path in sorted((repo / 'src/tcf/content').glob('*/co.json')):
        exercises = json.loads(path.read_text())
        for ei, exercise in enumerate(exercises):
            support = exercise.get('support', {})
            refs = support.get('audios') or [support.get('audio')]
            transcripts = support.get('transcription', '')
            transcripts = transcripts if isinstance(transcripts, list) else [transcripts]
            for ai, ref in enumerate(refs):
                if not ref:
                    continue
                record = indexed.setdefault(ref, {'old_ref': ref, 'dialogue_id': pathlib.Path(ref).stem,
                                                  'uses': [], 'transcript_variants': []})
                transcript = transcripts[ai] if ai < len(transcripts) else None
                if transcript is not None and transcript not in record['transcript_variants']:
                    record['transcript_variants'].append(transcript)
                record['uses'].append({
                    'exercise_id': exercise['id'], 'bank': str(path.relative_to(repo)),
                    'audio_json_pointer': f'/{ei}/support/' + (f'audios/{ai}' if 'audios' in support else 'audio'),
                    'transcription_json_pointer': f'/{ei}/support/transcription' + (f'/{ai}' if isinstance(support.get('transcription'), list) else ''),
                    'audio_index_1based': ai + 1, 'niveau': exercise.get('niveau'),
                    'type_exercice': exercise.get('type_exercice'), 'theme': exercise.get('theme'),
                    'scenario': exercise.get('scenario'), 'scene': exercise.get('scene'),
                    'questions': [{'index_0based': qi, 'audio_index_1based': q.get('audio'),
                                   'enonce': q.get('enonce'),
                                   'correct_answers': [c.get('texte', c.get('image')) for c in q.get('choix', []) if c.get('correct')]}
                                  for qi, q in enumerate(exercise.get('questions', []))
                                  if len(refs) == 1 or q.get('audio') in (None, ai + 1)],
                    'question_scope': 'all_questions_single_audio' if len(refs) == 1 else 'explicit_index_and_unassigned_questions_require_review',
                })
    for record in indexed.values():
        path = repo / 'public' / record['old_ref'].lstrip('/')
        record['current_file'] = str(path)
        record['file_exists'] = path.is_file()
        if path.is_file():
            record['size_bytes'] = path.stat().st_size
            record['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
        record['conflicting_transcripts'] = len(record['transcript_variants']) != 1
    return list(indexed.values())

def source_tokens(doc):
    words = doc.get('words', [])
    tokens, indices = [], []
    for wi, word in enumerate(words):
        for token in norm_words(word.get('word', word.get('text', ''))):
            tokens.append(token)
            indices.append(wi)
    return tokens, indices

def lexical_alignment(target, tokens):
    """Group matching blocks by approximate source offset; avoid crossing repetitions."""
    matcher = difflib.SequenceMatcher(None, target, tokens, autojunk=False)
    blocks = [b for b in matcher.get_matching_blocks() if b.size]
    if not blocks:
        return None
    groups = []
    for block in blocks:
        # Source gaps > target gaps + 12 indicate repeated dialogue or intervening text.
        if groups:
            previous = groups[-1][-1]
            split = (block.b - previous.b - previous.size) > (block.a - previous.a - previous.size) + 12
        else:
            split = True
        if split:
            groups.append([])
        groups[-1].append(block)
    best = None
    for group in groups:
        first, last = group[0], group[-1]
        matched = sum(b.size for b in group)
        source_start = max(0, first.b - first.a)
        source_end = min(len(tokens), last.b + last.size + len(target) - last.a - last.size)
        if source_end <= source_start:
            continue
        coverage = matched / len(target)
        density = matched / (source_end - source_start)
        score = 2 * coverage * density / (coverage + density) if coverage + density else 0
        candidate = {'score': score, 'target_token_coverage': coverage, 'source_token_precision': density,
                     'matched_tokens': matched, 'target_tokens': len(target),
                     'source_token_first': source_start, 'source_token_last': source_end - 1,
                     'matched_source_token_first': first.b, 'matched_source_token_last': last.b + last.size - 1,
                     'target_prefix_unmatched': first.a,
                     'target_suffix_unmatched': len(target) - last.a - last.size,
                     'matching_blocks': [{'target': b.a, 'source': b.b, 'length': b.size} for b in group]}
        if best is None or score > best['score']:
            best = candidate
    return best

def run(args):
    current_path = WORK / 'current-dialogue-index.json'
    if args.reindex or not current_path.exists():
        current = current_index(pathlib.Path(args.repo))
        atomic_json(current_path, {'schema_version': 1, 'status': 'inventory_only',
                                  'audio_root': '/lib/audio/tcf/co/', 'dialogues': current,
                                  'summary': {'unique_urls': len(current), 'audio_uses': sum(len(x['uses']) for x in current),
                                              'shared_urls': [x['old_ref'] for x in current if len(x['uses']) > 1],
                                              'missing_files': [x['old_ref'] for x in current if not x['file_exists']]}})
    current = json.loads(current_path.read_text())['dialogues']
    catalogue = json.loads((WORK / 'source-catalogue.json').read_text())
    metadata = {x['source_id']: x for x in catalogue['sources']}
    docs = []
    for path in sorted(pathlib.Path(args.asr_dir).glob('*.json')):
        if path.name in ('index.json', 'batch-progress.json', 'batch-summary.json'):
            continue
        try:
            doc = json.loads(path.read_text())
        except (ValueError, OSError):
            continue
        if doc.get('status') not in ('transcribed','plan_matching_view') or not doc.get('words'):
            continue
        sid = doc.get('source_id', path.stem)
        if sid not in metadata:
            continue
        if doc.get('source_sha256') != metadata[sid]['sha256']:
            raise ValueError('ASR/matching view source checksum differs from catalogue: '+sid)
        if doc.get('status') == 'plan_matching_view':
            if (doc.get('purpose') != 'canonical_plan_words_for_matching_only_not_asr_input' or
                    hashlib.sha256(pathlib.Path(doc['plan_path']).read_bytes()).hexdigest() != doc['plan_sha256']):
                raise ValueError('Matching view no longer corresponds to the exact candidate plan: '+sid)
        tokens, token_words = source_tokens(doc)
        docs.append({'source_id': sid, 'doc': doc, 'tokens': tokens, 'token_words': token_words,
                     'counts': collections.Counter(tokens), 'metadata': metadata[sid], 'asr_file': str(path)})
    dfs = collections.Counter()
    inverted = collections.defaultdict(set)
    for di, doc in enumerate(docs):
        for token in doc['counts']:
            dfs[token] += 1
            inverted[token].add(di)
    results = []
    for current_doc in current:
        variants = current_doc['transcript_variants']
        if not variants or not norm_words(variants[0]):
            results.append({'old_ref': current_doc['old_ref'], 'status': 'missing_current_transcript', 'candidates': []})
            continue
        target = norm_words(variants[0])
        tcounts = collections.Counter(target)
        # Smoothed inverse document frequency; cap long-doc term frequency to avoid announcements dominance.
        scores = collections.defaultdict(float)
        for token, count in tcounts.items():
            weight = math.log((len(docs) + 1) / (dfs[token] + 0.5)) + 0.3
            for di in inverted[token]:
                scores[di] += min(count, docs[di]['counts'][token]) * weight
        shortlisted = sorted(scores, key=lambda di: scores[di], reverse=True)[:args.top_sources]
        candidates = []
        for di in shortlisted:
            source = docs[di]
            alignment = lexical_alignment(target, source['tokens'])
            if alignment is None or alignment['target_token_coverage'] < 0.32:
                continue
            words = source['doc']['words']
            first = source['token_words'][alignment.pop('source_token_first')]
            last = source['token_words'][alignment.pop('source_token_last')]
            matched_first = source['token_words'][alignment.pop('matched_source_token_first')]
            matched_last = source['token_words'][alignment.pop('matched_source_token_last')]
            alignment.update({'source_id': source['source_id'], 'source_sha256': source['metadata']['sha256'],
                              'source_file': source['metadata']['source_file'], 'asr_file': source['asr_file'],
                              'original_filename': source['metadata']['original_filename'], 'source_level': source['metadata']['level'],
                              'word_first': first, 'word_last': last,
                              'matched_word_first': matched_first, 'matched_word_last': matched_last,
                              'start_estimated_seconds': words[first]['start'], 'end_estimated_seconds': words[last]['end'],
                              'matched_text': ' '.join(w.get('word', w.get('text', '')) for w in words[first:last+1]),
                              'context_before': words[max(0, first-12):first],
                              'context_after': words[last+1:last+13],
                              'word_text_matches_result': source['doc'].get('word_text_matches_result'),
                              'word_timing_method': source['doc'].get('word_timing_method'),
                              'word_index_basis': source['doc'].get('word_index_basis','raw_asr_words'),
                              'plan_path': source['doc'].get('plan_path'),
                              'plan_sha256': source['doc'].get('plan_sha256'),
                              'status': 'lexical_seed_requires_dialogue_boundaries_and_listening'})
            alignment['review_flags'] = []
            if alignment['target_prefix_unmatched'] or alignment['target_suffix_unmatched']:
                alignment['review_flags'].append('seed_extends_beyond_lexical_matches_do_not_use_as_cut')
            if re.search(r'\b(exercice|activit[eé]|document|dialogue|[eé]coute)\b', alignment['matched_text'], re.I):
                alignment['review_flags'].append('possible_instruction_or_numbering_within_seed')
            old_digits = sorted(set(re.findall(r'\d+', variants[0])))
            new_digits = sorted(set(re.findall(r'\d+', alignment['matched_text'])))
            if old_digits != new_digits:
                alignment['review_flags'].append('digit_forms_differ_requires_fact_check_not_automatic_correction')
            alignment['digit_form_comparison'] = {'old': old_digits, 'source_seed': new_digits}
            alignment['question_answer_review'] = answer_impacts(current_doc, alignment, alignment['matched_text'])
            candidates.append(alignment)
        candidates.sort(key=lambda x: x['score'], reverse=True)
        candidates = candidates[:args.keep]
        best = candidates[0] if candidates else None
        second = candidates[1] if len(candidates) > 1 else None
        # Conservative lexical label is not a validation or permission to replace.
        if not best or best['score'] < 0.65:
            status = 'unresolved'
        elif len(target) < 10:
            status = 'short_transcript_requires_review'
        elif second and best['score'] - second['score'] < 0.08:
            status = 'multiple_sources_require_review'
        elif best['score'] >= 0.90 and best['target_token_coverage'] >= 0.90:
            status = 'strong_lexical_candidate'
        else:
            status = 'partial_lexical_candidate'
        results.append({'old_ref': current_doc['old_ref'], 'dialogue_id': current_doc['dialogue_id'],
                        'exercise_ids': [x['exercise_id'] for x in current_doc['uses']],
                        'current_transcript': variants[0], 'conflicting_transcripts': current_doc['conflicting_transcripts'],
                        'status': status, 'candidates': candidates})
    summary = {'source_files_received': len(metadata), 'source_files_transcribed_available': len(docs),
               'current_unique_audio_urls': len(current), 'current_audio_uses': sum(len(x['uses']) for x in current),
               'status_counts': dict(collections.Counter(x['status'] for x in results)),
               'not_acoustically_validated': True, 'production_modified': False}
    # Different current refs claiming overlapping source speech may be duplicated or incomplete.
    by_source = collections.defaultdict(list)
    for item in results:
        if item['candidates'] and item['candidates'][0]['score'] >= 0.80:
            candidate = item['candidates'][0]
            by_source[candidate['source_id']].append((item, candidate))
    overlaps = []
    for source_id, items in by_source.items():
        for i, (left_item, left) in enumerate(items):
            for right_item, right in items[i+1:]:
                lo = max(left['matched_word_first'], right['matched_word_first'])
                hi = min(left['matched_word_last'], right['matched_word_last'])
                if hi < lo:
                    continue
                overlap = (hi - lo + 1) / min(left['matched_word_last'] - left['matched_word_first'] + 1,
                                              right['matched_word_last'] - right['matched_word_first'] + 1)
                if overlap >= 0.50:
                    overlaps.append({'source_id': source_id, 'old_refs': [left_item['old_ref'], right_item['old_ref']],
                                     'overlap_of_shorter': round(overlap, 4),
                                     'status': 'review_possible_duplicate_or_partial_dialogue_do_not_merge_automatically'})
    summary['overlapping_current_audio_pairs'] = len(overlaps)
    report = {'schema_version': 1, 'generated_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'purpose': 'lexical matching candidates only; intervals are seed estimates, not validated cuts',
              'summary': summary, 'overlapping_current_audio_pairs': overlaps, 'matches': results}
    atomic_json(WORK / 'source-dialogue-candidates.json', report)
    lines = ['# Correspondances audio candidates', '',
             'Recherche textuelle dans les originaux reçus. Ces passages ne constituent pas des découpes validées.', '',
             f"Sources transcrites disponibles : {len(docs)}/{len(metadata)}. URLs actuelles : {len(current)}.", '',
             '| Statut | Nombre |', '|---|---:|']
    lines.extend(f'| {k} | {v} |' for k, v in summary['status_counts'].items())
    lines += ['', '## Meilleurs candidats lexicaux', '']
    for item in results:
        if item['status'] != 'strong_lexical_candidate':
            continue
        candidate = item['candidates'][0]
        lines.extend([f"- `{item['old_ref']}` → `{candidate['original_filename']}` mots {candidate['word_first']}–{candidate['word_last']}, "
                      f"{candidate['start_estimated_seconds']:.2f}–{candidate['end_estimated_seconds']:.2f}s, score {candidate['score']:.3f}.",
                      f"  Source : {candidate['matched_text']}"])
    (WORK / 'source-dialogue-candidates.md').write_text('\n'.join(lines) + '\n')
    print(json.dumps(summary, ensure_ascii=False))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', default=str(ROOT))
    parser.add_argument('--work', type=pathlib.Path, default=WORK)
    parser.add_argument('--asr-dir', default=str(WORK / 'source-asr-parakeet'))
    parser.add_argument('--top-sources', type=int, default=12)
    parser.add_argument('--keep', type=int, default=3)
    parser.add_argument('--reindex', action='store_true')
    options = parser.parse_args()
    WORK = options.work
    WORK.mkdir(parents=True, exist_ok=True)
    run(options)
