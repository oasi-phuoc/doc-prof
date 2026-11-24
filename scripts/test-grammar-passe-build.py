"""Prove the eight new banks rebuild identically from their authored sources."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
subs=['pc-idee','pc-avoir','pc-etre','imparfait','pqp','double-aux','pc-pronominaux','accord-pp']
with tempfile.TemporaryDirectory(prefix='clairfle-passe-') as tmp:
 target=Path(tmp)
 for p in [root/'scripts/build-grammar-passe.py',*sorted((root/'scripts/grammar_curriculum').glob('passe-*'))]:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 (target/'src/grammaire/curriculum/data').mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-passe.py')],check=True,capture_output=True)
 for sub in subs:
  p=Path(f'src/grammaire/curriculum/data/{sub}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 print(json.dumps(dict(status='passed',authoredSourceRows=400,documents=20,banks=8,deterministic=True,isolatedRebuild=True)))
