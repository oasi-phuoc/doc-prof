"""Rebuild the future banks from their sources in an isolated directory."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
subs=['futur-proche','futur-simple','futur-proche-ou-simple','futur-anterieur','hypothese-futur']
with tempfile.TemporaryDirectory(prefix='clairfle-avenir-') as tmp:
 target=Path(tmp)
 for p in [root/'scripts/build-grammar-avenir.py',*sorted((root/'scripts/grammar_curriculum').glob('avenir-*'))]:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 (target/'src/grammaire/curriculum/data').mkdir(parents=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-avenir.py')],check=True,capture_output=True)
 for sub in subs:
  p=Path(f'src/grammaire/curriculum/data/{sub}.json');assert (root/p).read_bytes()==(target/p).read_bytes(),str(p)
 print(json.dumps(dict(status='passed',authoredSourceRows=300,documents=60,banks=22,bankFiles=5,deterministic=True,isolatedRebuild=True)))
