"""Draw the exact examples used by src/math/theory-lessons.ts."""
from functools import lru_cache
from math import cos, hypot, radians, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/math/media/theory/falc'
FONT = ROOT / 'public/fonts/worksheet/didact-gothic-v1.ttf'
INK = '#172336'
GIVEN = '#874515'
STEP = '#174A7E'
RESULT = '#155E40'
GRID = '#C8D2DC'
BLUE_FILL = '#E8F1F9'
GREEN_FILL = '#E6F1EA'
AMBER_FILL = '#F5EBDD'


@lru_cache(maxsize=None)
def font(size):
    return ImageFont.truetype(str(FONT), size)


class Diagram:
    def __init__(self):
        self.image = Image.new('RGB', (920, 258), 'white')
        self.draw = ImageDraw.Draw(self.image)

    def text(self, x, y, text, size=36, color=INK, anchor='mm'):
        self.draw.text((x, y), str(text), fill=color, font=font(size), anchor=anchor)

    def line(self, *points, color=INK, width=3):
        self.draw.line(points, fill=color, width=width, joint='curve')

    def box(self, bounds, color, fill='white', width=3):
        self.draw.rounded_rectangle(bounds, radius=8, fill=fill, outline=color, width=width)

    def point(self, x, y, color, open_point=False, radius=6):
        self.draw.ellipse(
            (x - radius, y - radius, x + radius, y + radius),
            fill='white' if open_point else color, outline=color, width=3,
        )

    def arrow(self, start, end, color=STEP):
        self.line(start, end, color=color, width=4)
        dx, dy = end[0] - start[0], end[1] - start[1]
        distance = hypot(dx, dy)
        ux, uy = dx / distance, dy / distance
        left = (end[0] - 15 * ux + 7 * uy, end[1] - 15 * uy - 7 * ux)
        right = (end[0] - 15 * ux - 7 * uy, end[1] - 15 * uy + 7 * ux)
        self.draw.polygon([end, left, right], fill=color)

    def tag(self, x, y, text, color, size=34, fill='white'):
        width = self.draw.textlength(text, font=font(size))
        self.box((x - width / 2 - 12, y - size / 2 - 5,
                  x + width / 2 + 12, y + size / 2 + 5), color, fill)
        self.text(x, y, text, size, color)

    def grid(self, left, bottom, columns, rows, cell):
        def at(x, y):
            return left + x * cell, bottom - y * cell

        for x in range(columns + 1):
            self.line(at(x, 0), at(x, rows), color=GRID, width=2)
        for y in range(rows + 1):
            self.line(at(0, y), at(columns, y), color=GRID, width=2)
        return at

    def polygon(self, points, color, fill):
        self.draw.polygon(points, fill=fill)
        self.line(*points, points[0], color=color, width=4)

    def save(self, name):
        self.image.save(OUT / f'{name}.png', optimize=True)


def place_value():
    d = Diagram()
    for index, (name, digit, value, color, fill) in enumerate([
        ('Centaines', 2, 200, GIVEN, AMBER_FILL),
        ('Dizaines', 4, 40, STEP, BLUE_FILL),
        ('Unités', 3, 3, RESULT, GREEN_FILL),
    ]):
        x = 160 + index * 300
        d.box((x - 130, 18, x + 130, 176), color, fill)
        d.text(x, 53, name, 38, color)
        d.text(x, 119, digit, 76, color)
        d.arrow((x, 181), (x, 200), color)
        d.text(x, 220, value, 42, color)
    d.save('nombres')


def column_operation(subtract):
    d = Diagram()
    left, right = 318, 484
    d.text(left, 26, 'Dizaines', 34)
    d.text(right, 26, 'Unités', 34)
    d.line((401, 50), (401, 223), color=GRID, width=2)
    first, second, result = ('42', '17', '25') if subtract else ('27', '15', '42')
    for y, digits in [(101, first), (149, second)]:
        for x, digit in zip((left, right), digits):
            d.text(x, y, digit, 54)
    d.text(228, 149, '−' if subtract else '+', 48)
    if subtract:
        d.line((301, 111), (337, 89), color=STEP, width=4)
        d.line((466, 111), (503, 89), color=STEP, width=4)
        d.text(left, 60, '3', 34, STEP)
        d.text(right, 60, '12', 34, STEP)
    else:
        d.point(left, 61, STEP, open_point=True, radius=18)
        d.text(left, 61, '1', 31, STEP)
    d.line((220, 178), (539, 178), width=4)
    d.box((278, 185, 525, 239), RESULT, GREEN_FILL)
    d.line((401, 186), (401, 239), color=GRID, width=2)
    for x, digit in zip((left, right), result):
        d.text(x, 211, digit, 49, RESULT)
    d.line((514 if subtract else 340, 61), (602, 61), color=STEP)
    d.text(618, 61, 'Échange' if subtract else 'Retenue', 41, STEP, 'lm')
    d.text(618, 108, '3 dizaines et 12 unités' if subtract else 'J’ajoute 1 dizaine.', 29, INK, 'lm')
    d.line((527, 211), (602, 211), color=RESULT)
    d.text(618, 211, 'Différence' if subtract else 'Somme', 40, RESULT, 'lm')
    d.save('soustraction' if subtract else 'addition')


def number_line(relative):
    d = Diagram()
    first, last, current, result = (-4, 4, -3, -1) if relative else (40, 50, 47, 50)
    def x(n):
        return 91 + (n - first) * 73 if relative else 72 + (n - first) * 77

    d.arrow((x(first) - 25, 139), (x(last) + 44, 139), INK)
    for n in range(first, last + 1):
        if relative:
            color = GIVEN if n == 0 else STEP if n < 0 else RESULT
        else:
            color = RESULT if n == result else STEP if n == current else INK
        d.line((x(n), 126), (x(n), 151), color=color)
        d.text(x(n), 176, str(n).replace('-', '−'), 32, color)
    d.point(x(current), 139, STEP)
    d.point(x(result), 139, STEP if relative else RESULT, open_point=True)
    if relative:
        d.text(x(0), 58, 'Zéro', 39, GIVEN)
        d.line((x(0), 78), (x(0), 124), color=GIVEN)
        d.text(x(-3), 88, 'Négatif', 35, STEP)
        d.text(x(3), 88, 'Positif', 35, RESULT)
        d.text(460, 227, '−3 est à gauche de −1.', 38)
    else:
        d.tag(x(47) - 25, 36, 'Nombre de départ', STEP, size=33)
        d.line((x(47), 62), (x(47), 126), color=STEP)
        d.text(x(42), 83, '7 pas', 36, STEP)
        d.text(x(50) - 7, 83, '3 pas', 36, RESULT, 'rm')
        d.arrow((x(47) + 9, 110), (x(50), 110), RESULT)
        d.text(x(49) - 28, 223, 'Nombre arrondi', 37, RESULT)
    d.save('relatifs' if relative else 'estimation')


def trays(divide):
    d = Diagram()
    count, per_group = (4, 3) if divide else (3, 4)
    centers = [120 + i * 164 for i in range(count)] if divide else [200 + i * 260 for i in range(count)]
    d.text(390 if divide else 460, 26, 'Diviseur : 4 groupes' if divide else 'Facteurs : 3 groupes de 4', 39, STEP)
    for x in centers:
        d.box((x - 65, 54, x + 65, 140), STEP, BLUE_FILL)
        for i in range(per_group):
            d.point(x + (i - (per_group - 1) / 2) * 27, 95, STEP, radius=8)
    if divide:
        for x in (784, 813):
            d.point(x, 95, GIVEN, radius=8)
        d.text(802, 134, 'Reste : 2', 35, GIVEN)
        d.tag(229, 201, 'Dividende : 14', GIVEN, size=37, fill=AMBER_FILL)
        d.tag(659, 201, 'Quotient : 3', RESULT, size=37, fill=GREEN_FILL)
    else:
        d.text(320, 200, '3 × 4 =', 50, STEP)
        d.tag(481, 200, '12', RESULT, size=55, fill=GREEN_FILL)
        d.text(607, 200, 'Produit', 42, RESULT)
    d.save('division' if divide else 'multiplication')


def problems():
    d = Diagram()
    d.text(230, 35, 'Données', 41, GIVEN)
    d.text(228, 206, '4 crayons + 3 crayons', 36, GIVEN)
    for i in range(7):
        x = 86 + i * 39 + (34 if i >= 4 else 0)
        d.box((x, 80, x + 13, 152), GIVEN, AMBER_FILL, width=2)
        d.draw.polygon([(x, 80), (x + 6, 67), (x + 13, 80)], fill=GIVEN)
    d.arrow((403, 115), (475, 115))
    d.text(496, 64, 'Question', 35, STEP, 'lm')
    d.text(496, 109, 'Combien de crayons en tout ?', 31, STEP, 'lm')
    d.tag(686, 190, 'Réponse : 7 crayons', RESULT, size=40, fill=GREEN_FILL)
    d.save('problemes')


def multiples():
    d = Diagram()
    for y, title, values in [(58, 'Multiples de 4', (4, 8, 12, 16)),
                             (132, 'Multiples de 6', (6, 12, 18, 24))]:
        d.text(28, y, title, 38, GIVEN, 'lm')
        for x, number in zip((352, 493, 633, 772), values):
            if number == 12:
                d.tag(x, y, '12', RESULT, size=43, fill=GREEN_FILL)
            else:
                d.text(x, y, number, 43)
    d.line((80, 176), (840, 176), color=GRID)
    d.text(248, 218, 'PPCM : 12', 45, RESULT)
    d.text(647, 207, 'Diviseurs communs : 1 et 2', 33, STEP)
    d.text(647, 236, 'PGCD : 2', 32, STEP)
    d.save('multiples')


def fractions():
    d = Diagram()
    for i in range(4):
        x = 75 + 96 * i
        bounds = (x, 83, x + 96, 150)
        d.draw.rectangle(bounds, fill=BLUE_FILL if i < 3 else 'white', outline=STEP, width=3)
        if i < 3:
            for k in (12, 33, 54, 75):
                d.line((x + k, 143), (x + k + 16, 91), color=STEP, width=2)
    d.line((75, 165), (460, 165), color=RESULT, width=4)
    d.line((75, 158), (75, 169), color=RESULT)
    d.line((460, 158), (460, 169), color=RESULT)
    d.arrow((366, 75), (542, 56))
    d.arrow((461, 170), (542, 186), RESULT)
    d.text(584, 57, '3', 61, STEP)
    d.line((558, 115), (610, 115), width=4)
    d.text(584, 177, '4', 61, RESULT)
    d.text(634, 57, 'Numérateur', 38, STEP, 'lm')
    d.text(634, 178, 'Dénominateur', 38, RESULT, 'lm')
    d.save('fractions')


def decimals():
    d = Diagram()
    for x, label, color in [(230, 'Unités', INK), (507, 'Dixièmes', GIVEN),
                            (689, 'Centièmes', RESULT)]:
        d.text(x, 27, label, 35, color)
    for (x1, x2), fill, color in [((320, 414), BLUE_FILL, STEP),
                                  ((430, 585), AMBER_FILL, GIVEN),
                                  ((605, 773), GREEN_FILL, RESULT)]:
        d.box((x1, 48, x2, 240), color, fill, width=2)
    for y, digits in [(77, '120'), (133, '035'), (207, '155')]:
        for x, num, color in zip((230, 507, 689), digits, (INK, GIVEN, RESULT)):
            d.text(x, y, num, 52, color)
        d.text(366, y, ',', 52, STEP)
    d.text(142, 133, '+', 45)
    d.line((134, 170), (785, 170))
    d.text(850, 150, 'Virgule', 33, STEP)
    d.save('decimaux')


def rates():
    d = Diagram()
    for x, quantity, price, color, fill in [(156, '2 jus', '6 CHF', GIVEN, AMBER_FILL),
                                            (460, '1 jus', '3 CHF', STEP, BLUE_FILL),
                                            (765, '4 jus', '12 CHF', RESULT, GREEN_FILL)]:
        d.box((x - 100, 59, x + 100, 206), color, fill)
        d.text(x, 96, quantity, 40, color)
        d.line((x - 69, 119), (x + 69, 119), color=color, width=2)
        d.text(x, 160, price, 48, color)
    for x, sign, color in [(309, '÷ 2', STEP), (615, '× 4', RESULT)]:
        d.text(x, 81, sign, 38, color)
        d.arrow((x - 36, 113), (x + 36, 113), color)
    d.text(460, 230, 'Prix pour un jus', 32, STEP)
    d.text(765, 230, 'Prix total', 32, RESULT)
    d.save('proportionnalite')

    d = Diagram()
    start_x, start_y, cell = 115, 22, 21
    d.draw.rectangle((start_x, start_y, start_x + 5 * cell, start_y + 5 * cell), fill=GREEN_FILL)
    for x in range(11):
        d.line((start_x + x * cell, start_y), (start_x + x * cell, start_y + 10 * cell), color=GRID, width=2)
    for y in range(11):
        d.line((start_x, start_y + y * cell), (start_x + 10 * cell, start_y + y * cell), color=GRID, width=2)
    d.draw.rectangle((start_x, start_y, start_x + 5 * cell, start_y + 5 * cell), outline=RESULT, width=4)
    for i in range(5):
        for j in range(5):
            x, y = start_x + i * cell, start_y + j * cell
            d.line((x + 4, y + 16), (x + 16, y + 4), color=RESULT, width=2)
    d.line((322, 130), (419, 130), color=GIVEN)
    d.line((224, 72), (419, 72), color=RESULT)
    d.text(448, 68, '25 % = 25 cases', 49, RESULT, 'lm')
    d.text(448, 133, '100 % = la grille entière', 40, GIVEN, 'lm')
    d.save('pourcentage')


def exponent():
    d = Diagram()
    for column in range(3):
        for row in range(3):
            x, y = 113 + column * 59, 35 + row * 59
            d.draw.rectangle((x, y, x + 59, y + 59), fill=BLUE_FILL, outline=STEP, width=3)
    d.text(201, 236, '3 carreaux', 34, STEP)
    d.arrow((316, 98), (410, 98))
    d.text(640, 75, 'Carré : 3² = 9', 52, STEP)
    d.text(574, 176, 'Racine carrée', 45, RESULT)
    d.line((712, 176), (722, 176), (731, 188), (746, 150), (780, 150), color=RESULT, width=4)
    d.text(766, 172, '9', 46, RESULT)
    d.text(832, 172, '= 3', 46, RESULT)
    d.save('puissances')


def algebra_examples():
    d = Diagram()
    d.text(125, 70, 'x = 4', 48, STEP)
    d.text(347, 70, '2x + 3', 56)
    d.arrow((355, 107), (355, 148))
    d.text(321, 191, '2 ×', 52)
    d.tag(425, 191, '4', STEP, size=54, fill=BLUE_FILL)
    d.text(542, 191, '+ 3 =', 52)
    d.tag(691, 191, '11', RESULT, size=53, fill=GREEN_FILL)
    d.text(780, 190, 'Résultat', 34, RESULT, 'lm')
    d.save('expressions')

    d = Diagram()
    for x, title, calculation, color, fill in [(154, 'Entrée x', '3', GIVEN, AMBER_FILL),
                                              (459, 'Règle', '× 2 puis + 1', STEP, BLUE_FILL),
                                              (763, 'Résultat y', '7', RESULT, GREEN_FILL)]:
        d.box((x - 121, 43, x + 121, 203), color, fill)
        d.text(x, 81, title, 37, color)
        d.text(x, 147, calculation, 53 if x != 459 else 43, color)
    d.arrow((280, 133), (332, 133))
    d.arrow((585, 133), (638, 133), RESULT)
    d.save('fonctions')

    d = Diagram()
    at = d.grid(130, 209, 4, 9, 20)
    d.arrow(at(0, 0), at(5, 0), INK)
    d.arrow(at(0, 0), at(0, 10), INK)
    d.line(at(0, 1), at(4, 9), color=STEP, width=4)
    point = at(3, 7)
    d.line(at(3, 0), point, color=GIVEN, width=3)
    d.line(at(0, 7), point, color=RESULT, width=3)
    d.point(*point, RESULT)
    d.text(*at(3, -1.3), '3', 33, GIVEN)
    d.text(*at(-0.9, 7), '7', 33, RESULT)
    d.text(*at(5.5, 0), 'x', 35)
    d.text(106, 24, 'y', 34)
    d.text(575, 59, 'Règle : y = 2x + 1', 46, STEP)
    d.text(570, 128, 'Entrée x = 3', 42, GIVEN)
    d.tag(569, 204, 'Résultat y = 7', RESULT, size=44, fill=GREEN_FILL)
    d.save('fonction-graphique')

    d = Diagram()
    d.text(358, 43, 'x + 3', 56, GIVEN)
    d.text(462, 43, '=', 51)
    d.text(565, 43, '8', 56)
    for x in (358, 565):
        d.arrow((x, 81), (x, 144))
    d.text(333, 115, '− 3', 38, STEP, 'rm')
    d.text(610, 115, '− 3', 38, STEP, 'lm')
    d.text(45, 118, 'Même opération', 31, STEP, 'lm')
    d.tag(459, 201, 'x = 5', RESULT, size=53, fill=GREEN_FILL)
    d.text(642, 201, 'Solution', 39, RESULT, 'lm')
    d.save('equations')


def shapes():
    d = Diagram()
    d.draw.rectangle((163, 42, 331, 210), fill=BLUE_FILL, outline=INK, width=3)
    d.line((163, 42), (331, 42), color=STEP, width=6)
    d.line((251, 42), (498, 42), color=STEP)
    d.text(516, 42, 'Côté', 44, STEP, 'lm')
    d.point(331, 210, GIVEN, radius=8)
    d.line((342, 210), (498, 210), color=GIVEN)
    d.text(516, 209, 'Sommet', 43, GIVEN, 'lm')
    d.line((163, 187), (185, 187), (185, 210), color=RESULT, width=4)
    d.arrow((478, 144), (189, 194), RESULT)
    d.text(517, 142, 'Angle droit', 43, RESULT, 'lm')
    d.save('figures')

    d = Diagram()
    for y in (103, 170):
        d.line((105, y), (379, y), color=STEP, width=5)
    for x in (178, 296):
        d.arrow((x, 108), (x, 160))
    d.line((570, 141), (807, 141), color=RESULT, width=5)
    d.line((683, 68), (683, 206), color=RESULT, width=5)
    d.line((683, 115), (708, 115), (708, 141), color=RESULT, width=3)
    d.text(243, 38, 'Parallèles', 46, STEP)
    d.text(685, 38, 'Perpendiculaires', 44, RESULT)
    d.save('droites')


def measures():
    d = Diagram()
    d.tag(154, 123, '2 m', GIVEN, size=57, fill=AMBER_FILL)
    d.tag(765, 123, '200 cm', RESULT, size=57, fill=GREEN_FILL)
    d.arrow((287, 83), (646, 83))
    d.text(464, 44, '× 100', 47, STEP)
    d.arrow((646, 164), (287, 164), STEP)
    d.text(464, 213, '÷ 100', 47, STEP)
    d.save('conversions')

    d = Diagram()
    start, tick = 98, 87
    d.box((start - 24, 106, start + 8 * tick + 26, 182), STEP, BLUE_FILL)
    for i in range(81):
        x = start + i * tick / 10
        d.line((x, 108), (x, 130 if i % 10 == 0 else 117), color=INK, width=2)
        if i % 10 == 0:
            d.text(x, 152, i // 10, 30)
    start_point, end_point = start + 2 * tick, start + 7 * tick
    d.line((start_point, 89), (end_point, 89), color=RESULT, width=6)
    for x, color in [(start_point, GIVEN), (end_point, STEP)]:
        d.point(x, 89, color, radius=7)
        d.line((x, 94), (x, 123), color=color)
    d.text(start_point, 42, 'Départ : 2 cm', 35, GIVEN)
    d.text(end_point, 42, 'Arrivée : 7 cm', 35, STEP)
    d.text(459, 225, 'Longueur : 7 − 2 = 5 cm', 43, RESULT)
    d.save('regle')


def surfaces(area):
    d = Diagram()
    x0, y0, unit = 118, 44, 60
    x1, y1 = x0 + 5 * unit, y0 + 3 * unit
    d.draw.rectangle((x0, y0, x1, y1), fill=GREEN_FILL if area else 'white',
                     outline=RESULT if area else STEP, width=5)
    if area:
        for x in range(1, 5):
            d.line((x0 + x * unit, y0), (x0 + x * unit, y1), color=RESULT, width=2)
        for y in range(1, 3):
            d.line((x0, y0 + y * unit), (x1, y0 + y * unit), color=RESULT, width=2)
        for x in range(5):
            for y in range(3):
                a, b = x0 + x * unit, y0 + y * unit
                d.line((a + 14, b + 48), (a + 48, b + 14), color=RESULT, width=2)
        d.text(548, 73, '3 rangées de 5', 41, STEP, 'lm')
        d.tag(697, 167, 'Aire : 15 cm²', RESULT, size=46, fill=GREEN_FILL)
    else:
        d.text(269, 23, '5 cm', 33, GIVEN)
        d.text(70, 131, '3 cm', 33, GIVEN)
        d.arrow((x0 + 24, y0), (x1 - 15, y0))
        d.arrow((x1, y0 + 27), (x1, y1 - 16))
        d.arrow((x1 - 21, y1), (x0 + 17, y1))
        d.arrow((x0, y1 - 24), (x0, y0 + 16))
        d.text(690, 74, 'Périmètre', 43, STEP)
        d.text(689, 128, '5 + 3 + 5 + 3', 42)
        d.tag(691, 195, '16 cm', RESULT, size=48, fill=GREEN_FILL)
    d.save('aires' if area else 'perimetres')


def cubes():
    d = Diagram()
    for stage, x0 in enumerate((132, 474), 1):
        def point(x, y, z):
            return x0 + x * 49 - y * 25, 105 + y * 18 - z * 32 + x * 4

        d.text(x0 + 40, 32, f'Couche {stage}', 37, STEP)
        top = [point(0, 0, 1), point(3, 0, 1), point(3, 2, 1), point(0, 2, 1)]
        front = [point(0, 2, 0), point(3, 2, 0), point(3, 2, 1), point(0, 2, 1)]
        side = [point(3, 0, 0), point(3, 2, 0), point(3, 2, 1), point(3, 0, 1)]
        d.polygon(side, STEP, '#CCDCEF')
        d.polygon(front, STEP, '#D6E5F4')
        d.polygon(top, STEP, BLUE_FILL)
        for x in (1, 2):
            d.line(point(x, 0, 1), point(x, 2, 1), point(x, 2, 0), color=STEP)
        d.line(point(0, 1, 1), point(3, 1, 1), point(3, 1, 0), color=STEP)
        d.text(x0 + 45, 175, '6 cubes', 36, STEP)
    d.text(352, 107, '+', 54)
    d.tag(729, 204, 'Volume : 12 cm³', RESULT, size=40, fill=GREEN_FILL)
    d.save('volumes')


def coordinates():
    d = Diagram()
    at = d.grid(175, 221, 7, 4, 45)
    d.arrow(at(0, 0), (515, 221), INK)
    d.arrow(at(0, 0), (175, 23), INK)
    d.point(*at(0, 0), GIVEN)
    d.text(149, 221, 'O', 35, GIVEN)
    d.arrow(at(0, 0), at(3, 0), STEP)
    d.arrow(at(3, 0), at(3, 2), RESULT)
    d.point(*at(3, 2), RESULT)
    d.text(327, 117, 'A', 37, RESULT, 'lm')
    d.text(244, 241, '3', 31, STEP)
    d.text(286, 170, '2', 31, RESULT)
    d.text(684, 78, 'Abscisse : 3', 43, STEP)
    d.text(684, 146, 'Ordonnée : 2', 43, RESULT)
    d.tag(683, 216, 'A (3 ; 2)', RESULT, size=42, fill=GREEN_FILL)
    d.save('reperage')


def transformations():
    scenes = (
        ('translation', [(1, 1), (1, 3), (2, 1)], [(4, 2), (4, 4), (5, 2)], None,
         '3 cases à droite', '1 case vers le haut'),
        ('rotation', [(2, 3), (2, 4), (3, 4)], [(4, 5), (5, 5), (5, 4)], (4, 3),
         'Sens du tour', '90°'),
        ('symetrie-axiale', [(1, 2), (1, 4), (2, 4)], [(7, 2), (7, 4), (6, 4)], None,
         '3 cases de chaque côté', 'Axe'),
        ('symetrie-centrale', [(2, 2), (2, 4), (3, 3)], [(6, 4), (6, 2), (5, 3)], (4, 3),
         'Même distance', 'O est au milieu'),
        ('agrandissement', [(1, 1), (3, 1), (3, 2)], [(5, 1), (9, 1), (9, 3)], None,
         'Facteur × 2', '2 cases puis 4 cases'),
    )
    for name, original, image, center, line1, line2 in scenes:
        d = Diagram()
        at = d.grid(180, 225, 10, 6, 32)
        d.polygon([at(*point) for point in original], GIVEN, AMBER_FILL)
        d.polygon([at(*point) for point in image], RESULT, GREEN_FILL)
        point_a, point_b = at(*original[0]), at(*image[0])
        if name == 'translation':
            turn = at(4, 1)
            d.arrow(point_a, turn)
            d.arrow(turn, point_b)
        elif name == 'rotation':
            cx, cy = at(*center)
            radius = 64
            d.line(point_a, (cx, cy), point_b, color=GRID)
            d.draw.arc((cx - radius, cy - radius, cx + radius, cy + radius),
                       start=180, end=270, fill=STEP, width=4)
            d.draw.polygon([point_b, (point_b[0] - 13, point_b[1] - 7),
                            (point_b[0] - 13, point_b[1] + 7)], fill=STEP)
        elif name == 'symetrie-axiale':
            d.line(point_a, point_b, color=STEP)
            d.line(at(4, 0), at(4, 6), color=STEP, width=5)
            d.text(*at(4, -0.55), 'Axe', 27, STEP)
        elif name == 'symetrie-centrale':
            d.line(point_a, point_b, color=STEP)
        if center:
            cx, cy = at(*center)
            center_color = GIVEN if name == 'rotation' else STEP
            d.point(cx, cy, center_color, open_point=True)
            d.text(cx + 15, cy + 13, 'O', 28, center_color)
        d.point(*point_a, GIVEN)
        d.point(*point_b, RESULT, open_point=True)
        if name != 'agrandissement':
            d.text(point_a[0] - 13, point_a[1] + 13, 'A', 29, GIVEN)
            label_offset_y = 18 if name == 'translation' else -13
            d.text(point_b[0] + 16, point_b[1] + label_offset_y, 'A’', 29, RESULT)
        d.text(700, 64, line1, 37, STEP)
        d.text(678, 119, line2, 35, STEP)
        d.text(30, 124, 'Départ', 35, GIVEN, 'lm')
        d.text(680, 206, 'Figure obtenue', 37, RESULT)
        d.point(535, 206, RESULT, open_point=True)
        d.save(name)


def place_table(name, labels, rows, notes, *, highlight=(), operator='', operator_row=1, plus_row=-1, rules=()):
    d = Diagram()
    xs = [145 + 135 * i for i in range(len(labels))]
    for x, label in zip(xs, labels):
        if label:
            d.text(x, 24, label, 29, STEP)
    left, right = xs[0] - 57, xs[-1] + 57
    for x in xs[:-1]:
        d.line((x + 67, 48), (x + 67, 250), color=GRID, width=2)
    step = 39 if len(rows) >= 5 else 49
    for row, (values, role) in enumerate(rows):
        y = 58 + row * step if len(rows) >= 5 else 73 + row * step
        if row in rules:
            d.line((left - 18, y - 23), (right, y - 23), width=2)
        if row == operator_row and operator:
            d.text(left - 33, y, operator, 33)
        if row == plus_row:
            d.text(left - 33, y, '+', 33)
        for col, (x, value) in enumerate(zip(xs, values)):
            if (row, col) in highlight:
                d.box((x - 33, y - 19, x + 33, y + 19), role, BLUE_FILL)
            d.text(x, y, value, 35, role)
    for i, (message, role) in enumerate(notes):
        d.text(588, 67 + i * 54, message, 30 if len(message) < 19 else 25, role, 'lm')
    d.save(name)


def arithmetic_supplements():
    places = ('Centaines', 'Dizaines', 'Unités')
    place_table('numeration-zero', places, [('406', INK), (('', 0, ''), STEP)],
                [('Colonne vide', STEP), ('406 = 400 + 6', RESULT)], highlight=((0, 1),))
    place_table('numeration-comparer', places, [('406', GIVEN), ('460', GIVEN)],
                [('0 dizaine < 6 dizaines', STEP), ('406 < 460', RESULT)], highlight=((0, 1), (1, 1)))
    place_table('soustraction-zero', places, [((2, 9, 12), STEP), ('302', INK), (' 67', INK), ('235', RESULT)],
                [('2 centaines', STEP), ('9 dizaines', STEP), ('12 unités', STEP)], operator='−', operator_row=2, rules=(3,))
    place_table('multiplication-colonne', places, [(' 2 ', STEP), (' 27', INK), ('  4', INK), ('108', RESULT)],
                [('Retenue : 2', STEP), ('7 × 4 = 28', INK), ('Produit : 108', RESULT)], highlight=((0, 1),), operator='×', operator_row=2, rules=(3,))
    place_table('multiplication-deux-chiffres', places, [(' 23', INK), (' 14', INK), (' 92', STEP), ('230', GIVEN), ('322', RESULT)],
                [('23 × 4 = 92', STEP), ('23 × 10 = 230', GIVEN), ('92 + 230 = 322', RESULT)], operator='×', plus_row=3, rules=(2, 4))
    decimals = ('Unités', 'Dixièmes', 'Centièmes')
    place_table('decimaux-comparer', decimals, [(('3,', '8', '0'), GIVEN), (('3,', '7', '5'), GIVEN)],
                [('8 dixièmes > 7 dixièmes', STEP), ('3,80 > 3,75', RESULT)], highlight=((0, 1), (1, 1)))
    place_table('decimaux-soustraction', decimals, [(('4,', '8', '0'), INK), (('1,', '2', '5'), INK), (('3,', '5', '5'), RESULT)],
                [('Virgules alignées', STEP), ('4,80 − 1,25 = 3,55', RESULT)], operator='−', rules=(2,))
    place_table('decimaux-produit', ('', 'Unités', 'Dixièmes'), [(('', '2,', '4'), GIVEN), (('', '3', ''), INK), (('', '7,', '2'), RESULT)],
                [('24 dixièmes × 3', STEP), ('72 dixièmes', STEP), ('7,2', RESULT)], operator='×', rules=(2,))


def division_work(name, dividend, divisor, quotient, working, notes, focus=None):
    d = Diagram()
    for value, y, color in [(dividend, 31, GIVEN), *working]:
        d.text(316, y, value, 34, color, 'rm')
        if str(value).startswith('−'):
            d.line((218, y + 20), (321, y + 20), color=GRID, width=2)
    d.line((341, 12), (341, 237), color=INK)
    d.line((342, 55), (501, 55), color=INK)
    d.text(419, 31, divisor, 33, GIVEN)
    d.tag(419, 96, quotient, RESULT, 38, GREEN_FILL)
    if focus is not None:
        width = lambda text: d.draw.textlength(text, font=font(38))
        center = 419 - width(quotient) / 2 + width(quotient[:focus]) + width(quotient[focus]) / 2
        d.draw.ellipse((center - 13, 78, center + 13, 114), outline=STEP, width=2)
    for index, (text, color) in enumerate(notes):
        d.text(559, 50 + index * 57, text, 30, color, 'lm')
    d.save(name)


def division_supplements():
    division_work('division-posee', '85', 4, '21',
                  [('−8  ', 73, STEP), ('5', 122, INK), ('−4', 164, STEP), ('1', 216, RESULT)],
                  [('Deux fois 4 dans 8', STEP), ('Une fois 4 dans 5', STEP), ('Reste : 1', RESULT)])
    division_work('division-zero-quotient', '816', 4, '204',
                  [('−8    ', 69, STEP), ('1  ', 112, STEP), ('16', 154, INK), ('−16', 188, STEP), ('0', 228, RESULT)],
                  [('8 ÷ 4 donne 2', STEP), ('Dans 1, zéro fois 4', STEP), ('16 ÷ 4 donne 4', RESULT)], focus=1)
    division_work('decimaux-quotient', '7,5', 3, '2,5',
                  [('−6  ', 73, STEP), ('15', 122, INK), ('−15', 164, STEP), ('0', 216, RESULT)],
                  [('Il reste 1 unité', STEP), ('1 unité et 5 dixièmes', INK), ('15 dixièmes ÷ 3', RESULT)], focus=1)
    d = Diagram()
    for x, top, bottom in [(255, '7,5', '75'), (635, '0,3', '3')]:
        d.tag(x, 47, top, GIVEN, 42, AMBER_FILL)
        d.arrow((x, 82), (x, 151))
        d.text(x + 90, 117, '× 10', 36, STEP)
        d.tag(x, 197, bottom, RESULT, 42, GREEN_FILL)
    d.text(443, 47, '÷', 40)
    d.text(443, 197, '÷', 40)
    d.save('decimaux-diviseur')


def supplemental_number_line(name, left_label, right_label, target, target_label, middle=None):
    d = Diagram()
    x = lambda i: 100 + i * 72
    d.arrow((x(0), 145), (846, 145), INK)
    for i in range(11):
        d.line((x(i), 129), (x(i), 161), color=INK if i in (0, 5, 10) else GRID)
    for i, label in ((0, left_label), (10, right_label)):
        d.text(x(i), 192, label, 39)
    if middle:
        d.text(x(5), 192, middle, 34, STEP)
    d.tag(x(target), 42, target_label, RESULT, 37, GREEN_FILL)
    d.arrow((x(target), 76), (x(target), 129), RESULT)
    d.save(name)


def shapes_supplements():
    d = Diagram()
    d.polygon([(68, 173), (178, 41), (291, 173)], GIVEN, AMBER_FILL)
    d.polygon([(342, 51), (549, 51), (549, 178), (342, 178)], STEP, BLUE_FILL)
    d.line((342, 73), (364, 73), (364, 51), color=STEP)
    d.polygon([(737, 24), (818, 105), (737, 186), (656, 105)], RESULT, GREEN_FILL)
    d.line((723, 38), (737, 52), (751, 38), color=RESULT)
    for x, label, tone in [(178, 'Triangle', GIVEN), (446, 'Rectangle', STEP), (737, 'Carré tourné', RESULT)]:
        d.text(x, 223, label, 34, tone)
    d.save('figures-classer')

    d = Diagram()
    for x, degrees, name, tone in [(150, 45, 'Aigu', GIVEN), (455, 90, 'Droit', STEP), (773, 120, 'Obtus', RESULT)]:
        center = (x, 166)
        angle = radians(degrees)
        d.line((x + 94, 166), center, (x + 95 * cos(angle), 166 - 95 * sin(angle)), color=tone, width=4)
        if degrees == 90:
            d.line((x, 142), (x + 24, 142), (x + 24, 166), color=tone)
        else:
            d.draw.arc((x - 42, 124, x + 42, 208), 360 - degrees, 360, fill=tone, width=3)
        d.text(x + 25, 205, f'{degrees}°', 33, tone)
        d.text(x + 25, 239, name, 33, tone)
    d.save('figures-angles')


def measured_strip(name, sections, total):
    d = Diagram()
    left, width = 90, 740
    amount = sum(value for value, _ in sections)
    x = left
    for i, (value, label) in enumerate(sections):
        length = width * value / amount
        color, fill = (GIVEN, AMBER_FILL) if i < len(sections) - 1 else (STEP, BLUE_FILL)
        d.draw.rectangle((x, 89, x + length, 151), fill=fill, outline=color, width=3)
        d.text(x + length / 2, 55, label, 34, color)
        x += length
    d.line((left, 185), (left, 202), (left + width, 202), (left + width, 185), color=RESULT)
    d.text(460, 233, total, 35, RESULT)
    d.save(name)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    place_value()
    column_operation(subtract=False)
    column_operation(subtract=True)
    number_line(relative=False)
    number_line(relative=True)
    trays(divide=False)
    trays(divide=True)
    problems()
    multiples()
    fractions()
    decimals()
    rates()
    exponent()
    algebra_examples()
    shapes()
    measures()
    surfaces(area=False)
    surfaces(area=True)
    cubes()
    coordinates()
    transformations()
    arithmetic_supplements()
    division_supplements()
    supplemental_number_line('arrondi-centaine', '300', '400', 8.2, '382', '350')
    supplemental_number_line('decimaux-droite', '2', '3', 4, '2,4')
    shapes_supplements()
    measured_strip('mesures-melangees', [(10, '10 mm'), (10, '10 mm'), (10, '10 mm'), (4, '4 mm')], '34 mm')
    measured_strip('mesures-temps', [(60, '1 heure = 60 minutes'), (15, '15 minutes')], '75 minutes')


if __name__ == '__main__':
    main()
