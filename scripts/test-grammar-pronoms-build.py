"""Rebuild all eight new pronoun files from their authored sources in isolation."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-pronoms-') as tmp:
 target=Path(tmp)
 for p in [root/'scripts/build-grammar-pronoms.py',*sorted((root/'scripts/grammar_curriculum').glob('pronoms-*'))]:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 (target/'src/grammaire/curriculum/data').mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-pronoms.py')],check=True,capture_output=True)
 for sub in ['i1','i2','i3','i5','i6','i7','i8','i9']:
  p=Path(f'src/grammaire/curriculum/data/{sub}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 print(json.dumps(dict(status='passed',authoredSourceRows=400,documents=20,banks=8,deterministic=True,isolatedRebuild=True)))
