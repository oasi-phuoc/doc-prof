#!/usr/bin/env python3
"""Work-only segmentation drafts from native timed ASR; never attests listening."""
import argparse
import difflib
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import BoundaryError, now, plan_segments, prepare, safe_work, sha256


def norm(text):
    return ''.join(c for c in unicodedata.normalize('NFD', text.lower()) if unicodedata.category(c) != 'Mn').strip('.,!?;:«»“”\"')


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('x', encoding='utf-8') as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2, allow_nan=False)
        handle.write('\n')


def slug(value):
    return re.sub('[^A-Za-z0-9_-]', '-', value)


def native_words(asr):
    """Drop punctuation-only token time, retain raw indices and every adjustment."""
    words, corrections = [], []
    for index, original in enumerate(asr['words']):
        chunk = asr['chunks'][original['chunk_index']]
        lexical = [i for i in original['native_token_indices'] if any(c.isalnum() for c in chunk['tokens'][i])]
        begin, end = original['start'], original['end']
        if lexical:
            begin = chunk['start'] + min(chunk['timestamps'][i] for i in lexical)
            end = chunk['start'] + max(chunk['timestamps'][i] + chunk['durations'][i] for i in lexical)
        rounded_begin, rounded_end = round(begin, 6), round(end, 6)
        if rounded_end <= rounded_begin:
            rounded_end = rounded_begin + .08
            corrections.append({'word_index': index, 'reason': 'zero_duration_lexical_token_estimated_80ms',
                                'raw_start': original['start'], 'raw_end': original['end'],
                                'draft_start': rounded_begin, 'draft_end': rounded_end})
        if abs(end - original['end']) > .001 or abs(begin - original['start']) > .001:
            corrections.append({'word_index': index, 'reason': 'exclude_punctuation_only_token_timing',
                                'raw_start': original['start'], 'raw_end': original['end'],
                                'draft_start': rounded_begin, 'draft_end': rounded_end})
        word = {'text': original['word'], 'start': rounded_begin, 'end': rounded_end, 'kind': 'dialogue',
                'asr_word_index': index, 'raw_start': original['start'], 'raw_end': original['end'],
                'native_token_indices': original['native_token_indices']}
        words.append(word)
    # TDT floats introduce up to a few microseconds of false overlap. Other overlaps
    # remain explicit blockers; never squeeze a real overlap into a plausible word.
    for index in range(1, len(words)):
        previous, current = words[index-1], words[index]
        overlap = previous['end'] - current['start']
        if 0 < overlap <= .00001:
            boundary = round((previous['end'] + current['start']) / 2, 6)
            corrections.append({'word_index': index, 'reason': 'native_float_overlap_only',
                                'overlap_seconds': overlap, 'draft_boundary': boundary})
            previous['end'] = current['start'] = boundary
    return words, corrections


def labels(words):
    result = []
    heads = {'document', 'dialogue', 'exercice', "l'exercice", 'activite', 'piste', 'partie'}
    for index in range(len(words)-1):
        head, following = norm(words[index]['text']), norm(words[index+1]['text'])
        if head in heads and re.fullmatch(r'\d{1,3}|un|une|deux|trois|quatre|cinq|six', following):
            result.append({'first_word': index, 'last_word': index+1, 'label': f'{head} {following}',
                           'type': 'document' if head in ('document', 'dialogue') else 'exercise'})
    # Standalone sequence 1/2/3 is a candidate only with gaps on both sides.
    # Numbers embedded in a phone, price, date or sentence are never split here.
    prior_sequence = 0
    covered = {i for entry in result for i in range(entry['first_word'], entry['last_word']+1)}
    for index, word in enumerate(words):
        token = norm(word['text'])
        if index in covered or not re.fullmatch('[1-9]', token) or index+1 == len(words):
            continue
        value = int(token)
        before = word['start'] - words[index-1]['end'] if index else word['start']
        after = words[index+1]['start'] - word['end']
        if value == prior_sequence+1 and before >= .4 and after >= .35:
            result.append({'first_word': index, 'last_word': index, 'label': f'item {value}', 'type': 'item'})
            prior_sequence = value
    return sorted(result, key=lambda entry: entry['first_word'])


def classify(words, override=None):
    uncertainties = ['Horodatages ASR natifs estimés (pas de contrôle d’écoute ni alignement phonétique certifié).']
    markers = labels(words)
    excluded = []
    if override:
        segments = override['segments']
        excluded = override.get('non_dialogue', [])
        uncertainties += override.get('uncertainties', [])
        method = 'textual_review_override_no_listening'
    else:
        method = 'automatic_lexical_labels_requires_review'
        # The final initial exercise label anchors introductory material. Later
        # explicit Document/Dialogue labels divide recordings; pauses do not.
        documents = [entry for entry in markers if entry['type'] in ('document', 'item')]
        exercises = [entry for entry in markers if entry['type'] == 'exercise']
        if documents:
            first = documents[0]['first_word']
            if first:
                excluded.append({'first_word': 0, 'last_word': first-1, 'kind': 'instruction', 'reason': 'préambule avant premier label'})
            segments = []
            for i, entry in enumerate(documents):
                excluded.append({**entry, 'kind': 'announcement', 'reason': 'label lexical explicite ou numéro séquentiel avec contexte'})
                start, end = entry['last_word']+1, (documents[i+1]['first_word']-1 if i+1 < len(documents) else len(words)-1)
                if start <= end:
                    segments.append({'first_word': start, 'last_word': end, 'label': entry['label']})
        else:
            anchor = next((entry for entry in reversed(exercises) if entry['first_word'] < min(30, len(words)//2)), None)
            start = anchor['last_word']+1 if anchor else 0
            if start:
                excluded.append({'first_word': 0, 'last_word': start-1, 'kind': 'instruction', 'reason': 'préambule et label exercice initial'})
            segments = [{'first_word': start, 'last_word': len(words)-1, 'label': 'contenu sans label de document'}]
        uncertainties.append('Classification automatique du préambule, de la fin et des éventuelles reprises à vérifier sur la source.')
    for entry in excluded:
        for index in range(entry['first_word'], entry['last_word']+1):
            words[index]['kind'] = entry['kind']
    return segments, excluded, uncertainties, method, markers


def make_plan(asr, source, override=None):
    words, corrections = native_words(asr)
    segments, excluded, uncertainties, method, markers = classify(words, override)
    result = []
    for index, entry in enumerate(segments):
        selected = words[entry['first_word']:entry['last_word']+1]
        if not selected:
            continue
        result.append({'id': slug(source['source_id']) + '-d' + str(index+1),
                       'name': source['original_filename'] + ' — ' + entry['label'],
                       'tags': [source['level'], source['collection'], 'source-native', 'a-verifier'],
                       'first_word': entry['first_word'], 'last_word': entry['last_word'],
                       'transcript': ' '.join(word['text'] for word in selected),
                       'margin_before_ms': 80, 'margin_after_ms': 120,
                       'boundary_uncertainty': uncertainties + entry.get('uncertainties', []),
                       'existing_dialogue_id': None, 'recording_label': entry['label']})
    groups = []
    for left in range(len(result)):
        for right in range(left+1, len(result)):
            a = norm(result[left]['transcript'])
            b = norm(result[right]['transcript'])
            similarity = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
            if similarity >= .85 and min(len(a.split()), len(b.split())) >= 6:
                groups.append({'segment_ids': [result[left]['id'], result[right]['id']], 'similarity': similarity,
                               'classification': 'possible_replay_requires_listening', 'selected_take': None})
    provenance = {'source_id': source['source_id'], 'source_sha256': source['sha256'],
                  'source_file': source['source_file'], 'asr_parameters': asr.get('parameters'),
                  'word_timing_method': asr.get('word_timing_method'),
                  'classification_method': method, 'native_word_indices_preserved': True,
                  'timing_adjustments': corrections, 'excluded_ranges': excluded,
                  'detected_labels': markers, 'possible_replays': groups,
                  'listening_performed': False, 'production_modified': False}
    return {'schema_version': 1, 'words': words, 'segments': result, 'provenance': provenance}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    base = Path('/workspace/work/tcf-audio-replacement')
    parser.add_argument('--catalogue', type=Path, default=base/'source-catalogue.json')
    parser.add_argument('--asr-dir', type=Path, default=base/'source-asr-parakeet')
    parser.add_argument('--extra-asr', type=Path, action='append', default=[])
    parser.add_argument('--overrides', type=Path, default=base/'segmentation-overrides.json')
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--prepare-source-id', action='append', default=[])
    parser.add_argument('--compact', action='store_true')
    args = parser.parse_args()
    output = safe_work(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    sources = load(args.catalogue)['sources']
    by_hash = {source['sha256']: source for source in sources}
    overrides = load(args.overrides) if args.overrides.exists() else {}
    overrides = overrides.get('overrides', overrides.get('sources', overrides))
    asr_paths = list(args.asr_dir.glob('*.json')) + args.extra_asr
    records, seen = [], set()
    for path in sorted(asr_paths):
        asr = load(path)
        if not isinstance(asr, dict) or asr.get('status') != 'transcribed' or 'words' not in asr:
            continue
        source = by_hash.get(asr.get('source_sha256'))
        if not source or source['source_id'] in seen:
            continue
        seen.add(source['source_id'])
        plan = make_plan(asr, source, overrides.get(source['source_id']))
        plan['provenance']['asr_path'] = str(path)
        plan['provenance']['asr_sha256'] = sha256(path)
        folder = output / slug(source['source_id'])
        folder.mkdir(exist_ok=True)
        plan_path = folder/'candidate-plan.json'
        if plan_path.exists():
            raise BoundaryError(f'Sortie existante, choisir un nouveau output-dir : {plan_path}')
        save(plan_path, plan)
        record = {'source_id': source['source_id'], 'source_file': source['source_file'],
                  'source_sha256': source['sha256'], 'asr_path': str(path), 'plan_path': str(plan_path),
                  'word_count': len(plan['words']), 'segments': plan['segments'],
                  'excluded_ranges': plan['provenance']['excluded_ranges'],
                  'timing_adjustments': len(plan['provenance']['timing_adjustments']),
                  'classification_method': plan['provenance']['classification_method'],
                  'possible_replays': plan['provenance']['possible_replays'], 'status': 'candidate'}
        try:
            plan_segments(plan, source['duration_seconds'], source['sample_rate'])
            record['plan_integrity'] = 'passed'
        except BoundaryError as exc:
            record['plan_integrity'] = 'requires_correction'
            record['blocker'] = str(exc)
        if source['source_id'] in args.prepare_source_id and record['plan_integrity'] == 'passed':
            manifest = prepare(Path(source['source_file']), plan_path, output, compact=args.compact)
            record.update(status='needs_review', manifest_path=str(manifest))
        save(folder/'source-segments.json', record)
        records.append(record)
    index = {'schema_version': 1, 'created_at': now(), 'sources_in_catalogue': len(sources),
             'sources_with_plan': len(records), 'segments': sum(len(record['segments']) for record in records),
             'plans_passed': sum(record['plan_integrity'] == 'passed' for record in records),
             'plans_requiring_correction': sum(record['plan_integrity'] != 'passed' for record in records),
             'sources_prepared': sum('manifest_path' in record for record in records),
             'listening_performed': False, 'validated_segments': 0, 'production_modified': False,
             'sources': records}
    save(output/'segmentation-index.json', index)
    print(json.dumps({key:value for key,value in index.items() if key != 'sources'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
