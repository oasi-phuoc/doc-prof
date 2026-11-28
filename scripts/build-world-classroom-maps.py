"""Render themed classroom maps from Natural Earth and NASA Blue Marble."""

from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import json
import math
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'src/math/media/spatial/world'
CACHE = ROOT / 'node_modules/.codex-worktrees/europe-map-sources'
WIDTH, HEIGHT = 1080, 720
NATURAL_EARTH = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
NASA_WMS = 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?'

# Each group gets its own crop to leave room around the capital names.
REGIONS = (
    ('atlantique', 'Europe · Façade atlantique', 'europe', 'ISL IRL GBR PRT ESP AND'),
    ('ouest', 'Europe · Ouest et Alpes', 'europe', 'FRA BEL NLD LUX DEU CHE LIE MCO AUT'),
    ('nord', 'Europe · Pays nordiques et baltes', 'europe', 'DNK NOR SWE FIN EST LVA LTU'),
    ('est', 'Europe · Centre et Est', 'europe', 'POL CZE SVK HUN BLR UKR MDA RUS ROU'),
    ('balkans', 'Europe · Balkans', 'europe', 'SVN HRV BIH SRB MNE KOS MKD ALB BGR GRC'),
    ('mediterranee', 'Europe · Méditerranée', 'europe', 'ITA SMR MLT CYP GRC'),
    ('rome-vatican', 'Europe · Rome et Vatican', 'europe', 'ITA VAT'),
    ('caucase', 'Europe · Turquie et Caucase', 'europe', 'TUR GEO ARM AZE'),
    ('afrique-nord', 'Afrique · Nord et ouest', 'world', 'MAR DZA TUN EGY SEN MLI MRT CIV GHA NGA'),
    ('afrique-est', 'Afrique · Est et sud', 'world', 'ETH KEN UGA RWA TZA AGO ZMB ZWE ZAF MOZ'),
    ('asie-est', 'Asie · Est', 'world', 'MNG CHN PRK KOR JPN VNM LAO THA KHM PHL'),
    ('asie-sud', 'Asie · Sud', 'world', 'PAK IND NPL BTN BGD LKA MDV MMR'),
    ('asie-ouest', 'Asie · Moyen-Orient', 'world', 'IRN IRQ JOR LBN SYR SAU QAT OMN KWT ARE'),
    ('asie-centrale', 'Asie · Centre', 'world', 'KAZ KGZ TJK TKM UZB AFG'),
    ('amerique-nord', 'Amérique · Nord et Caraïbes', 'world', 'CAN USA MEX GTM CRI PAN CUB HTI DOM JAM'),
    ('amerique-sud', 'Amérique · Sud', 'world', 'COL VEN ECU PER BOL BRA PRY URY ARG CHL'),
    ('oceanie', 'Océanie', 'world', 'AUS NZL PNG SLB VUT FJI WSM TON'),
)


def cached(filename, url):
    path = CACHE / filename
    if not path.exists():
        request = Request(url, headers={'User-Agent': 'DocProf educational maps'})
        with urlopen(request, timeout=35) as response:
            path.write_bytes(response.read())
    return path.read_bytes()


def mercator(lon, lat):
    return 6378137 * math.radians(lon), 6378137 * math.asinh(math.tan(math.radians(max(-84, min(84, lat)))))


def capital_points(features):
    main = {'BOL': 'Sucre', 'ZAF': 'Pretoria'}
    points = {}
    for feature in features:
        props = feature['properties']
        code = props['ADM0_A3']
        if props['ADM0CAP'] != 1 or code in main and props['NAME'] != main[code]:
            continue
        label = props.get('NAME_FR') or props['NAME']
        points[code] = (label, *feature['geometry']['coordinates'])
    return points


def make_map(region, capitals, countries):
    code, label, family, key_string = region
    country_names = {feature['properties']['ADM0_A3']: feature['properties']['NAME_FR'] for feature in countries}
    selected = [(country_names[key], *capitals[key]) for key in key_string.split()]
    points = [(country, name, *mercator(lon + (360 if code == 'oceanie' and lon < 0 else 0), lat))
              for country, name, lon, lat in selected]
    xmin, xmax = min(p[2] for p in points), max(p[2] for p in points)
    ymin, ymax = min(p[3] for p in points), max(p[3] for p in points)
    padding = 1.55 if code == 'rome-vatican' else 1.30
    width = max(xmax - xmin, (ymax - ymin) * WIDTH / HEIGHT) * padding
    height = width * HEIGHT / WIDTH
    left, top = (xmin + xmax - width) / 2, (ymin + ymax + height) / 2

    def project(x, y):
        return (x - left) / width, (top - y) / height

    def background_strip(west, east, pixels, suffix):
        params = dict(SERVICE='WMS', VERSION='1.1.1', REQUEST='GetMap', LAYERS='BlueMarble_ShadedRelief_Bathymetry',
                      STYLES='', SRS='EPSG:3857', BBOX=f'{west},{top-height},{east},{top}', WIDTH=pixels,
                      HEIGHT=HEIGHT, FORMAT='image/jpeg')
        image = Image.open(BytesIO(cached(f'{code}{suffix}.jpg', NASA_WMS + urlencode(params))))
        if image.size != (pixels, HEIGHT):
            raise ValueError(f'{code}: dimensions de fond invalides')
        return image.convert('RGB')

    half_world = math.pi * 6378137
    if left + width > half_world:
        first_width = round(WIDTH * (half_world - left) / width)
        photo = Image.new('RGB', (WIDTH, HEIGHT))
        photo.paste(background_strip(left, half_world, first_width, '-west'), (0, 0))
        photo.paste(background_strip(-half_world, left + width - 2 * half_world, WIDTH - first_width, '-east'), (first_width, 0))
    else:
        photo = background_strip(left, left + width, WIDTH, '')
    annotated = photo.copy()
    simple = Image.new('L', (WIDTH, HEIGHT), 255)
    detail, outline = ImageDraw.Draw(annotated), ImageDraw.Draw(simple)
    for feature in countries:
        geom = feature['geometry']
        polygons = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
        for polygon in polygons:
            for ring in polygon:
                projected = [project(*mercator(lon + (360 if code == 'oceanie' and lon < -80 else 0), lat)) for lon, lat in ring]
                if (min(p[0] for p in projected) >= 1 or max(p[0] for p in projected) <= 0 or
                        min(p[1] for p in projected) >= 1 or max(p[1] for p in projected) <= 0):
                    continue
                pixels = [(round(x * WIDTH), round(y * HEIGHT)) for x, y in projected]
                outline.polygon(pixels, fill=224, outline=104, width=2)
                detail.line(pixels, fill='#262934', width=4, joint='curve')
                detail.line(pixels, fill='#fff4d4', width=2, joint='curve')
    id_ = f'capitales-{code}'
    photo.save(ASSETS / f'{id_}-photo.webp', quality=90)
    annotated.save(ASSETS / f'{id_}-annotated.webp', quality=92)
    simple.save(ASSETS / f'{id_}-simplified.png', optimize=True)
    return dict(id=id_, label=label, family=family, places=[dict(name=name, country=country, x=round(x, 6), y=round(y, 6))
                for country, name, east, north in points for x, y in [project(east, north)]])


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    countries = json.loads(cached('countries.geojson', NATURAL_EARTH + 'ne_50m_admin_0_countries.geojson'))['features']
    capitals = capital_points(json.loads(cached('capitals.geojson', NATURAL_EARTH + 'ne_10m_populated_places.geojson'))['features'])
    with ThreadPoolExecutor(max_workers=4) as executor:
        plans = list(executor.map(lambda region: make_map(region, capitals, countries), REGIONS))
    (ASSETS / 'plans.json').write_text(json.dumps(plans, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'{len(plans)} cartes de capitales générées.')


if __name__ == '__main__':
    main()
