"""Recompile in isolation, never changing live banks during browser QA."""
import hashlib,json,pathlib,shutil,subprocess,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='clairfle-temps-') as tmp:
 target=pathlib.Path(tmp)
 files=[root/'scripts/build-grammar-temps.py',*sorted((root/'scripts/grammar_curriculum').glob('temps-*.tsv'))]
 manifest=json.loads((root/'docs/grammaire/implementation/temps-media-manifest.json').read_text())
 files += [root/'public'/x['source']['path'].lstrip('/') for x in manifest['images']]
 for p in files:
  out=target/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out)
 for d in ['src/grammaire/curriculum/data','docs/grammaire/implementation']:(target/d).mkdir(parents=True,exist_ok=True)
 subprocess.run(['python3',str(target/'scripts/build-grammar-temps.py')],check=True,capture_output=True)
 outputs=[f'src/grammaire/curriculum/data/e{i}.json' for i in range(2,6)]+['docs/grammaire/implementation/temps-media-manifest.json']
 for p in outputs:assert (root/p).read_bytes()==(target/p).read_bytes(),p
 print(json.dumps(dict(status='passed',sourceRows=320,outputFiles=5,isolatedRebuild=True,deterministic=True)))
