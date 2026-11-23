"""Check deterministic compilation in isolation; never touch live banks during UI QA."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-demander-') as temp:
 target=Path(temp)
 for p in [root/'scripts/build-grammar-demander.py',*sorted((root/'scripts/grammar_curriculum').glob('demander-*.tsv'))]:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 (target/'src/grammaire/curriculum/data').mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-demander.py')],check=True,capture_output=True)
 for sub in ['f1','f2','f3']:
  p=Path(f'src/grammaire/curriculum/data/{sub}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 print(json.dumps(dict(status='passed',authoredSourceRows=170,deterministic=True,isolatedRebuild=True,outputFiles=3)))
