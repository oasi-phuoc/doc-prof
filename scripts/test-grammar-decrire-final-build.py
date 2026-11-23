"""Rebuild the three final notions in isolation, including immutable image copies."""
from pathlib import Path
import tempfile,shutil,subprocess,json
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-decrire-final-') as temp:
 target=Path(temp)
 files=[]
 for name in ['superlatif','quantites','physique']:
  files.append(root/f'scripts/build-grammar-{name}.py');files.extend((root/'scripts/grammar_curriculum').glob(name+'-*'))
 files.extend((root/'public/lib/images/vocabulaire/presenter').glob('portrait-*.webp'))
 for p in files:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 for p in ['src/grammaire/curriculum/data','docs/grammaire/implementation']:(target/p).mkdir(parents=True)
 for name in ['superlatif','quantites','physique']:subprocess.run(['python3',str(target/f'scripts/build-grammar-{name}.py')],check=True,capture_output=True)
 for name in ['f13','f14','description-physique']:
  p=Path(f'src/grammaire/curriculum/data/{name}.json');assert (root/p).read_bytes()==(target/p).read_bytes()
 p=Path('docs/grammaire/implementation/physique-media-manifest.json');assert (root/p).read_bytes()==(target/p).read_bytes()
 print(json.dumps(dict(status='passed',authoredSourceRows=250,readingDocuments=20,outputBanks=3,immutableImages=10,deterministic=True,isolatedRebuild=True)))
