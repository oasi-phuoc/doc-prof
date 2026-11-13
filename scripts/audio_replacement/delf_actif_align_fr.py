"""Second French recognition with native Whisper DTW word timing.

The model's existing attention heads are exposed in memory, as in the earlier
audio-boundary reviews. Original model weights and recordings remain unchanged.
"""
import argparse
import json
import os
from pathlib import Path
import time

from delf_actif_import import WORK, sha, write
from transcribe_words import decode_audio_local, speech_processing_windows
from whisper_alignment import model_memfd, word_units


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-id',action='append',required=True)
    args=parser.parse_args()
    import sherpa_onnx
    model=Path('/tmp/clairfle-whisper-small-20261111')
    encoder=next(model.glob('*encoder.int8.onnx'));decoder=next(model.glob('*decoder.int8.onnx'));tokens=next(model.glob('*tokens.txt'))
    fde,epath,ehash=model_memfd(encoder);fdd,dpath,dhash=model_memfd(decoder,decoder=True)
    recognizer=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=epath,decoder=dpath,tokens=str(tokens),language='fr',task='transcribe',num_threads=1,enable_token_timestamps=True,enable_segment_timestamps=False)
    sources={r['source_id']:r for level in ['a1','a2','b1'] for r in json.loads((WORK/f'{level}-sources.json').read_text())['sources']}
    for ident in args.source_id:
        row=sources[ident];dest=WORK/'french-alignment'/(ident+'.json')
        if dest.exists() and json.loads(dest.read_text()).get('source_sha256')==row['sha256']:
            continue
        started=time.perf_counter();audio=decode_audio_local(Path(row['source_file']))
        windows=speech_processing_windows(audio) if len(audio)>=29*16000 else [dict(start=0,end=len(audio))]
        output=[];chunks=[]
        for window in windows:
            offset,end=window['start']/16000,window['end']/16000
            assert end-offset <29
            stream=recognizer.create_stream();stream.accept_waveform(16000,audio[window['start']:window['end']]);recognizer.decode_stream(stream);result=stream.result
            units=word_units(list(result.tokens),list(result.timestamps),list(result.durations),offset)
            output.extend(dict(word=u['text'],start=u['start'],end=u['end']) for u in units)
            chunks.append(dict(start=offset,end=end,text=result.text))
        record=dict(status='transcribed',source_id=ident,source_sha256=sha(row['source_file']),source=row['source_file'],text=' '.join(c['text'] for c in chunks),words=output,chunks=chunks,method='Whisper small INT8, forced French, native cross-attention DTW 20ms; model graph in memory only',human_audio_listening_performed=False,wall_seconds=time.perf_counter()-started)
        write(dest,record);print(json.dumps(dict(source_id=ident,words=len(output),seconds=round(record['wall_seconds'],2))),flush=True)
    os.close(fde);os.close(fdd)


if __name__=='__main__':main()
