#!/usr/bin/env python3
"""Independent French Whisper transcription with native DTW timing; never attests listening."""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import time
from transcribe_words import decode_audio_local, sha256, write_json
from whisper_alignment import HEADS, model_memfd, word_units


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalogue',type=Path,required=True)
    parser.add_argument('--source-id',action='append',required=True)
    parser.add_argument('--output-dir',type=Path,required=True)
    parser.add_argument('--model-dir',type=Path,required=True)
    args=parser.parse_args()
    import sherpa_onnx
    from faster_whisper.vad import get_speech_timestamps,VadOptions
    sources={r['source_id']:r for r in json.loads(args.catalogue.read_text())['sources']}
    encoder=next(args.model_dir.glob('*encoder.int8.onnx'))
    decoder=next(args.model_dir.glob('*decoder.int8.onnx'))
    tokens=next(args.model_dir.glob('*tokens.txt'))
    enc_sha,dec_sha=sha256(encoder),sha256(decoder)
    fde,epath,ehash=model_memfd(encoder)
    fdd,dpath,dhash=model_memfd(decoder,True)
    args.output_dir.mkdir(parents=True,exist_ok=True)
    try:
        recognizer=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=epath,decoder=dpath,tokens=str(tokens),
            language='fr',task='transcribe',num_threads=1,enable_token_timestamps=True,enable_segment_timestamps=False)
        for sid in args.source_id:
            source=sources[sid]
            if sha256(Path(source['source_file']))!=source['sha256']:
                raise ValueError('Original source checksum changed')
            destination=args.output_dir/(sid+'.json')
            if destination.exists():
                previous=json.loads(destination.read_text())
                if previous.get('source_sha256')!=source['sha256'] or previous.get('status')!='transcribed':
                    raise ValueError('An earlier alignment must be retained; select a new output directory')
                print(json.dumps({'source_id':sid,'status':'existing_alignment_retained'}),flush=True)
                continue
            started=time.monotonic()
            audio=decode_audio_local(source['source_file'])
            windows=get_speech_timestamps(audio,VadOptions(max_speech_duration_s=24,
                                         min_silence_duration_ms=600,speech_pad_ms=150))
            chunks,words=[],[]
            for ci,window in enumerate(windows):
                offset,end=window['start']/16000,window['end']/16000
                stream=recognizer.create_stream()
                stream.accept_waveform(16000,audio[window['start']:window['end']])
                recognizer.decode_stream(stream)
                native=stream.result
                values,starts,durations=list(native.tokens),list(native.timestamps),list(native.durations)
                if not starts or len(values)!=len(starts) or len(values)!=len(durations):
                    raise ValueError('Native DTW timing is missing')
                chunks.append({'start':offset,'end':end,'text':native.text,'tokens':values,
                               'timestamps':starts,'durations':durations})
                for word in word_units(values,starts,durations,offset):
                    words.append({'word':word['text'],'start':word['start'],'end':word['end'],
                                  'chunk_index':ci,'native_token_indices':word['token_indices']})
            result={'source_id':sid,'source':source['source_file'],'source_sha256':source['sha256'],
                'source_metadata':source,'duration_seconds':len(audio)/16000,'status':'transcribed',
                'quality':'automatic_draft_requires_listening',
                'word_timing_method':'Whisper cross-attention DTW native token alignment, 20ms frames; lexical word bounds estimated',
                'parameters':{'engine':'sherpa-onnx','model':'whisper-small-int8-with-exposed-cross-attention',
                    'language':'fr','model_encoder_sha256':enc_sha,'model_decoder_sha256':dec_sha,
                    'patched_encoder_sha256':ehash,'patched_decoder_sha256':dhash,'alignment_heads':HEADS,
                    'windows':'individual VAD utterances, max24s,600ms silence,150ms padding'},
                'text':' '.join(c['text'] for c in chunks),'words':words,'chunks':chunks,
                'processing_windows':[{'start':r['start']/16000,'end':r['end']/16000} for r in windows],
                'created_at':datetime.now(timezone.utc).isoformat(),'listening_performed':False,
                'wall_seconds':time.monotonic()-started}
            write_json(destination,result)
            print(json.dumps({'source_id':sid,'status':'transcribed_aligned','words':len(words),
                              'wall_seconds':result['wall_seconds']},ensure_ascii=False),flush=True)
    finally:
        os.close(fde)
        os.close(fdd)


if __name__=='__main__':main()
