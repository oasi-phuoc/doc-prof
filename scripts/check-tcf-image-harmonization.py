"""Verify image migration and the exact, separately reviewed contextual changes."""
import argparse
from collections import Counter
from copy import deepcopy
import hashlib
import json
from pathlib import Path
import subprocess

from tcf_replace_vocabulary_images import BANKS, ROOT, checked_images, vocabulary_paths


def image_paths(value,node=()):
    if isinstance(value,str) and value.startswith('/lib/images/'):
        yield node,value
        return
    if isinstance(value,dict):
        for k,v in value.items():
            if k=='image' and isinstance(v,str) and v.startswith('/lib/images/'):yield node+(k,),v
            else:yield from image_paths(v,node+(k,))
    elif isinstance(value,list):
        for i,v in enumerate(value):yield from image_paths(v,node+(i,))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline',default='HEAD')
    parser.add_argument('--write-report',type=Path)
    args=parser.parse_args()
    baseline=subprocess.check_output(['git','rev-parse',args.baseline],cwd=ROOT,text=True).strip()
    reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
    journal_path=ROOT/'docs/tcf/operations-contexte-20261106.json'
    operations=json.loads(journal_path.read_text())['operations'] if journal_path.exists() else []
    from tcf_main_integration import verify as verify_upstream, reverse as reverse_upstream, original_preserved
    upstream_operations=verify_upstream()
    if operations:
        from check_tcf_context_review import verify
        verify()
    changes,added,retired,remaining=[],[],[],[]
    original_counts=Counter()
    def compare(before,after,exercise,node=()):
        if before==after:return
        if isinstance(before,dict) and isinstance(after,dict):
            assert before.keys()==after.keys(),(exercise,node)
            for k in before:compare(before[k],after[k],exercise,node+(k,))
        elif isinstance(before,list) and isinstance(after,list):
            assert len(before)==len(after),(exercise,node)
            for i,(a,b) in enumerate(zip(before,after)):compare(a,b,exercise,node+(i,))
        else:
            assert isinstance(before,str) and before.startswith('/lib/images/') and isinstance(after,str) and after.startswith('/lib/images/'),(exercise,node)
            assert after in reviewed,(exercise,after)
            old_bytes=subprocess.check_output(['git','show',f'{baseline}:public{before}'],cwd=ROOT)
            assert original_preserved(before,old_bytes),before
    for bank in BANKS:
        relative=str(bank.relative_to(ROOT))
        before=json.loads(subprocess.check_output(['git','show',f'{baseline}:{relative}'],cwd=ROOT,text=True))
        after=json.loads(bank.read_text());projected=deepcopy(after)
        reverse_upstream(projected,[op for op in upstream_operations if op['bank']==relative])
        byid={e['id']:e for e in projected}
        for op in reversed(operations):
            if op['bank']!=relative:continue
            node=byid[op['exercise']]
            for key in op['node'][:-1]:node=node[key]
            last=op['node'][-1]
            if op['before'] is None:node.pop(last,None)
            else:node[last]=deepcopy(op['before'])
        assert [e['id'] for e in before]==[e['id'] for e in after],relative
        for old,current,image_only in zip(before,after,projected):
            # Reverse only the exact logged editorial operations, then require
            # the remainder to consist solely of reviewed image replacements.
            compare(old,image_only,old['id'])
            original_counts.update(p for _,p in vocabulary_paths(old))
            original=dict(image_paths(old));active=dict(image_paths(current))
            for node,path in original.items():
                target=active.get(node)
                item=dict(bank=relative,exercise=old['id'],node=list(node),before=path,after=target)
                if target==path:continue
                if target is None:
                    retired.append(item);continue
                assert target in reviewed,(old['id'],node,target)
                original_bytes=subprocess.check_output(['git','show',f'{baseline}:public{path}'],cwd=ROOT)
                assert original_preserved(path,original_bytes),path
                item.update(source_sha256=hashlib.sha256(original_bytes).hexdigest(),target_sha256=reviewed[target]['sha256'])
                changes.append(item)
            for node,path in active.items():
                if node not in original:
                    assert path in reviewed,(current['id'],node,path)
                    added.append(dict(bank=relative,exercise=current['id'],node=list(node),after=path,target_sha256=reviewed[path]['sha256']))
            remaining.extend(dict(bank=relative,exercise=current['id'],node=list(n),image=p) for n,p in vocabulary_paths(current))
            if current.get('type_exercice')=='images_a_reconnaitre':
                assert len(current['images'])==len({r['image'] for r in current['images']}),current['id']
    counts=Counter(r['image'] for r in remaining)
    targets={r['after'] for r in changes+added}
    generated={p for p,r in reviewed.items() if r.get('batch')=='reprise-20261106-objets-inclus'}
    report=dict(date='2026-11-06',baseline_commit=baseline,scope='CE/CO et banques OBJET, demande utilisateur du 6 novembre 2026',
                summary=dict(initial_vocabulary_usages=sum(original_counts.values()),
                             replaced_vocabulary_usages=sum(r['before'].startswith('/lib/images/vocabulaire/') for r in changes),
                             retired_vocabulary_usages=sum(r['before'].startswith('/lib/images/vocabulaire/') for r in retired),
                             total_changed_image_usages=len(changes),added_image_usages=len(added),retired_image_usages=len(retired),
                             object_bank_main_images=sum(r['node'][0]=='images' for r in changes),
                             new_images_generated_and_reviewed=len(generated),new_images_used=len(targets&generated),
                             existing_reviewed_images_reused=len(targets-generated),usages_using_new_images=sum(r['after'] in generated for r in changes+added),
                             remaining_vocabulary_usages=len(remaining),remaining_distinct_vocabulary_images=len(counts)),
                invariants='Hors intégration amont exacte et opérations contextuelles consignées, seuls les champs image changent. IDs, sources CE, transcriptions et liens audio conservés. Ajouts de variantes complets et synchronisés ; remplacements relus et vérifiés par empreinte en 4:3. Originaux conservés ; harmonisation autorisée des horloges vérifiée séparément.',
                contextual_operations='docs/tcf/operations-contexte-20261106.json',upstream_integration='docs/tcf/integration-main-20261107.json' if upstream_operations else None,replacements=changes,added_image_uses=added,retired_image_uses=retired,remaining_uses=remaining)
    assert report['summary']['initial_vocabulary_usages']==report['summary']['replaced_vocabulary_usages']+report['summary']['retired_vocabulary_usages']+len(remaining)
    if args.write_report:args.write_report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report['summary'],ensure_ascii=False))


if __name__=='__main__':main()
