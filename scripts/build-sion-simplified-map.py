"""Produit les deux fonds annotés de Sion pour la fiche de repérage."""

from math import cos, hypot, radians, sin
from pathlib import Path

from PIL import Image, ImageDraw


WIDTH, HEIGHT = 1200, 800
SUPERSAMPLING = 2
MEDIA = Path(__file__).resolve().parents[1] / 'src/math/media/spatial'

# Les tracés repèrent les axes sur l'emprise de la photo SWISSIMAGE, en pixels.
# Les petits bâtiments sont regroupés en blocs pour dégager les rues.
STREETS = (
    ((-16, 395), (104, 352), (212, 312), (330, 268), (406, 252), (437, 216)),
    ((290, -15), (303, 104), (319, 218), (330, 268), (327, 369), (321, 491),
     (327, 589), (336, 650), (347, 742), (351, 818)),
    ((-10, 162), (43, 229), (88, 279), (102, 298), (113, 334), (129, 365),
     (180, 409), (214, 438), (255, 440), (287, 452), (321, 479)),
    ((107, -16), (126, 58), (132, 141), (115, 223), (102, 298)),
    ((421, -16), (383, 58), (361, 98), (349, 169), (330, 267)),
    ((514, -10), (476, 33), (432, 66), (399, 104), (413, 154), (421, 211),
     (430, 262), (446, 332), (460, 390)),
    ((-15, 529), (66, 509), (130, 491), (185, 469), (214, 438)),
    ((81, 395), (87, 453), (105, 516), (119, 569), (132, 615), (139, 648)),
    ((-15, 743), (84, 701), (135, 671), (225, 633), (322, 596), (366, 579)),
    ((-15, 814), (111, 754), (197, 714), (263, 684), (336, 650), (387, 637),
     (422, 622), (452, 592), (478, 563)),
    ((216, 440), (223, 493), (213, 555), (213, 594), (225, 633)),
    ((327, 529), (363, 542), (403, 521), (443, 492), (486, 456), (535, 423),
     (583, 401), (622, 390), (674, 376)),
    ((363, 542), (388, 565), (418, 592), (411, 646), (418, 689), (472, 731),
     (509, 766), (558, 818)),
    ((502, 816), (591, 798), (691, 775), (781, 757), (893, 748), (1013, 742),
     (1074, 720), (1094, 677), (1111, 635), (1149, 593), (1194, 570), (1218, 569)),
    ((1127, 817), (1156, 757), (1184, 700), (1212, 668)),
)

WALKING_PATHS = (
    ((456, 391), (500, 354), (556, 339), (615, 319), (647, 296), (669, 258),
     (699, 217), (747, 202), (780, 172), (827, 151), (879, 145), (926, 153), (958, 173)),
    ((674, 376), (686, 402), (714, 416), (749, 418), (762, 443), (777, 460),
     (767, 475), (782, 494), (752, 504), (710, 520), (681, 547), (697, 571)),
    ((478, 563), (517, 538), (562, 511), (607, 497), (665, 475), (716, 465),
     (750, 456), (774, 463), (801, 467), (857, 446), (920, 434), (964, 405),
     (1001, 401), (1055, 410)),
    ((520, 561), (552, 577), (597, 590), (636, 599), (672, 586), (697, 571)),
)

# Centres, dimensions et orientation de blocs conservant la trame du quartier.
BUILDINGS = (
    (17, 51, 83, 37, -15), (25, 125, 67, 38, -14), (84, 165, 44, 28, -20),
    (157, 151, 60, 27, -15), (175, 105, 44, 22, -23), (215, 171, 37, 28, -14),
    (268, 216, 57, 29, -16), (267, 269, 67, 31, -17), (250, 89, 58, 34, -10),
    (322, 21, 21, 74, -5), (380, 17, 54, 33, -36), (480, 66, 46, 28, -32),
    (377, 157, 42, 59, 10), (366, 221, 36, 36, -7), (455, 191, 32, 31, -6),
    (489, 279, 30, 60, 0), (405, 314, 46, 66, -15), (357, 349, 42, 75, 0),
    (292, 334, 46, 42, -15), (266, 376, 41, 38, -20), (276, 412, 33, 22, -31),
    (151, 283, 45, 25, -23), (195, 250, 30, 66, -25), (55, 413, 46, 36, -21),
    (150, 379, 32, 22, -37), (182, 415, 44, 28, -29), (166, 453, 39, 24, -30),
    (268, 475, 49, 28, -25), (278, 514, 42, 29, -28), (275, 555, 54, 29, -22),
    (277, 608, 49, 31, -24), (284, 650, 48, 22, -26), (297, 737, 30, 66, 14),
    (56, 555, 59, 45, -16), (94, 599, 43, 32, -20), (93, 646, 36, 22, -16),
    (175, 581, 37, 27, -13), (158, 626, 30, 27, -20), (179, 691, 60, 27, -20),
    (244, 718, 32, 39, -22), (164, 755, 52, 26, -24), (70, 745, 54, 32, -24),
    (372, 410, 45, 35, -20), (372, 473, 53, 34, -20), (397, 491, 30, 23, -34),
    (390, 537, 49, 27, -25), (365, 580, 39, 32, -19), (364, 625, 36, 27, -23),
    (404, 566, 43, 31, -36), (443, 536, 43, 28, -35), (447, 618, 39, 35, -36),
    (476, 660, 46, 31, -36), (480, 699, 35, 35, -23), (427, 755, 46, 29, 40),
    (524, 387, 39, 23, -27), (554, 360, 38, 26, -12), (576, 429, 46, 30, -25),
    (628, 427, 38, 23, -27), (655, 402, 30, 21, -18), (714, 379, 48, 25, -11),
    (736, 493, 36, 21, -14), (787, 429, 18, 17, 0), (746, 562, 35, 24, -22),
    (534, 736, 65, 38, -18), (602, 706, 57, 29, -20), (655, 762, 63, 34, -26),
    (773, 701, 50, 26, -8), (842, 705, 62, 36, -8), (891, 709, 34, 30, -5),
    (963, 660, 42, 27, -16), (1004, 656, 32, 25, -17), (1052, 678, 37, 35, -17),
    (1039, 781, 73, 33, -4), (1111, 764, 34, 27, -15),
)

# Quatre lieux dont le repère est imprimé par-dessus le fond.
LANDMARK_BUILDINGS = (
    (176, 588, 33, 31, -14), (331, 558, 33, 24, -23),
    (698, 572, 45, 31, -25), (956, 175, 69, 43, 8),
)


def scaled(points):
    return [(round(x * SUPERSAMPLING), round(y * SUPERSAMPLING)) for x, y in points]


def building(draw, x, y, width, height, angle, major=False):
    c, s = cos(radians(angle)), sin(radians(angle))
    corners = ((-width / 2, -height / 2), (width / 2, -height / 2),
               (width / 2, height / 2), (-width / 2, height / 2))
    points = scaled((x + dx * c - dy * s, y + dx * s + dy * c) for dx, dy in corners)
    draw.polygon(points, fill=255 if major else 24, outline=0, width=5 * SUPERSAMPLING if major else SUPERSAMPLING)


def trace(drawing, points, shade, width):
    drawing.line(scaled(points), fill=shade, width=width * SUPERSAMPLING, joint='curve')


def trace_path(drawing, points, shade=0, width=4):
    drawn, remaining = True, 15.0
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        length = hypot(x2 - x1, y2 - y1)
        along = 0.0
        while along < length:
            end = min(length, along + remaining)
            if drawn:
                trace(drawing, ((x1 + (x2 - x1) * along / length, y1 + (y2 - y1) * along / length),
                                (x1 + (x2 - x1) * end / length, y1 + (y2 - y1) * end / length)), shade, width)
            remaining -= end - along
            if remaining < 0.01:
                drawn = not drawn
                remaining = 15.0 if drawn else 9.0
            along = end


def simplified_plan():
    image = Image.new('L', (WIDTH * SUPERSAMPLING, HEIGHT * SUPERSAMPLING), 255)
    draw = ImageDraw.Draw(image)
    for block in BUILDINGS:
        building(draw, *block)
    for route in STREETS:
        trace(draw, route, 0, 17)
    for route in STREETS:
        trace(draw, route, 255, 11)
    for path in WALKING_PATHS:
        trace_path(draw, path)
    for block in LANDMARK_BUILDINGS:
        building(draw, *block, major=True)
    image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(MEDIA / 'sion-plan-simplifie.png', optimize=True)


def annotated_photo():
    photo = Image.open(MEDIA / 'sion-swissimage.webp').convert('RGB')
    image = photo.resize((WIDTH * SUPERSAMPLING, HEIGHT * SUPERSAMPLING), Image.Resampling.BICUBIC)
    draw = ImageDraw.Draw(image)
    for route in STREETS:
        trace(draw, route, '#302b24', 11)
    for route in STREETS:
        trace(draw, route, '#fff9e9', 5)
    for path in WALKING_PATHS:
        trace_path(draw, path, '#302b24', 9)
        trace_path(draw, path, '#ffd36d', 4)
    image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(MEDIA / 'sion-photo-chemins.webp', quality=87, method=6)


if __name__ == '__main__':
    simplified_plan()
    annotated_photo()
