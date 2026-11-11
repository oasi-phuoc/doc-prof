"""Generate the two French arithmetic operators with espeakng-loader==0.2.4 and ffmpeg.

Development utility only; the site serves the resulting MP3 files directly.
The spelling 'plusse' explicitly pronounces the mathematical final /s/.
"""
import ctypes
from pathlib import Path
import subprocess
import tempfile
import wave

import espeakng_loader

lib = espeakng_loader.load_library()
lib.espeak_Initialize.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_char_p, ctypes.c_int]
rate = lib.espeak_Initialize(2, 0, espeakng_loader.get_data_path().encode(), 0)
assert rate > 0
lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
assert lib.espeak_SetVoiceByName(b"fr") == 0
chunks = []
callback_type = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)


@callback_type
def receive(samples, count, _events):
    if count and samples:
        chunks.append(ctypes.string_at(samples, count * 2))
    return 0


lib.espeak_SetSynthCallback(receive)
lib.espeak_SetParameter(1, 150, 0)
lib.espeak_Synth.argtypes = [ctypes.c_void_p, ctypes.c_size_t, ctypes.c_uint, ctypes.c_int, ctypes.c_uint, ctypes.c_uint, ctypes.c_void_p, ctypes.c_void_p]
destination = Path(__file__).resolve().parents[1] / "public/lib/audio/nombre"
try:
    with tempfile.TemporaryDirectory(prefix="clairfle-csc-operators-") as temporary:
        for filename, spoken in [("plus", "plusse"), ("moins", "moins")]:
            chunks.clear()
            text = ctypes.create_string_buffer(spoken.encode())
            assert lib.espeak_Synth(text, ctypes.sizeof(text), 0, 1, 0, 1, None, None) == 0
            lib.espeak_Synchronize()
            wav = Path(temporary) / f"{filename}.wav"
            with wave.open(str(wav), "wb") as audio:
                audio.setnchannels(1)
                audio.setsampwidth(2)
                audio.setframerate(rate)
                audio.writeframes(b"".join(chunks))
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(wav), "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ac", "1", "-ar", "22050", "-codec:a", "libmp3lame", "-q:a", "3", str(destination / f"{filename}.mp3")], check=True)
finally:
    lib.espeak_Terminate()
