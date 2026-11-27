#!/usr/bin/env python3
"""Dessine les cartes schématiques du 101 sur le fond terrestre Natural Earth 50 m."""
from argparse import ArgumentParser
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUTPUT = Path(__file__).resolve().parents[1] / 'public/assets/logistique/100/101/commun'
FONTS = Path('/usr/share/fonts/truetype/dejavu')
LAND = '#eee8d7'
SEA = '#dcebf2'
COAST = '#afbfbc'
INK = '#243a45'
WATER = '#406175'
GRID = '#c6d5d3'


def font(size, style=''):
    suffix = '-' + style if style else ''
    return ImageFont.truetype(str(FONTS / f'DejaVuSans{suffix}.ttf'), size)


def land_polygons(path):
    data = json.loads(path.read_text())
    for feature in data['features']:
        geometry = feature['geometry']
        if geometry['type'] == 'Polygon':
            yield geometry['coordinates']
        elif geometry['type'] == 'MultiPolygon':
            yield from geometry['coordinates']


def card(name, dimensions, bounds, main, alternatives, towns, regions, color, source):
    width, height = dimensions
    west, south, east, north = bounds
    margin = 16
    map_width = width - 2 * margin
    map_height = height - 90

    def point(longitude, latitude):
        return (
            (longitude - west) * (map_width - 1) / (east - west),
            (north - latitude) * (map_height - 1) / (north - south),
        )

    base = Image.new('RGB', (map_width, map_height), SEA)
    terrain = ImageDraw.Draw(base)
    for polygon in source:
        exterior, *holes = polygon
        coordinates = [p[:2] for p in exterior]
        if not coordinates:
            continue
        xs, ys = zip(*coordinates)
        if max(xs) < west or min(xs) > east or max(ys) < south or min(ys) > north:
            continue
        terrain.polygon([point(*p) for p in coordinates], fill=LAND, outline=COAST, width=2)
        for ring in holes:
            terrain.polygon([point(*p[:2]) for p in ring], fill=SEA, outline=COAST, width=2)

    for longitude in range(-10, 131, 10):
        if west < longitude < east:
            x, _ = point(longitude, south)
            terrain.line((x, 0, x, map_height), fill=GRID, width=1)
    for latitude in range(20, 71, 10):
        if south < latitude < north:
            _, y = point(west, latitude)
            terrain.line((0, y, map_width, y), fill=GRID, width=1)

    for text, lon, lat, water in regions:
        terrain.text(point(lon, lat), text, font=font(24), anchor='mm',
                     fill=WATER if water else '#666151', stroke_width=2,
                     stroke_fill=SEA if water else LAND)

    def draw_route(coordinates, stroke, weight):
        path = [point(*location) for location in coordinates]
        terrain.line(path, fill='#fffdf6', width=weight + 7, joint='curve')
        terrain.line(path, fill=stroke, width=weight, joint='curve')

    for branch in alternatives:
        draw_route(branch, '#778e7d', 6)
    draw_route(main, color, 9)

    for label, longitude, latitude, dx, dy, alignment in towns:
        x, y = point(longitude, latitude)
        terrain.ellipse((x - 7, y - 7, x + 7, y + 7), fill=color, outline='#ffffff', width=2)
        terrain.text((x + dx, y + dy), label, font=font(25, 'Bold'), fill=INK,
                     stroke_width=3, stroke_fill='#fffdf6', anchor=alignment)

    # Le fond est orienté au nord. Aucun tracé ne sert d’échelle routière.
    terrain.polygon(((36, 45), (26, 68), (36, 62), (46, 68)), fill=INK)
    terrain.text((36, 34), 'N', font=font(18, 'Bold'), fill=INK, anchor='mb')

    result = Image.new('RGB', dimensions, '#fbfaf6')
    draw = ImageDraw.Draw(result)
    result.paste(base, (margin, margin))
    draw.rectangle((margin, margin, width - margin - 1, margin + map_height - 1), outline=COAST, width=2)
    y = height - 40
    draw.line((32, y, 79, y), fill=color, width=8)
    draw.text((95, y), 'Itinéraire indicatif', font=font(25, 'Bold'), fill=INK, anchor='lm')
    if alternatives:
        draw.line((410, y, 455, y), fill='#778e7d', width=6)
        draw.text((471, y), 'Autres voies terrestres', font=font(25), fill=INK, anchor='lm')
    result.save(OUTPUT / name, 'WEBP', quality=92, method=6)


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('land', type=Path, help='Fichier Natural Earth ne_50m_land.geojson')
    land = list(land_polygons(parser.parse_args().land))
    card(
        'log-101-carte-ambre-v004.webp', (1080, 640), (-7, 39, 35, 62),
        [(19.9, 54.9), (19.3, 54.0), (18.5, 52.8), (18.1, 51.8),
         (17.05, 51.10), (17.7, 50.0), (17.3, 49.0), (16.8, 48.1),
         (16.3, 47.2), (15.8, 46.4), (14.5, 46.0), (13.37, 45.77)],
        [],
        [
            ('Côte baltique', 19.9, 54.9, 21, -22, 'lm'),
            ('Carnuntum', 16.8, 48.1, 22, -5, 'lm'),
            ('Aquilée', 13.37, 45.77, 18, 17, 'lt'),
        ],
        [
            ('Mer Baltique', 16.3, 57.2, True), ('Mer du Nord', 2.3, 55.8, True),
            ('Europe centrale', 9.5, 50.5, False), ('Adriatique', 17.9, 43.0, True),
            ('Mer Méditerranée', 5.5, 40.7, True),
        ],
        '#a45019', land,
    )
    card(
        'log-101-carte-soie-v004.webp', (1280, 570), (25, 25, 119, 52),
        [(112.45, 34.62), (108.94, 34.27), (103.7, 36.0), (99.3, 38.5),
         (94.66, 40.14), (90.0, 42.9), (86.1, 41.8), (82.9, 41.7),
         (75.99, 39.47), (72.3, 40.8), (69.3, 41.3), (66.96, 39.65),
         (63.5, 39.0), (62.18, 37.66), (58.4, 37.9), (55.2, 36.4),
         (51.43, 35.59), (47.1, 34.7), (44.36, 33.32), (40.8, 34.5),
         (38.5, 35.0), (36.16, 36.20)],
        [
            [(94.66, 40.14), (90.5, 38.6), (86.7, 38.1), (82.7, 37.2),
             (79.9, 37.1), (77.1, 38.4), (75.99, 39.47)],
        ],
        [
            ('Luoyang', 112.45, 34.62, 6, 18, 'mt'),
            ('Dunhuang', 94.66, 40.14, 14, -19, 'lb'),
            ('Kachgar', 75.99, 39.47, 5, -18, 'lb'),
            ('Samarcande', 66.96, 39.65, -13, 23, 'rt'),
            ('Antioche', 36.16, 36.20, -10, -17, 'rb'),
        ],
        [
            ('Mer Méditerranée', 33, 31.4, True), ('Asie centrale', 63, 46.0, False),
            ('Chine', 110, 43.3, False), ('Taklamakan', 85.0, 35.0, False),
            ('Mer Caspienne', 51.4, 42.6, True),
        ],
        '#a44936', land,
    )


if __name__ == '__main__':
    main()
