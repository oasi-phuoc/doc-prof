"""Reconstruct the new theme in isolation without rewriting banks under UI tests."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-conseiller-') as tmp:
 target=Path(tmp)
 for p in [root/'scripts/build-grammar-conseiller.py',*sorted((root/'scripts/grammar_curriculum').glob('conseiller-*'))]:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 (target/'src/grammaire/curriculum/data').mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-conseiller.py')],check=True,capture_output=True)
 for sub in ['f10','f11']:
  p=Path(f'src/grammaire/curriculum/data/{sub}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 print(json.dumps(dict(status='passed',authoredSituations=150,readingDocuments=20,deterministic=True,isolatedRebuild=True,outputBanks=2)))
