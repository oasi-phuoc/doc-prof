"""Render TCF clocks with one painted dial and one calculated hand model.

The user explicitly approved procedural hands on 2026-11-06. Historical URLs
remain stable; the alarm retains its blue case. Elapsed-minute timers are a
separate, explicitly requested display, with a red sector and no hour hand.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
AUDIT = PUBLIC / 'lib/images/tcf/qcm-audit'
ASSETS = PUBLIC / 'lib/images/tcf/clock-assets'
REPORT = ROOT / 'docs/tcf/horloges-aiguilles-uniformes-20261106.json'
MANIFEST = ROOT / 'docs/tcf/images-generees.json'
BASE = ASSETS / 'cadran-vierge-commun-20261106.webp'
STYLE = '/lib/images/tcf/qcm-audit/co834-boissons-dessinees.webp'
COMMIT = '48a753d8d6bd095e41968b39da88dbcb331fee11'
MODEL = dict(hour_length=245, minute_length=365, hour_width=26,
             minute_width=17, tail=13, pivot_radius=19, color='#20201e')
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SIZE = (1280, 960)
CENTER = (640, 480)
SCALE = 2


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def angles(hour, minute):
    if not 0 <= hour < 24 or not 0 <= minute < 60:
        raise ValueError((hour, minute))
    return (hour % 12) * 30 + minute * 0.5, minute * 6


def point(angle, radius):
    radians = math.radians(angle)
    return (CENTER[0] + math.sin(radians) * radius,
            CENTER[1] - math.cos(radians) * radius)


def capsule(draw, angle, length, width):
    start, end = point(angle, -MODEL['tail']), point(angle, length)
    start, end = [tuple(v * SCALE for v in p) for p in (start, end)]
    draw.line([start, end], fill=MODEL['color'], width=width * SCALE)
    radius = width * SCALE / 2
    for x, y in (start, end):
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=MODEL['color'])


def render(hour=0, minute=0, elapsed=None, unit='min'):
    image = Image.open(BASE).convert('RGB').resize(
        (SIZE[0] * SCALE, SIZE[1] * SCALE), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(image)
    cx, cy = (v * SCALE for v in CENTER)
    if elapsed is not None:
        if not 0 < elapsed <= 60:
            raise ValueError(elapsed)
        wash = Image.new('RGBA', image.size)
        ImageDraw.Draw(wash).pieslice(
            (cx-365*SCALE, cy-365*SCALE, cx+365*SCALE, cy+365*SCALE),
            -90, -90 + elapsed * 6, fill=(215, 49, 44, 95))
        image = Image.alpha_composite(image.convert('RGBA'), wash).convert('RGB')
        draw = ImageDraw.Draw(image)
    for tick in range(60):
        outer, inner = point(tick*6, 359), point(tick*6, 335 if tick % 5 == 0 else 349)
        draw.line([tuple(v*SCALE for v in p) for p in (inner, outer)],
                  fill='#302e29', width=(4 if tick % 5 == 0 else 2)*SCALE)
    font = ImageFont.truetype(FONT, (62 if elapsed else 72)*SCALE)
    for number in range(1, 13):
        x, y = point(number*30, 286)
        text = str(number*5 if elapsed else number)
        draw.text((x*SCALE, y*SCALE), text, font=font, fill='#24231f', anchor='mm')
    if elapsed is None:
        hour_angle, minute_angle = angles(hour, minute)
        capsule(draw, hour_angle, MODEL['hour_length'], MODEL['hour_width'])
    else:
        minute_angle = elapsed * 6
        draw.text((cx, (CENTER[1]-145)*SCALE), unit,
                  font=ImageFont.truetype(FONT, 36*SCALE), fill='#5c3b35', anchor='mm')
    capsule(draw, minute_angle, MODEL['minute_length'], MODEL['minute_width'])
    radius = MODEL['pivot_radius'] * SCALE
    draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius),
                 fill='#262623', outline='#10100f', width=2*SCALE)
    return image.resize(SIZE, Image.Resampling.LANCZOS)


def inventory():
    import re
    targets = []
    for path in sorted(AUDIT.glob('*horloge*.webp')):
        match = re.fullmatch(r'(?:co306-horloge-|co834-horloge-|vocab-horloge-)(\d{2})(\d{2})(?:-dessinee)?\.webp', path.name)
        if match:
            targets.append(dict(path='/'+str(path.relative_to(PUBLIC)),
                                hour=int(match[1]), minute=int(match[2])))
    missing = '/lib/images/tcf/qcm-audit/vocab-horloge-1035.webp'
    if not any(r['path'] == missing for r in targets):
        targets.append(dict(path=missing, hour=10, minute=35))
    for name, hour in [('huit-heures-numerique', 8), ('onze-heures-numerique', 11),
                       ('minuit-numerique', 0), ('réveil-numérique', 7)]:
        targets.append(dict(path=f'/lib/images/vocabulaire/heure-horloge/{name}.webp', hour=hour, minute=0))
    targets.append(dict(path='/lib/images/tcf/qcm-audit/vocab-reveil.webp', hour=7, minute=0, alarm=True))
    targets.extend(dict(path=f'/lib/images/tcf/qcm-audit/duree-{m}-minutes.webp', elapsed_minutes=m) for m in (5, 10, 15, 20, 30, 45, 60))
    targets.extend(dict(path=f'/lib/images/tcf/qcm-audit/duree-{m}-secondes.webp', elapsed_seconds=m) for m in (3, 30))
    assert len(targets) == len({r['path'] for r in targets})
    return targets


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-source', type=Path)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--approve-reviewed', action='store_true')
    args = parser.parse_args()
    if args.approve_reviewed:
        report = json.loads(REPORT.read_text())
        by_path = {r['path']: r for r in report['images']}
        for path, row in by_path.items():
            assert sha(PUBLIC / path.lstrip('/')) == row['sha256'], path
        manifest = json.loads(MANIFEST.read_text())
        for entry in manifest['images']:
            if entry['path'] in by_path:
                entry['status'] = 'visually_reviewed'
                entry['style_review']['status'] = 'aligned'
        report['visual_review'] = dict(status='completed', method='Inspection des planches, des trois durées rouges et du réveil ; angles vérifiés par calcul.')
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
        REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
        print(f"{len(by_path)} cadrans approuvés après revue visuelle.")
        return
    if args.check:
        report = json.loads(REPORT.read_text())
        assert report['visual_review']['status'] == 'completed'
        assert sha(BASE) == report['base_sha256']
        assert report['hand_model'] == MODEL
        for row in report['images']:
            assert sha(PUBLIC / row['path'].lstrip('/')) == row['sha256'], row['path']
            if 'elapsed_minutes' not in row and 'elapsed_seconds' not in row:
                assert list(angles(row['hour'], row['minute'])) == row['angles_degrees']
        print(f"{len(report['images'])} cadrans : modèle commun, angles et empreintes vérifiés.")
        return
    ASSETS.mkdir(parents=True, exist_ok=True)
    if args.base_source:
        Image.open(args.base_source).convert('RGB').resize(SIZE, Image.Resampling.LANCZOS).save(BASE, lossless=True, method=6)
    assert BASE.exists(), 'Provide --base-source for the first run'
    previous = json.loads(REPORT.read_text()) if REPORT.exists() else {}
    prior = {r['path']: r for r in previous.get('images', [])}
    manifest = json.loads(MANIFEST.read_text())
    png_dir = ROOT.parent / 'generated_images/tcf-uniform-clocks'
    png_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for target in inventory():
        path = PUBLIC / target['path'].lstrip('/')
        old = prior.get(target['path'])
        if (old and path.exists() and sha(path) == old['sha256']
                and previous.get('hand_model') == MODEL
                and previous.get('base_sha256') == sha(BASE)):
            results.append(old)
            continue
        before_sha = prior.get(target['path'], {}).get('before_sha256') or (sha(path) if path.exists() else None)
        dimensions = Image.open(path).size if path.exists() else SIZE
        if target.get('alarm'):
            alarm_base = ASSETS / 'reveil-bleu-avant-harmonisation.webp'
            if not alarm_base.exists():
                alarm_base.write_bytes(path.read_bytes())
            image = Image.open(alarm_base).convert('RGB')
            # Preserve the alarm case and bells, replacing only its circular dial.
            face = render(target['hour'], target['minute']).crop((260, 100, 1020, 860)).resize((554, 554), Image.Resampling.LANCZOS)
            mask = Image.new('L', (554, 554))
            ImageDraw.Draw(mask).ellipse((0, 0, 553, 553), fill=255)
            image.paste(face, (449, 343), mask)
        else:
            image = render(target.get('hour', 0), target.get('minute', 0),
                           target.get('elapsed_minutes', target.get('elapsed_seconds')),
                           'sec' if 'elapsed_seconds' in target else 'min')
            if image.size != dimensions:
                fitted = ImageOps.contain(image, dimensions, Image.Resampling.LANCZOS)
                image = Image.new('RGB', dimensions, '#fff5df')
                image.paste(fitted, ((dimensions[0]-fitted.width)//2, (dimensions[1]-fitted.height)//2))
        png = png_dir / (path.stem+'.png')
        image.save(png)
        image.save(path, lossless=True, method=6)
        row = dict(target, width=image.width, height=image.height, before_sha256=before_sha, sha256=sha(path))
        if 'elapsed_minutes' not in target and 'elapsed_seconds' not in target:
            row['angles_degrees'] = list(angles(target['hour'], target['minute']))
        results.append(row)
        entries = [r for r in manifest['images'] if r['path'] == target['path']]
        if not entries and target['path'].startswith('/lib/images/tcf/'):
            label = (f"{target['elapsed_minutes']} minutes" if 'elapsed_minutes' in target else
                     f"{target['elapsed_seconds']} secondes" if 'elapsed_seconds' in target else
                     f"{target['hour']:02d} h {target['minute']:02d}")
            entry = dict(id=path.stem, label=label, path=target['path'], domain='ce-co', batch='reprise-20261106-objets-inclus')
            if 'elapsed_minutes' not in target and 'elapsed_seconds' not in target:
                entry['clock_time'] = f"{target['hour']:02d}:{target['minute']:02d}"
            manifest['images'].append(entry)
            entries = [entry]
        for entry in entries:
            entry.update(sha256=row['sha256'], bytes=path.stat().st_size, width=image.width, height=image.height,
                         aspect_ratio='4:3' if image.width*3 == image.height*4 else '1:1',
                         status='prepared_pending_visual_review', clock_face='analog', clock_hands_model='tcf-common-20261106',
                         generation_method='painted-base-with-calculated-hands-user-approved',
                         source_png=str(png), source_sha256=sha(png),
                         prompt='Cadran peint commun, chiffres et aiguilles calculés ; méthode approuvée par l’utilisateur le 6 novembre 2026.',
                         style_reference_commit=COMMIT, style_references=[STYLE], reference_images=[STYLE],
                         style_review=dict(status='pending_visual_review', reference_commit=COMMIT, references=[STYLE]),
                         review_note='Même modèle d’aiguilles et angles calculés ; approbation après inspection des planches.',
                         clock_render=row)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    report = dict(date='2026-11-06', authorization='Modèle peint commun et aiguilles calculées explicitement approuvés par l’utilisateur ; durées rouges 20/30/45 également demandées.',
                  base='/'+str(BASE.relative_to(PUBLIC)), base_sha256=sha(BASE), hand_model=MODEL,
                  formulas=dict(hour='30*(hour%12)+0.5*minute', minute='6*minute'),
                  scope='Cadrans TCF, quatre alias historiques du vocabulaire et réveil bleu ; les documents horaires restent distincts.', images=results)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(f"{len(results)} cadrans rendus ; modèle d’aiguilles unique.")


if __name__ == '__main__':
    main()
