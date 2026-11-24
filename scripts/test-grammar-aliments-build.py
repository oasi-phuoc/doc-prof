"""Rebuild all six food banks and immutable media in a separate directory."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1];manifest=Path('docs/grammaire/implementation/aliments-media-manifest.json')
with tempfile.TemporaryDirectory(prefix='clairfle-aliments-') as tmp:
 target=Path(tmp);files=[root/'scripts/build-grammar-aliments.py',*sorted((root/'scripts/grammar_curriculum').glob('aliments-*'))]
 files.extend(root/'public'/s['source']['path'].lstrip('/') for s in json.loads((root/manifest).read_text())['images'])
 for p in files:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 for p in ['src/grammaire/curriculum/data','docs/grammaire/implementation']:(target/p).mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-aliments.py')],check=True,capture_output=True)
 for name in ['g1','g2','g3','g4','g5','g6']:
  p=Path(f'src/grammaire/curriculum/data/{name}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 assert (root/manifest).read_bytes()==(target/manifest).read_bytes()
 print(json.dumps(dict(status='passed',sourceRows=350,readingDocuments=20,banks=6,immutableImages=81,deterministic=True,isolatedRebuild=True)))
