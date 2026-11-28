"""Create the three aligned raster backgrounds and public landmarks for each town."""

from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import json
import math
import re
import sys
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src/math/media/spatial/swiss'
CACHE = ROOT / 'node_modules/.codex-worktrees/swiss-map-sources'
WIDTH, HEIGHT = 1080, 720
RADIUS = 6378137
ROWS = 3
EXTRA_COLUMNS = {'sion-ensemble': 7, 'ardon': 5}
LANDMARK_COUNT = 10
SION_LV95 = (2593720, 1120697, 940, 627)
SION_LANDMARKS = (
    ('Église Saint-Théodule', 2593858, 1120236), ('Hôtel de ville', 2593980, 1120260),
    ('Basilique de Valère', 2594266, 1120249), ('Château de Tourbillon', 2594469, 1120560),
)
PREFERRED_PLACES = {
    'sion-ensemble': (
        ('Gare de Sion', 46.227462, 7.359330), ('Château de Tourbillon', 46.236492, 7.367183),
        ('Château de Montorge', 46.230607, 7.334639), ('Aéroport de Sion', 46.219167, 7.326944),
    ),
    'zermatt': (
        ('Gare de Zermatt', 46.024573, 7.748129), ('Musée du Cervin', 46.019769, 7.746457),
        ('Départ pour Sunnegga', 46.022506, 7.751732), ('Chemin de croix', 46.016436, 7.744413),
    ),
    'ardon': (
        ('Gare d’Ardon', 46.208621, 7.270943), ('Bibliothèque communale', 46.211340, 7.254921),
        ('Centre scolaire de Cordé', 46.207829, 7.258131),
    ),
    'vetroz': (
        ('Église Sainte-Marie-Madeleine', 46.227250, 7.281650), ('Caserne des pompiers', 46.224288, 7.278694),
        ('Centre du Bassin', 46.223839, 7.295861),
    ),
    'brigue': (
        ('Gare de Brigue', 46.319319, 7.988264), ('Jardin Stockalper', 46.314726, 7.990407),
        ('Collège Spiritus Sanctus', 46.314784, 7.993751),
    ),
    'viege': (
        ('Gare de Viège', 46.294020, 7.881488), ('Maison communale', 46.289336, 7.881635),
        ('Salle de sport Sand', 46.296658, 7.876867),
    ),
    'saint-maurice': (
        ('Gare de Saint-Maurice', 46.216366, 7.002150), ('Abbaye de Saint-Maurice', 46.219629, 7.003676),
        ('Fort du Scex', 46.213679, 6.995584),
    ),
    'riddes': (
        ('Bibliothèque communale', 46.172257, 7.224482), ('Église paroissiale', 46.169109, 7.219921),
        ('Sculpture Jérôme Rudin', 46.175965, 7.226196),
    ),
    'nendaz': (
        ('Télécabine de Tracouet', 46.179993, 7.291287), ('Chapelle des Rairettes', 46.175654, 7.282126),
        ('Moulin du Tsâblo', 46.183793, 7.295741),
    ),
    'lausanne': (
        ('Cathédrale de Lausanne', 46.522605, 6.635365), ('Gare de Lausanne', 46.516863, 6.629126),
        ('Parc de Mon-Repos', 46.519145, 6.643057), ('Parc de Milan', 46.514206, 6.622738),
    ),
    'berne': (
        ('Palais fédéral', 46.946498, 7.444216), ('Cathédrale de Berne', 46.947241, 7.451595),
        ('Musée d’histoire de Berne', 46.942968, 7.449200), ('Musée des beaux-arts', 46.951202, 7.443139),
    ),
    'zurich': (
        ('Gare centrale de Zurich', 47.378101, 8.539364), ('Grossmünster', 47.370103, 8.543972),
        ('Fraumünster', 47.369714, 8.541203), ('ETH Zurich', 47.376427, 8.547810),
    ),
    'bale': (
        ('Cathédrale de Bâle', 47.556420, 7.592296), ('Musée de la musique', 47.554803, 7.587842),
        ('Maison zur Kirschgarte', 47.552103, 7.591352),
    ),
}
TOWNS = (
    ('sion-ensemble', 'Sion · vue d’ensemble', 46.2300, 7.3555, 7700),
    ('zermatt', 'Zermatt', 46.0203, 7.7490, 1950),
    ('martigny', 'Martigny', 46.1007, 7.0731, 2800),
    ('ardon', 'Ardon', 46.2086, 7.2650, 2040),
    ('vetroz', 'Vétroz', 46.2232, 7.2847, 2300),
    ('sierre', 'Sierre', 46.2921, 7.5379, 2700),
    ('brigue', 'Brigue', 46.3160, 7.9852, 2250),
    ('viege', 'Viège', 46.2933, 7.8795, 2150),
    ('monthey', 'Monthey', 46.2517, 6.9540, 2250),
    ('saint-maurice', 'Saint-Maurice', 46.2175, 7.0040, 2000),
    ('conthey', 'Conthey', 46.2284, 7.2977, 2400),
    ('fully', 'Fully', 46.1384, 7.1146, 2600),
    ('saxon', 'Saxon', 46.1503, 7.1736, 2550),
    ('riddes', 'Riddes', 46.1745, 7.2210, 1950),
    ('nendaz', 'Haute-Nendaz', 46.1818, 7.2941, 2300),
    ('lausanne', 'Lausanne', 46.5188, 6.6308, 2750),
    ('berne', 'Berne', 46.9485, 7.4498, 2600),
    ('zurich', 'Zurich', 47.3711, 8.5424, 2450),
    ('bale', 'Bâle', 47.5562, 7.5894, 2550),
    ('geneve', 'Genève', 46.2184, 6.1455, 3750),
    ('bienne', 'Bienne', 47.1402, 7.2492, 2750),
    ('fribourg', 'Fribourg', 46.8053, 7.1630, 2860),
    ('neuchatel', 'Neuchâtel', 46.9939, 6.9338, 2660),
    ('lucerne', 'Lucerne', 47.0502, 8.3088, 2700),
)


def mercator(lat, lon):
    return RADIUS * math.radians(lon), RADIUS * math.asinh(math.tan(math.radians(lat)))


def geographic(x, y):
    return math.degrees(math.atan(math.sinh(y / RADIUS))), math.degrees(x / RADIUS)


def lv95(lat, lon):
    # https://www.swisstopo.admin.ch/dam/en/sd-web/KLRCX9XIdXDu/ch1903wgs84-EN.pdf
    p = (lat * 3600 - 169028.66) / 10000
    l = (lon * 3600 - 26782.5) / 10000
    easting = 2600072.37 + 211455.93 * l - 10938.51 * l * p - 0.36 * l * p**2 - 44.54 * l**3
    northing = 1200147.07 + 308807.95 * p + 3745.25 * l**2 + 76.63 * p**2 - 194.56 * l**2 * p + 119.79 * p**3
    return easting, northing


def fetch_cached(path, urls):
    if path.exists():
        return path.read_bytes()
    errors = []
    for attempt, url in enumerate(urls):
        try:
            request = Request(url, headers={'User-Agent': 'DocProf classroom maps (oasi-phuoc/doc-prof)'})
            with urlopen(request, timeout=70) as response:
                result = response.read()
            path.write_bytes(result)
            return result
        except OSError as error:
            errors.append(str(error))
            time.sleep(2 + attempt * 3)
    raise RuntimeError(f'{path.name}: {" / ".join(errors)}')


def load_osm(key, sw, ne, overview):
    bbox = ','.join(f'{coord:.7f}' for coord in (*sw, *ne))
    road_types = 'motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|pedestrian|footway|path|steps'
    if overview:
        road_types = 'motorway|trunk|primary|secondary|tertiary|pedestrian'
    buildings = 'school|church|civic|train_station|public|cathedral|commercial' if overview else '.+'
    query = (f'[out:json][timeout:45];('
             f'way[highway~"^({road_types})(_link)?$"]({bbox});'
             f'way[building~"^({buildings})$"]({bbox});'
             f'way[waterway~"^(river|canal)$"]({bbox});'
             f'nwr[railway=station][name]({bbox});'
             f'nwr[amenity~"^(townhall|place_of_worship|school|library|theatre)$"][name]({bbox});'
             f'nwr[tourism~"^(museum|attraction|viewpoint)$"][name]({bbox});'
             f'nwr[historic~"^(castle|fort|monument)$"][name]({bbox});'
             f'nwr[leisure=park][name]({bbox}););out center geom;')
    suffix = '/api/interpreter?' + urlencode({'data': query})
    result = fetch_cached(CACHE / f'{key}.json', [
        'https://overpass.kumi.systems' + suffix, 'https://overpass.osm.ch' + suffix,
        'https://overpass-api.de' + suffix, 'https://overpass.private.coffee' + suffix,
    ])
    parsed = json.loads(result)
    if parsed.get('remark'):
        raise RuntimeError(f'{key}: {parsed["remark"]}')
    return parsed['elements']


def location(element):
    point = element if element['type'] == 'node' else element.get('center')
    if point:
        return point['lat'], point['lon']
    geometry = element.get('geometry')
    if geometry:
        latitudes, longitudes = zip(*((node['lat'], node['lon']) for node in geometry))
        return (min(latitudes) + max(latitudes)) / 2, (min(longitudes) + max(longitudes)) / 2
    return None


def names_for(town, tags):
    name = tags.get('name:fr') or tags.get('name')
    if tags.get('railway') == 'station' and (not tags.get('station') or tags['station'] not in ('subway', 'light_rail')):
        if name and not name.lower().startswith(('gare', 'bahnhof')):
            return ('Gare d’' if name[0] in 'AEIOUYÉ' else 'Gare de ') + name, 10
        return name, 10
    if tags.get('amenity') == 'townhall':
        return 'Hôtel de ville' if town in ('Berne', 'Zurich', 'Bâle', 'Lausanne') else 'Maison communale', 9
    if tags.get('historic') in ('castle', 'fort') or tags.get('building') == 'cathedral':
        return name, 9
    if tags.get('tourism') == 'museum':
        return name, 8
    if tags.get('amenity') == 'place_of_worship':
        return name, 8
    if tags.get('amenity') in ('school', 'library', 'theatre') or tags.get('leisure') == 'park':
        return name, 7
    if tags.get('tourism') in ('attraction', 'viewpoint') or tags.get('historic') == 'monument':
        return name, 6
    return None, 0


def select_landmarks(key, town, elements, project):
    def candidate(name, latitude, longitude, weight):
        x, y = project(latitude, longitude)
        col, row = math.floor(x * columns), math.floor(y * ROWS)
        return weight, name, x, y, col, row

    columns = EXTRA_COLUMNS.get(key, 4)
    preferred = [candidate(name, lat, lon, 100 - index) for index, (name, lat, lon) in enumerate(PREFERRED_PLACES.get(key, ()))]
    candidates = []
    for element in elements:
        tags = element.get('tags', {})
        raw_point = location(element)
        if not raw_point or not tags.get('name'):
            continue
        if tags.get('highway') or tags.get('waterway'):
            continue
        if tags.get('railway') == 'station' and tags.get('station') in ('subway', 'light_rail'):
            continue
        name, weight = names_for(town, tags)
        if not name or len(name) > 36 or re.fullmatch(r'[A-Z]*\d+', name) or name.endswith(' SA'):
            continue
        _, _, x, y, col, row = candidate(name, *raw_point, weight)
        margin = min(x * columns % 1, 1 - x * columns % 1, y * ROWS % 1, 1 - y * ROWS % 1)
        if not (0.05 < x < 0.94 and 0.05 < y < 0.94 and margin > 0.06):
            continue
        candidates.append((weight + margin, name, x, y, col, row))
    selected = []
    for weight, name, x, y, col, row in [*preferred, *sorted(candidates, reverse=True)]:
        if not (0 < x < 1 and 0 < y < 1):
            continue
        if any(place['name'].casefold() == name.casefold() or place['cell'] == [col, row] or
               (weight < 100 - len(preferred) and math.hypot(x - place['x'], y - place['y']) < 0.13)
               for place in selected):
            continue
        selected.append({'name': name, 'x': round(x, 6), 'y': round(y, 6), 'cell': [col, row]})
        if len(selected) == 4:
            break
    if len(selected) < 2:
        raise RuntimeError(f'{town}: seulement {len(selected)} lieux sélectionnés')
    for place in selected:
        place.pop('cell')
    return extend_landmarks(town, elements, project, selected)


def extend_landmarks(town, elements, project, selected):
    candidates = []
    for element in elements:
        tags = element.get('tags', {})
        name, weight = names_for(town, tags)
        point = location(element)
        if not name and tags.get('name') and (tags.get('building') in (
            'civic', 'public', 'school', 'church', 'chapel', 'train_station', 'museum', 'sports_hall',
        ) or tags.get('leisure') in ('sports_centre', 'pitch')):
            name, weight = tags['name'], 5
        geometry = element.get('geometry')
        if not name and geometry and tags.get('name') and tags.get('highway'):
            name, weight = tags['name'], 2
            route_points = [(node['lat'], node['lon']) for node in geometry]
            inside = [point for point in route_points if all(0.07 < coordinate < 0.93 for coordinate in project(*point))]
            point = inside[len(inside) // 2] if inside else None
        if not name or not point or len(name) > 36 or not re.search(r'[A-Za-zÀ-ÿ]', name) or re.fullmatch(r'[A-Z]*\d+', name):
            continue
        x, y = project(*point)
        if 0.05 < x < 0.95 and 0.05 < y < 0.95:
            candidates.append((weight, name, x, y))
    while len(selected) < LANDMARK_COUNT:
        viable = []
        for weight, name, x, y in candidates:
            nearest = min(math.hypot(x - place['x'], y - place['y']) for place in selected)
            if nearest > 0.045 and all(name.casefold() != place['name'].casefold() for place in selected):
                viable.append((weight * 0.055 + nearest, name, x, y))
        if not viable:
            raise RuntimeError(f'{town}: seulement {len(selected)} lieux sélectionnés')
        _, name, x, y = max(viable)
        selected.append({'name': name, 'x': round(x, 6), 'y': round(y, 6)})
    return selected


def historic_sion_landmarks():
    west, north, width, height = SION_LV95

    def normalize(easting, northing):
        return (easting - west) / width, (north - northing) / height

    selected = [dict(name=name, x=x, y=y) for name, east, northing in SION_LANDMARKS
                for x, y in [normalize(east, northing)]]
    # The larger Sion source already contains the entire historic district.
    elements = json.loads((CACHE / 'sion-ensemble.json').read_bytes())['elements']
    return extend_landmarks('Sion', elements, lambda lat, lon: normalize(*lv95(lat, lon)), selected)


def dashed_path(draw, pts, color, width):
    remaining, visible = 10.0, True
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        dx, dy = x1 - x0, y1 - y0
        length = math.hypot(dx, dy)
        start = 0.0
        while start < length:
            end = min(length, start + remaining)
            if visible:
                draw.line((x0 + dx * start / length, y0 + dy * start / length,
                           x0 + dx * end / length, y0 + dy * end / length), fill=color, width=width)
            remaining -= end - start
            if remaining < 0.01:
                visible = not visible
                remaining = 10.0 if visible else 7.0
            start = end


def building_block(points):
    start, end = max(zip(points, points[1:]), key=lambda edge: math.dist(*edge))
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    c, s = math.cos(angle), math.sin(angle)
    xs, ys = zip(*((x * c + y * s, y * c - x * s) for x, y in points))
    left, right, top, bottom = min(xs), max(xs), min(ys), max(ys)
    if (right - left) * (bottom - top) < 54:
        return None
    return [(x * c - y * s, x * s + y * c) for x, y in ((left, top), (right, top), (right, bottom), (left, bottom))]


def render(key, photo, elements, project):
    simplified = Image.new('L', (WIDTH, HEIGHT), 255)
    annotated = photo.copy()
    simple = ImageDraw.Draw(simplified)
    aerial = ImageDraw.Draw(annotated)
    roads, paths = [], []
    for element in elements:
        geometry = element.get('geometry')
        tags = element.get('tags', {})
        if element['type'] != 'way' or not geometry or len(geometry) < 2:
            continue
        pts = [(x * WIDTH, y * HEIGHT) for x, y in (project(point['lat'], point['lon']) for point in geometry)]
        if tags.get('building') and len(pts) > 2:
            block = building_block(pts)
            if block:
                simple.polygon(block, fill=192)
        elif tags.get('waterway'):
            simple.line(pts, fill=186, width=7, joint='curve')
        elif tags.get('highway') in ('footway', 'path', 'steps', 'pedestrian'):
            distance = sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))
            if distance > 55 and tags.get('footway') not in ('crossing', 'sidewalk') and tags.get('access') not in ('private', 'no'):
                paths.append(pts)
        elif tags.get('highway'):
            wide = tags['highway'].split('_')[0] in ('motorway', 'trunk', 'primary', 'secondary', 'tertiary')
            roads.append((pts, wide))
    for pts, wide in roads:
        simple.line(pts, fill=42, width=10 if wide else 5, joint='curve')
        aerial.line(pts, fill='#382f21', width=8 if wide else 4, joint='curve')
    for pts, wide in roads:
        simple.line(pts, fill=255, width=6 if wide else 3, joint='curve')
        aerial.line(pts, fill='#fff1c8', width=4 if wide else 2, joint='curve')
    for pts in paths:
        dashed_path(simple, pts, 45, 2)
        dashed_path(aerial, pts, '#302b24', 5)
        dashed_path(aerial, pts, '#ffd36d', 2)
    photo.save(ASSETS / f'{key}-photo.webp', quality=80, method=4)
    annotated.save(ASSETS / f'{key}-annotated.webp', quality=82, method=4)
    simplified.save(ASSETS / f'{key}-simplified.png', optimize=True)


def create_town(town):
    key, label, lat, lon, ground_width = town
    x, y = mercator(lat, lon)
    width = ground_width / math.cos(math.radians(lat))
    height = width * HEIGHT / WIDTH
    left, bottom, right, top = x - width / 2, y - height / 2, x + width / 2, y + height / 2

    def project(latitude, longitude):
        xp, yp = mercator(latitude, longitude)
        return (xp - left) / width, (top - yp) / height

    elements = load_osm(key, geographic(left, bottom), geographic(right, top), ground_width > 4000)
    landmarks = select_landmarks(key, label, elements, project)
    wms = 'https://wms.geo.admin.ch/?' + urlencode({
        'SERVICE': 'WMS', 'REQUEST': 'GetMap', 'VERSION': '1.3.0', 'LAYERS': 'ch.swisstopo.swissimage',
        'STYLES': 'default', 'CRS': 'EPSG:3857', 'BBOX': ','.join(f'{v:.4f}' for v in (left, bottom, right, top)),
        'WIDTH': WIDTH, 'HEIGHT': HEIGHT, 'FORMAT': 'image/jpeg',
    })
    if '--landmarks-only' not in sys.argv or not (ASSETS / f'{key}-photo.webp').exists():
        image = Image.open(BytesIO(fetch_cached(CACHE / f'{key}.jpg', [wms, wms, wms]))).convert('RGB')
        if image.size != (WIDTH, HEIGHT):
            raise RuntimeError(f'{key}: dimensions de l’image {image.size}')
        render(key, image, elements, project)
    print(f'{label}: {", ".join(place["name"] for place in landmarks)}', flush=True)
    return {'id': key, 'label': label, 'columns': EXTRA_COLUMNS.get(key, 4), 'places': landmarks}


def create_with_report(town):
    try:
        return create_town(town)
    except (OSError, KeyError, RuntimeError) as error:
        print(f'{town[0]}: {error}', flush=True)
        return None


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=2) as executor:
        rows = [result for result in executor.map(create_with_report, TOWNS) if result]
    (ASSETS / 'towns.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if len(rows) != len(TOWNS):
        raise SystemExit(f'{len(rows)} des {len(TOWNS)} nouveaux lieux générés.')
    historic = historic_sion_landmarks()
    (ASSETS / 'sion-historique-reperes.json').write_text(json.dumps(historic, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
