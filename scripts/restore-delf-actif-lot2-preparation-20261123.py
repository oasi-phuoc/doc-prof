"""Restore generation working files from the committed, portable preparation packet."""
import argparse,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--prefix',default='/tmp/tcf-delf-lot2-100-20261123');args=p.parse_args();packet=json.loads((ROOT/'docs/tcf/delf-actif-20261113/lot2-100-20261123-preparation.json').read_text())
def expand(v):
 if isinstance(v,list):return [expand(x) for x in v]
 if isinstance(v,dict):return {k:expand(x) for k,x in v.items()}
 if isinstance(v,str) and v.startswith('/lib/'):return str(ROOT/'public'/v.lstrip('/'))
 if isinstance(v,str) and v.startswith(('docs/','src/tcf/')):return str(ROOT/v)
 return v
def write(s,x):Path(args.prefix+'-'+s+'.json').write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
for key,suffix in [('generation','generation'),('clocks','clocks'),('generation_queue','queue')]:write(suffix,expand(packet[key]))
write('sources',[dict(row,bank=str(ROOT/row['bank'])) for row in packet['selected_questions']])
# Choice image paths remain public URLs; only generator references need filesystem paths.
for key,suffix in [('planned_choices','targets'),('retakes','retakes'),('seen_source_sha256','seen-images'),('trio_review_notes','trio-notes'),('label_overrides','labels-overrides'),('reuse_label_overrides','reuse-labels-overrides'),('generation_limit','generation-limit')]:write(suffix,packet[key])
Path(args.prefix+'-baseline.txt').write_text(packet['source_review_baseline_commit']+'\n');print(f"Restored {packet['summary']['published_images']} reviewed assets, {packet['summary']['prepared_trios']} prepared trios and {len(packet['remaining_asset_ids'])} assets to finalize under {args.prefix}. No repository file or question was changed.")
