#!/usr/bin/env python3
"""Dessine le schéma des trois objectifs logistiques du module 103."""
from pathlib import Path
from runpy import run_path

from PIL import Image, ImageDraw


SCRIPTS = Path(__file__).resolve().parent
OUTPUT = SCRIPTS.parent / 'public/assets/logistique/100/103/commun'
art = run_path(str(SCRIPTS / 'logistique-glossary-art.py'))
font = art['font']
INK = '#233943'


def objectives():
    result = Image.new('RGBA', (1100, 820), '#fbfaf7')
    circles = [
        ((550, 268), (159, 196, 227, 116)),
        ((331, 544), (176, 205, 159, 123)),
        ((769, 544), (238, 184, 139, 126)),
    ]
    radius = 250
    for (x, y), color in circles:
        layer = Image.new('RGBA', result.size)
        ImageDraw.Draw(layer).ellipse((x-radius, y-radius, x+radius, y+radius), fill=color)
        result = Image.alpha_composite(result, layer)
    draw = ImageDraw.Draw(result)
    for (x, y), _ in circles:
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), outline='#526974', width=4)
    for x, y, text in [
        (550, 188, 'Grande\ndisponibilité\nde livraison'),
        (307, 589, 'Faibles\nexigences\nde capital'),
        (788, 592, 'Minimisation\ndes coûts'),
    ]:
        draw.multiline_text((x, y), text, anchor='mm', align='center',
                            spacing=8, font=font(50, True), fill=INK)
    result.convert('RGB').save(OUTPUT / 'log-103-objectifs-schema-v004.webp',
                               'WEBP', lossless=True, method=6)


if __name__ == '__main__':
    objectives()
