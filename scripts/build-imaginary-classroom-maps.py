"""Draw original towns with three aligned raster backgrounds for each plan."""

from pathlib import Path
from itertools import groupby
import json
import math
from random import Random

from PIL import Image, ImageDraw

ASSETS = Path(__file__).resolve().parents[1] / 'src/math/media/spatial/imaginary'
WIDTH, HEIGHT = 1080, 720
NAMES = (
    ('rive-aux-saules', 'Rive-aux-Saules'), ('mont-des-vents', 'Mont-des-Vents'),
    ('baie-des-lanternes', 'Baie-des-Lanternes'), ('val-des-hirondelles', 'Val-des-Hirondelles'),
    ('canal-des-lilas', 'Canal-des-Lilas'), ('pont-de-verre', 'Pont-de-Verre'),
    ('cretes-du-matin', 'Crêtes-du-Matin'), ('port-des-lunes', 'Port-des-Lunes'),
    ('les-trois-jardins', 'Les Trois Jardins'), ('iles-de-lumieres', 'Îles-de-Lumières'),
    ('moulin-des-nuages', 'Moulin-des-Nuages'), ('village-des-ardoises', 'Village-des-Ardoises'),
    ('anse-des-cormorans', 'Anse-aux-Cormorans'), ('prairie-des-etoiles', 'Prairie-des-Étoiles'),
    ('passerelles-du-roseau', 'Passerelles-du-Roseau'), ('quai-des-brumes', 'Quai-des-Brumes'),
    ('col-de-la-rose', 'Col-de-la-Rose'), ('port-des-galets', 'Port-des-Galets'),
    ('bois-des-douze-chants', 'Bois-des-Douze-Chants'), ('canal-des-petits-ponts', 'Canal-des-Petits-Ponts'),
    ('rivage-de-l-aube', 'Rivage-de-l’Aube'), ('mont-aux-cerfs', 'Mont-aux-Cerfs'),
    ('baie-du-phare-bleu', 'Baie-du-Phare-Bleu'), ('jardins-de-pluie', 'Jardins-de-Pluie'),
    ('ile-du-croissant', 'Île-du-Croissant'),
)
PUBLIC_PLACES = ('École des Tilleuls', 'Halle du marché', 'Terrain de sport', 'Bibliothèque des Jardins',
                 'Mairie', 'Gare des Voyageurs', 'Parc des Hirondelles', 'Place des Fontaines',
                 'Centre culturel', 'Jardin des Rosiers', 'Musée du Verre', 'Square des Fleurs',
                 'Théâtre du Soleil', 'Poste', 'Maison des associations', 'Salle de musique')


def dashed(draw, points, fill, width):
    phase = 0.0
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        length = math.hypot(x1 - x0, y1 - y0)
        cursor = 0.0
        while cursor < length:
            end = min(length, cursor + (10 - phase if phase < 10 else 17 - phase))
            if phase < 10:
                draw.line(tuple((x0 + (x1-x0)*step/length, y0 + (y1-y0)*step/length) for step in (cursor, end)), fill=fill, width=width)
            phase = (phase + end - cursor) % 17
            if phase > 16.99999:
                phase = 0.0
            if abs(phase - 10) < 0.00001:
                phase = 10.0
            cursor = end


def town_scene(index):
    rng = Random(607 + index * 503)
    style = index % 5
    cols = [-30, 135+rng.randrange(50), 327+rng.randrange(55), 514+rng.randrange(65), 722+rng.randrange(60), 900+rng.randrange(40), 1110]
    rows = [-25, 113+rng.randrange(44), 274+rng.randrange(43), 445+rng.randrange(50), 574+rng.randrange(42), 746]
    tilt = rng.uniform(-0.17, 0.17)
    warp = lambda x, y: (x + tilt * (y-HEIGHT/2), y + 17 * math.sin(x/205 + index))
    coast = 760 + index % 3 * 35
    lake = (coast, 400, 1190, 770)
    river_y = lambda x: 264 + (index%3)*42 + 68*math.sin(x/200+index)

    def dry(x, y, margin=0):
        if style in (0, 4):
            return abs(y - river_y(x)) > (19 if style == 0 else 29) + margin
        if style == 2:
            return ((x-(coast+1190)/2)/((1190-coast)/2+margin))**2 + ((y-585)/(185+margin))**2 > 1
        return True

    def coastal_segments(routes):
        return [list(segment) for route in routes
                for on_land, segment in groupby(route, lambda point: dry(*point, 5)) if on_land]

    roads = [[warp(x, y) for y in range(-60, HEIGHT+100, 25)] for x in cols[1:-1]]
    roads += [[warp(x, y) for x in range(-80, WIDTH+110, 25)] for y in rows[1:-1]]
    if style == 2:
        roads = coastal_segments(roads)
    interior = [(col, row) for row in range(5) for col in range(6)]
    # Keep the named places spread out across neighborhoods.
    rng.shuffle(interior)
    occupied = []
    for col, row in interior:
        x, y = (cols[col]+cols[col+1])/2, (rows[row]+rows[row+1])/2
        px, py = warp(x, y)
        if 72 < px < WIDTH - 72 and 62 < py < HEIGHT - 62 and dry(px, py, 30):
            occupied.append((col, row))
        if len(occupied) == 10:
            break
    assert len(occupied) == 10
    names = rng.sample(PUBLIC_PLACES, 10)
    named = dict(zip(occupied, names))
    lots = []
    for row in range(5):
        for col in range(6):
            for dy in (0.24, 0.49, 0.74):
                for dx in (0.23, 0.46, 0.72):
                    if (col, row) in named and abs(dx-0.46) < 0.05 and abs(dy-0.49) < 0.05:
                        continue
                    if rng.random() < (0.49 if style in (1, 3) else 0.35):
                        continue
                    x = cols[col]+(cols[col+1]-cols[col])*dx+rng.randrange(-9, 10)
                    y = rows[row]+(rows[row+1]-rows[row])*dy+rng.randrange(-8, 9)
                    if dry(*warp(x, y), 22):
                        lots.append((x, y, rng.randrange(12, 24), rng.randrange(9, 18), rng.randrange(4)))
    named_lots = [((cols[col]+cols[col+1])/2, (rows[row]+rows[row+1])/2) for col, row in occupied]
    river = [(x, river_y(x)) for x in range(-35, WIDTH+65, 13)]
    gardens = [(rng.randrange(30, WIDTH-30), rng.randrange(30, HEIGHT-30), rng.randrange(8, 22)) for _ in range(150)]
    paths = [[warp(x, y + 20*math.sin(x/115)) for x in range(60, WIDTH-30, 23)] for y in (98, 516)]
    if style == 2:
        paths = coastal_segments(paths)
    return warp, roads, paths, lots, named_lots, names, style, river, lake, gardens


def render(id_, title, index):
    warp, roads, paths, lots, named_lots, names, style, river, lake, gardens = town_scene(index)
    roof = ['#b77660', '#d4976b', '#947d72', '#aa8581']
    colors = ('#d7dcac', '#d7d5ac', '#d1d8a8', '#d9dfb7', '#d9dfb8')

    def block(draw, x, y, w, h, fill, outline):
        draw.polygon([warp(x+dx, y+dy) for dx, dy in ((-w,-h), (w,-h), (w,h), (-w,h))], fill=fill, outline=outline)

    for variant in ('photo', 'annotated', 'simplified'):
        simple = variant == 'simplified'
        road_map = variant == 'annotated'
        image = Image.new('L' if simple else 'RGB', (WIDTH, HEIGHT), 255 if simple else colors[style])
        draw = ImageDraw.Draw(image)
        if not simple:
            for x, y, size in gardens:
                shade = ('#aeba87', '#b4c493', '#c5c99a', '#bbc28e')[int(x+y)%4]
                draw.ellipse((x-size*1.5, y-size, x+size*1.5, y+size), fill=shade)
        water = 226 if simple else '#8fb9c9'
        if style in (0, 4):
            draw.line(river, fill=water, width=38 if style == 0 else 58)
        if style == 2:
            draw.ellipse(lake, fill=water)
        if style == 1 and not simple:
            for shift in range(0, 220, 16):
                draw.arc((-240+shift, -245+shift, 440+shift, 255+shift), 14, 133, fill='#c1bf91', width=2)
        for x, y, w, h, shade in lots:
            if not simple:
                block(draw, x+4, y+5, w, h, '#a8a28a', None)
            block(draw, x, y, w, h, 196 if simple else roof[shade], 166 if simple else '#8e7469')
        for i, (x, y) in enumerate(named_lots):
            block(draw, x, y, 26, 20, 182 if simple else '#a5b595', 139 if simple else '#889477')
            block(draw, x, y, 14+i%3*3, 9+i%4*2, 153 if simple else '#9d7767', 122 if simple else '#7d645a')
        for i, points in enumerate(roads):
            major = i in (1, 4, 6, 8)
            draw.line(points, fill=92 if simple else '#9f9d85', width=16 if major else 11)
            road = 250 if simple else '#fff0bf' if road_map and major else '#ede5d2'
            draw.line(points, fill=road, width=12 if major else 8)
        for points in paths:
            if simple or road_map:
                dashed(draw, points, 87 if simple else '#835726', 3)
            else:
                draw.line(points, fill='#b9a576', width=2)
        suffix = 'png' if simple else 'webp'
        image.save(ASSETS / f'{id_}-{variant}.{suffix}', optimize=simple, quality=86)
    places = [dict(name=name, x=round(px/WIDTH, 6), y=round(py/HEIGHT, 6))
              for name, (x, y) in zip(names, named_lots) for px, py in [warp(x, y)]]
    return dict(id=id_, label=title, places=places)


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    plans = [render(id_, title, index) for index, (id_, title) in enumerate(NAMES)]
    (ASSETS / 'plans.json').write_text(json.dumps(plans, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'{len(plans)} plans imaginaires générés.')


if __name__ == '__main__':
    main()
