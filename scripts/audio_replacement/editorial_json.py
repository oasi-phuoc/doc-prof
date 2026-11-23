"""Read editable CE/CO fragments without changing runtime text or track boundaries."""
import json


def normalize_editorial_bank(value):
    if isinstance(value, list):
        return [normalize_editorial_bank(entry) for entry in value]
    if not isinstance(value, dict):
        return value
    result = dict(value)
    if 'exercise' in result:
        result['exercise'] = normalize_editorial_bank(result['exercise'])
    support = result.get('support')
    if isinstance(support, dict):
        support = dict(support)

        def fragments(text):
            return ''.join(text) if isinstance(text, list) and all(isinstance(part, str) for part in text) else text

        if 'texte' in support:
            support['texte'] = fragments(support['texte'])
        transcription = support.get('transcription')
        if isinstance(transcription, list):
            if isinstance(support.get('audios'), list):
                support['transcription'] = [fragments(part) for part in transcription]
            elif isinstance(support.get('audio'), str):
                support['transcription'] = fragments(transcription)
        result['support'] = support
    return result


def loads(source, *args, **kwargs):
    return normalize_editorial_bank(json.loads(source, *args, **kwargs))


def load(stream, *args, **kwargs):
    return loads(stream.read(), *args, **kwargs)
