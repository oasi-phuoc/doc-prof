"""Build vendored interface fonts from pinned Google Fonts files.

Requires fonttools 4.61.1 and brotli 1.2.0 only when regenerating assets.
The source directory contains clairfle-{dmsans,fraunces,inter}.ttf and
clairfle-{dmsans,fraunces,inter}-OFL.txt; download instructions accompany assets.
"""
import hashlib
import io
import json
import shutil
import sys
from pathlib import Path

import brotli
import fontTools
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

source = Path(sys.argv[1])
if fontTools.__version__ != "4.61.1" or brotli.__version__ != "1.2.0":
    raise ValueError("Use fonttools 4.61.1 and brotli 1.2.0 for reproducible assets")
destination = Path(__file__).resolve().parents[1] / "public/fonts/interface"
destination.mkdir(parents=True, exist_ok=True)
latin = list(range(0x250)) + list(range(0x1E00, 0x1F00)) + list(range(0x2000, 0x2070)) + list(range(0x20A0, 0x20D0)) + list(range(0x2100, 0x2300)) + list(range(0x25A0, 0x27C0))
numerals = [0x20, 0xA0, 0xD7, 0xF7, 0x202F, 0x2212] + list(range(0x30, 0x3A))
configurations = [
    ("dmsans", "dmsans", {"opsz": 9, "wght": (400, 700)}, latin, "8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d"),
    ("fraunces", "fraunces", {"SOFT": 0, "WONK": 1, "wght": (500, 600)}, latin, "177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb"),
    ("inter-numerals", "inter", {"opsz": 14, "wght": (400, 700)}, numerals, "29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031"),
]
manifest = {"source": "https://github.com/google/fonts/tree/5bb28733cec313b63fbd415b574b5ae35c8aa8b8", "fontTools": "4.61.1", "brotli": "1.2.0", "fonts": []}
for family, original_family, axes, unicodes, expected in configurations:
    original = source / f"clairfle-{original_family}.ttf"
    digest = hashlib.sha256(original.read_bytes()).hexdigest()
    if expected and digest != expected:
        raise ValueError(f"Unexpected pinned source for {family}")
    font = instantiateVariableFont(TTFont(original, recalcTimestamp=False), axes, inplace=True)
    # Round-trip materializes lazy variation tables before subsetting.
    intermediate = io.BytesIO()
    font.save(intermediate)
    intermediate.seek(0)
    font = TTFont(intermediate, recalcTimestamp=False)
    options = subset.Options()
    options.layout_features = ["*"]
    job = subset.Subsetter(options=options)
    job.populate(unicodes=unicodes)
    job.subset(font)
    font.flavor = "woff2"
    filename = f"{family}-{'v1' if family == 'inter-numerals' else 'latin-v1'}.woff2"
    output = destination / filename
    font.save(output)
    output.chmod(0o644)
    shutil.copyfile(source / f"clairfle-{original_family}-OFL.txt", destination / f"{family}-OFL.txt")
    manifest["fonts"].append({"family": family, "file": filename, "bytes": output.stat().st_size, "sha256": hashlib.sha256(output.read_bytes()).hexdigest(), "originalSha256": digest, "axes": axes})
if sum(font["bytes"] for font in manifest["fonts"]) > 150 * 1024:
    raise ValueError("Font budget exceeds 150 KiB")
(destination / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
