from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
import random

destination = Path(__file__).resolve().parents[1] / 'src/math/media/solid-views'
models = [
    [[1, 0, 2], [1, 3, 1], [0, 1, 0]],
    [[0, 2, 0], [1, 1, 0], [2, 1, 1]],
    [[1, 1, 0], [0, 2, 1], [0, 3, 1]],
    [[2, 2, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 0, 1], [1, 0, 2], [2, 1, 1]],
    [[1, 3, 0], [1, 1, 1], [0, 0, 2]],
]

def projections(h):
    return [
        [[int(max(row[x] for row in h) >= z) for x in range(3)] for z in (3, 2, 1)],
        [[int(max(h[y]) >= z) for y in (2, 1, 0)] for z in (3, 2, 1)],
        [[int(v > 0) for v in row] for row in h],
    ]

rng = random.Random(67)
while len(models) < 18:
    heights = [[rng.choice((0, 0, 1, 1, 2, 3)) for _ in range(3)] for _ in range(3)]
    occupied = sum(h > 0 for row in heights for h in row)
    if 3 <= occupied <= 7 and max(max(row) for row in heights) >= 2 and len(set(str(p) for p in projections(heights))) == 3 and heights not in models:
        models.append(heights)

def uv(x, y, z):
    return (240 + (x-y)*52, 200+(x+y)*24-z*49)

for index, heights in enumerate(models, 1):
    if len(set(str(p) for p in projections(heights))) != 3:
        heights[0][0] = (heights[0][0] + 1) % 3
    assert len(set(str(p) for p in projections(heights))) == 3
    image = Image.new('RGB', (480, 385), 'white')
    draw = ImageDraw.Draw(image)
    ink = '#192437'
    for k in range(4):
        draw.line([uv(k,0,0),uv(k,3,0)], fill='#aab4c0', width=2)
        draw.line([uv(0,k,0),uv(3,k,0)], fill='#aab4c0', width=2)
    cubes = [(x,y,z) for y,row in enumerate(heights) for x,h in enumerate(row) for z in range(h)]
    for x,y,z in sorted(cubes, key=lambda xyz:sum(xyz)):
        if x == 2 or heights[y][x+1] <= z:
            draw.polygon([uv(x+1,y,z),uv(x+1,y+1,z),uv(x+1,y+1,z+1),uv(x+1,y,z+1)], fill='#a6b3c5', outline=ink, width=3)
        if y == 2 or heights[y+1][x] <= z:
            draw.polygon([uv(x,y+1,z),uv(x+1,y+1,z),uv(x+1,y+1,z+1),uv(x,y+1,z+1)], fill='#cbd5e1', outline=ink, width=3)
        if heights[y][x] == z+1:
            draw.polygon([uv(x,y,z+1),uv(x+1,y,z+1),uv(x+1,y+1,z+1),uv(x,y+1,z+1)], fill='#e8eef5', outline=ink, width=3)
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
    draw.text((152,340), 'Côté', fill=ink, font=font, anchor='mt')
    draw.text((328,340), 'Face', fill=ink, font=font, anchor='mt')
    image.save(destination / f'{index}.png', optimize=True)

(destination / 'models.json').write_text('[\n' + ',\n'.join('  '+json.dumps(model) for model in models) + '\n]\n')
