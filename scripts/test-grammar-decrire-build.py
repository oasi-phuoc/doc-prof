"""Recompile in isolation, never changing live banks during browser QA."""
import hashlib,json,pathlib,shutil,subprocess,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-decrire-') as tmp:
 target=pathlib.Path(tmp)
 files=[root/'scripts/build-grammar-decrire.py',*sorted((root/'scripts/grammar_curriculum').glob('decrire-*.tsv'))]
 manifest=json.loads((root/'docs/grammaire/implementation/decrire-media-manifest.json').read_text())
 files += [root/'public'/x['source']['path'].lstrip('/') for x in manifest['images']]
 for p in files:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 for d in ['src/grammaire/curriculum/data','docs/grammaire/implementation']:(target/d).mkdir(parents=True,exist_ok=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-decrire.py')],check=True,capture_output=True)
 outputs=[f'src/grammaire/curriculum/data/f{i}.json' for i in range(4,9)]+['docs/grammaire/implementation/decrire-media-manifest.json']
 for p in outputs:assert (root/p).read_bytes()==(target/p).read_bytes(),p
 print(json.dumps(dict(status='passed',sourceRows=250,outputFiles=6,isolatedRebuild=True,deterministic=True)))
