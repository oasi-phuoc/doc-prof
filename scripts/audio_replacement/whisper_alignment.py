"""Expose existing Whisper cross-attention and obtain native 20ms DTW timings.

Weights stay unchanged. Patched model graphs live in Linux memfd, not on disk.
The ten alignment heads are the upstream OpenAI Whisper small head selection.
"""
import argparse
import base64
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parent))
from transcribe_words import decode_audio_local,sha256,write_json

HEADS=[(5,3),(5,9),(8,0),(8,4),(8,7),(8,8),(9,0),(9,7),(9,9),(10,5)]

def model_memfd(path,decoder=False):
    import onnx
    from onnx import helper,numpy_helper,TensorProto
    import numpy as np
    model=onnx.load(path)
    if decoder:
        nodes=[node for node in model.graph.node if node.op_type=='Softmax']
        outputs=[]
        for i,(layer,head) in enumerate(HEADS):
            indices='dtw_head_index_'+str(i);output='dtw_alignment_head_'+str(i)
            model.graph.initializer.append(numpy_helper.from_array(np.array([head],dtype=np.int64),name=indices))
            model.graph.node.append(helper.make_node('Gather',[nodes[2*layer+1].input[0],indices],[output],axis=1,name=output))
            outputs.append(output)
        model.graph.node.append(helper.make_node('Concat',outputs,['cross_attention_weights'],axis=1,name='dtw_selected_heads'))
        model.graph.output.append(helper.make_tensor_value_info('cross_attention_weights',TensorProto.FLOAT,['n_audio',len(HEADS),'n_tokens','T']))
    else:
        meta=model.metadata_props.add();meta.key='n_alignment_heads';meta.value=str(len(HEADS))
    data=model.SerializeToString();digest=hashlib.sha256(data).hexdigest()
    fd=os.memfd_create('whisper-dtw-decoder' if decoder else 'whisper-dtw-encoder')
    view=memoryview(data)
    while view:
        count=os.write(fd,view);view=view[count:]
    return fd,f'/proc/self/fd/{fd}',digest

def word_units(tokens,starts,durations,offset):
    """Whisper BPE byte fragments become words only after UTF-8 reconstruction."""
    units=[];current=None
    for i,(token,start,duration) in enumerate(zip(tokens,starts,durations)):
        if not token:continue
        for piece in __import__('re').findall(r'\s+|[^\s]+',token):
            if piece.isspace():
                current=None
                continue
            if current is None:
                current={'text':'','start':offset+float(start),'end':offset+float(start+duration),'token_indices':[]}
                units.append(current)
            current['text']+=piece;current['end']=max(current['end'],offset+float(start+duration));current['token_indices'].append(i)
    return units

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--start',type=float,default=0);parser.add_argument('--end',type=float);parser.add_argument('--model-dir',type=Path,default=Path('/workspace/work/tcf-audio-replacement/sherpa-models/sherpa-onnx-whisper-small'))
    args=parser.parse_args();import sherpa_onnx
    encoder=next(args.model_dir.glob('*encoder.int8.onnx'));decoder=next(args.model_dir.glob('*decoder.int8.onnx'));vocab=next(args.model_dir.glob('*tokens.txt'))
    fde,epath,ehash=model_memfd(encoder);fdd,dpath,dhash=model_memfd(decoder,decoder=True)
    recognizer=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=epath,decoder=dpath,tokens=str(vocab),language='fr',task='transcribe',num_threads=1,enable_token_timestamps=True,enable_segment_timestamps=False)
    audio=decode_audio_local(args.source);end=min(len(audio)/16000,args.end) if args.end is not None else len(audio)/16000
    if end-args.start>=29:raise ValueError('Use a local excerpt shorter than29seconds.')
    stream=recognizer.create_stream();stream.accept_waveform(16000,audio[int(args.start*16000):int(end*16000)]);recognizer.decode_stream(stream);result=stream.result
    output={'source':str(args.source),'source_sha256':sha256(args.source),'start':args.start,'end':end,'text':result.text,
            'method':'Whisper small INT8 native cross-attention DTW, 20ms frames, official selected heads',
            'model_encoder_sha256':sha256(encoder),'model_decoder_sha256':sha256(decoder),'patched_encoder_sha256':ehash,'patched_decoder_sha256':dhash,
            'alignment_heads':HEADS,'listening_performed':False,'created_at':dt.datetime.now(dt.timezone.utc).isoformat()}
    output['attributes']=[a for a in dir(result) if not a.startswith('_')]
    for key in ['tokens','timestamps','durations','ys_log_probs']:
        try:output[key]=list(getattr(result,key))
        except Exception as error:output[key+'_error']=str(error)
    try:output['native_json']=result.json
    except Exception as error:output['native_json_error']=str(error)
    if output.get('tokens') and output.get('timestamps'):
        output['words']=word_units(output['tokens'],output['timestamps'],output['durations'],args.start)
    write_json(args.output,output);print(json.dumps(output,ensure_ascii=False))
    os.close(fde);os.close(fdd)

if __name__=='__main__':main()
