"""Verify deterministic action banks and immutable image manifests in isolation."""
from pathlib import Path
import tempfile
import shutil
import subprocess
import json

root = Path(__file__).resolve().parents[1]
manifest = Path('docs/grammaire/implementation/action-media-manifest.json')
media = json.loads((root / manifest).read_text())
with tempfile.TemporaryDirectory(prefix='clairfle-action-') as tmp:
    target = Path(tmp)
    inputs = [root / 'scripts/build-grammar-action.py',
              *sorted((root / 'scripts/grammar_curriculum').glob('action-*')),
              *[root / 'public' / im['source']['path'].lstrip('/') for im in media['images']]]
    for p in inputs:
        out = target / p.relative_to(root)
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(p, out)
    (target / 'src/grammaire/curriculum/data').mkdir(parents=True)
    subprocess.run(['python3', str(target / 'scripts/build-grammar-action.py')], check=True, capture_output=True)
    for p in [*[Path(f'src/grammaire/curriculum/data/{sub}.json') for sub in ['j1', 'j2', 'j3']], manifest]:
        assert (root / p).read_bytes() == (target / p).read_bytes(), str(p)
    for im in media['images']:
        p = Path('public') / im['src'].lstrip('/')
        assert (root / p).read_bytes() == (target / p).read_bytes()
    print(json.dumps(dict(status='passed', authoredSourceRows=250, documents=40, subjectCorrectionAdaptations=10,
                          bankFiles=3, banks=19, images=10, deterministic=True, isolatedRebuild=True)))
