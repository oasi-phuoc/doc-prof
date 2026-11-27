from PIL import Image, ImageDraw, ImageFont
from functools import lru_cache
from pathlib import Path
from math import atan2, cos, sin, pi
import os
import re

INK = '#203751'
PALE = '#e8eff5'
WHITE = '#ffffff'
BLUE = '#5fadd1'
DARK_BLUE = '#326e98'
WOOD = '#e4ac64'
GOLD = '#f4c468'
TEAL = '#79bea9'
RED = '#dd6a5e'
GRAY = '#a8bdc9'
TINTS = ['#ebf4fb','#eff6f1','#fff6e9','#edf4f9','#eaf6f3','#eef2fd','#f7f2e8','#edf4fa','#f1eff8']
FONTDIR = Path(os.getenv('GLOSSAIRE_FONTS', '/usr/share/fonts/truetype/dejavu'))

@lru_cache(maxsize=None)
def font(size, strong=False):
    return ImageFont.truetype(str(FONTDIR / ('DejaVuSans-Bold.ttf' if strong else 'DejaVuSans.ttf')), size)

def rectangle(d, bounds, fill=PALE, radius=5, outline=INK, width=2):
    d.rounded_rectangle(bounds, radius=radius, fill=fill, outline=outline, width=width)

def polygon(d, points, fill=PALE, edge=INK, width=3):
    d.polygon(points, fill)
    if edge:
        d.line(points+[points[0]], fill=edge, width=width, joint='curve')

def line(d, *points, fill=INK, width=3):
    d.line(points, fill=fill, width=width, joint='curve')

def ellipse(d, bounds, fill=WHITE, outline=INK, width=2):
    d.ellipse(bounds, fill=fill, outline=outline, width=width)

def arrow(d, x1, y1, x2, y2, fill=DARK_BLUE, width=5, head=12):
    angle = atan2(y2-y1, x2-x1)
    line(d, (x1,y1), (x2,y2), fill=fill, width=width)
    polygon(d, [(x2,y2), (x2-head*cos(angle-.55),y2-head*sin(angle-.55)), (x2-head*cos(angle+.55),y2-head*sin(angle+.55))], fill, None)

def label(d, pos, text, size=18, color=INK, strong=True, anchor='mm'):
    d.text(pos,text,font=font(size,strong),fill=color,anchor=anchor,stroke_width=0)

def carton(d,x=13,y=19,u=74,v=61):
    p=lambda a,b:(x+u*a/100,y+v*b/100)
    polygon(d, [p(0,25),p(50,0),p(100,24),p(100,73),p(49,100),p(0,74)], WOOD)
    polygon(d, [p(0,25),p(50,0),p(100,24),p(49,50)], '#f3cc91')
    polygon(d, [p(49,50),p(100,24),p(100,73),p(49,100)], '#d68a4b')
    line(d,p(20,15),p(68,40),p(68,51),fill='#fff1cf',width=5)
    line(d,p(49,50),p(49,100),width=2)

def paper(d, marking=None):
    polygon(d, [(24,12),(64,12),(79,27),(79,88),(24,88)], WHITE)
    line(d,(64,12),(64,28),(79,28), width=2)
    if marking:
        label(d,(51,49),marking,14 if len(marking)<5 else 11,strong=True)
        line(d,(35,66),(66,66),fill=DARK_BLUE,width=3)
    else:
        for y,w in [(36,30),(47,33),(58,22),(70,32)]: line(d,(35,y),(35+w,y),fill=DARK_BLUE,width=3)

def shelf(d, boxes=True):
    for x in [14,87]: rectangle(d,(x,14,x+4,87),DARK_BLUE,1,None)
    for y in [40,64,85]: rectangle(d,(14,y,91,y+4),WOOD,1,INK,2)
    if boxes:
        for y in [22,46,66]:
            for x in [23,48,68]: rectangle(d,(x,y,x+15,y+15),GOLD if x==48 else WOOD,2)
    line(d,(7,90),(96,90),fill=GRAY,width=2)

def person(d,x=50,y=26,color=BLUE):
    ellipse(d,(x-10,y-9,x+10,y+10),'#f1c6a1')
    rectangle(d,(x-17,y+16,x+17,y+53),color,12)
    line(d,(x,y+32),(x,y+53),fill=INK,width=2)

@lru_cache(maxsize=None)
def icon(tag):
    name,_,mark=tag.partition(':')
    im=Image.new('RGBA',(104,104))
    d=ImageDraw.Draw(im)
    if name=='colis':
        carton(d)
    elif name=='palette':
        for x in [15,47,79]: rectangle(d,(x,64,x+12,76),WOOD,1)
        polygon(d,[(12,56),(66,38),(94,55),(38,74),(12,64)],WOOD)
        for x in [18,31,44,57]: line(d,(x,54-0.34*(x-18)),(x+26,69-0.34*(x-18)),fill=INK,width=2)
    elif name in ('bac','tri','palettebox'):
        polygon(d,[(16,40),(84,40),(75,81),(25,81)], TEAL if name=='tri' else BLUE)
        polygon(d,[(16,40),(26,29),(77,29),(84,40),(74,47),(27,47)], PALE)
        line(d,(34,53),(67,53),width=4)
        if name=='tri':
            arrow(d,29,21,66,21,fill='#32927d',width=4)
            arrow(d,67,22,67,35,fill='#32927d',width=4)
        elif name=='palettebox':
            rectangle(d,(22,81,80,88),WOOD,1)
    elif name=='pile':
        carton(d,12,46,38,37); carton(d,48,46,38,37); carton(d,30,15,41,37)
    elif name in ('rayon','rayonvide'):
        shelf(d,name=='rayon')
    elif name in ('depot','usine','maison'):
        polygon(d,[(12,45),(51,16),(91,45),(91,83),(12,83)], PALE if name!='maison' else '#f3e1cd')
        rectangle(d,(34,48,70,83),BLUE,2)
        if name=='maison':
            rectangle(d,(75,49,86,64),GOLD,2)
        elif name=='usine':
            rectangle(d,(73,19,85,44),WOOD,1)
            for y in [60,68,76]:line(d,(36,y),(68,y),fill=INK,width=2)
        else:
            for y in [55,63,71,79]:line(d,(36,y),(68,y),fill=INK,width=2)
    elif name in ('camion','wagon','train','bateau','avion'):
        if name=='camion':
            rectangle(d,(8,29,67,67),BLUE,3)
            polygon(d,[(68,40),(84,40),(94,55),(94,68),(68,68)],GOLD)
            rectangle(d,(74,43,83,55),WHITE,1)
        elif name in ('wagon','train'):
            rectangle(d,(9,35,93,70),DARK_BLUE if name=='train' else WOOD,6)
            if name=='train':
                for x in [18,38,58,78]:rectangle(d,(x,42,x+11,54),WHITE,1)
            line(d,(7,84),(96,84),width=3,fill=GRAY)
        elif name=='bateau':
            polygon(d,[(6,60),(94,60),(81,77),(20,77)],DARK_BLUE)
            for x,y in [(22,45),(39,45),(56,45),(39,30),(56,30)]:rectangle(d,(x,y,x+16,y+14),WOOD if x==39 else TEAL,1)
            line(d,(5,84),(22,81),(44,85),(69,81),(98,84),width=3,fill=BLUE)
        else:
            polygon(d,[(10,57),(51,47),(78,23),(87,24),(73,45),(93,43),(96,49),(75,59),(78,73),(70,75),(58,63),(29,68),(17,65)], '#d6e8f5')
        if name in ('camion','wagon','train'):
            for x in [24,56,81]:ellipse(d,(x-6,62,x+6,76),INK,INK)
    elif name=='chariot':
        rectangle(d,(9,61,63,77),GOLD,5)
        line(d,(36,60),(36,29),(57,29),(57,63),width=6)
        line(d,(67,27),(67,72),(96,72),width=5)
        carton(d,72,40,20,24)
        for x in [24,58]:ellipse(d,(x-6,73,x+6,85),INK)
    elif name=='diable':
        line(d,(22,20),(42,20),(56,75),(90,75),width=6)
        ellipse(d,(38,69,57,89),INK)
        carton(d,52,42,32,34)
    elif name in ('personne','groupe','epi'):
        if name=='groupe':
            person(d,25,35,TEAL); person(d,76,35,WOOD); person(d,50,25,BLUE)
        else:
            person(d,50,24)
            if name=='epi':
                polygon(d,[(37,24),(39,13),(51,9),(61,14),(65,23)],GOLD)
                line(d,(36,25),(67,25),width=3)
                polygon(d,[(39,42),(45,49),(55,49),(60,42),(64,70),(36,70)], GOLD)
                line(d,(40,59),(60,59),width=3,fill=WHITE)
    elif name=='document':
        paper(d,mark)
    elif name=='enveloppe':
        rectangle(d,(14,30,89,72),WHITE,4)
        line(d,(14,32),(51,57),(88,32),width=3)
        if mark: label(d,(51,64),mark,11)
    elif name in ('ecran','mobile','registre','grille','diapo','word','classeur'):
        if name=='mobile':
            rectangle(d,(30,12,72,87),INK,7)
            rectangle(d,(34,19,68,76),WHITE,3)
            if mark: label(d,(51,47),mark,13)
            else: line(d,(40,37),(62,37),(62,58),(40,58),(40,37),fill=DARK_BLUE)
            ellipse(d,(48,79,54,85),GRAY,None)
        elif name in ('registre','grille','word','classeur'):
            rectangle(d,(15,15,87,86),WHITE,3)
            rectangle(d,(15,15,87,27),TEAL if name=='grille' else DARK_BLUE,3)
            if name=='grille':
                for x in [38,61]: line(d,(x,28),(x,85),fill=GRAY,width=2)
                for y in [43,58,73]:line(d,(17,y),(86,y),fill=GRAY,width=2)
                rectangle(d,(39,44,60,57),GOLD,0,None)
                if mark:label(d,(52,65),mark,11)
            else:
                for y,w in [(38,48),(48,50),(59,38),(71,50)]:line(d,(24,y),(24+w,y),fill=GRAY,width=3)
                if mark: label(d,(52,60),mark,12)
        else:
            rectangle(d,(11,19,93,72),INK,5)
            rectangle(d,(16,24,88,66),WHITE,2)
            line(d,(52,72),(52,80),width=4);line(d,(31,83),(73,83),width=4)
            if mark:label(d,(52,43),mark,13)
            elif name=='diapo':
                rectangle(d,(24,33,47,59),GOLD,3)
                for yy in [34,44,54]:line(d,(52,yy),(79,yy),fill=GRAY,width=2)
            else:
                for i,h in enumerate([20,11,25,17]):rectangle(d,(25+i*15,57-h,33+i*15,57),TEAL if i==2 else BLUE,1,None)
    elif name in ('badge','etiquette','barres','qr','matrix'):
        if name=='badge':
            line(d,(36,10),(52,27),(68,10),width=4,fill=DARK_BLUE)
            rectangle(d,(24,25,78,83),WHITE,5)
            ellipse(d,(34,36,51,53),BLUE)
            line(d,(35,65),(68,65),fill=DARK_BLUE,width=3)
        elif name=='etiquette':
            polygon(d,[(15,32),(68,24),(88,43),(77,68),(23,78)], GOLD)
            ellipse(d,(72,40,79,47),WHITE)
            label(d,(49,52),mark or 'LOT',14)
        else:
            rectangle(d,(14,21,89,81),WHITE,4)
            if name=='barres':
                x=24
                pattern=[1,2,1,3,1,2,3,1,2,1,2,2,3]
                for i in pattern:
                    d.rectangle((x,34,x+i,62),fill=INK);x+=i+2
            else:
                for y in range(11):
                    for x in range(11):
                        corner=(x<3 and y<3) or (x>7 and y<3) or (x<3 and y>7)
                        if (corner or (name=='matrix' and (x==0 or y==10)) or (x*x+3*y+x*y)%5 in (0,2)):
                            d.rectangle((31+x*4,29+y*4,34+x*4,32+y*4),fill=INK)
    elif name in ('cle','cadenas','bouclier'):
        if name=='cle':
            ellipse(d,(16,26,49,59),GOLD);ellipse(d,(25,35,39,49),WHITE)
            line(d,(46,49),(83,72),(89,62),width=8,fill=WOOD)
        elif name=='cadenas':
            d.arc((32,19,72,65),180,360,INK,7)
            rectangle(d,(26,43,77,81),GOLD,6)
            ellipse(d,(47,53,57,64),INK)
            line(d,(52,61),(52,70),width=3)
        else:
            polygon(d,[(51,13),(84,27),(78,66),(51,86),(24,66),(18,27)], BLUE)
            line(d,(37,49),(48,61),(64,42),fill=WHITE,width=5)
    elif name in ('heure','date','stopwatch'):
        if name=='date':
            rectangle(d,(17,23,89,82),WHITE,5)
            rectangle(d,(17,24,89,42),BLUE,4)
            for x in [32,73]: line(d,(x,16),(x,29),width=4)
            label(d,(53,60),mark or '15',19)
        else:
            if name=='stopwatch': rectangle(d,(45,10,60,22),GRAY,2)
            ellipse(d,(19,20,87,88),WHITE,INK,4)
            line(d,(53,33),(53,54),(69,61),width=4)
            ellipse(d,(50,51,56,57),DARK_BLUE)
    elif name == 'micrometre':
        d.arc((18, 25, 77, 84), 95, 272, BLUE, 12)
        line(d, (49, 29), (44, 45), width=8)
        rectangle(d, (42, 48, 57, 61), WOOD, 1)
        rectangle(d, (54, 66, 85, 76), GRAY, 1)
        rectangle(d, (72, 62, 95, 80), DARK_BLUE, 3)
        for x in range(75, 95, 5):
            line(d, (x, 64), (x, 77), fill=PALE, width=1)
    elif name in ('balance','regle','metre','compteur','pied','volume','cylindre'):
        if name=='balance':
            rectangle(d,(18,59,87,83),DARK_BLUE,6)
            rectangle(d,(33,65,74,77),WHITE,4)
            label(d,(53,71),mark or 'kg',11)
            carton(d,30,24,45,33)
        elif name=='volume':
            polygon(d,[(29,19),(72,19),(76,76),(26,76)],PALE)
            polygon(d,[(29,48),(73,48),(74,74),(28,74)], BLUE)
            for y in [29,39,49,59,69]: line(d,(59,y),(69,y),width=2)
            if mark:label(d,(45,61),mark,12)
        elif name=='cylindre':
            rectangle(d,(32,21,72,77),BLUE,6)
            ellipse(d,(32,16,72,30),PALE)
            ellipse(d,(32,70,72,83),BLUE)
            if mark: label(d,(52,52),mark,12)
        elif name=='compteur':
            rectangle(d,(20,28,87,70),DARK_BLUE,8)
            rectangle(d,(32,38,75,58),WHITE,4)
            label(d,(54,49),mark or '012',14)
            rectangle(d,(44,20,61,28),GOLD,2)
        elif name=='pied':
            rectangle(d,(17,57,91,65),GRAY,2)
            line(d,(23,25),(23,66),(46,66),(46,37),(40,37),width=5)
            for x in range(51,91,7):line(d,(x,60),(x,65),width=2)
        else:
            rectangle(d,(12,36,92,64),GOLD,2)
            for x in range(22,90,8):line(d,(x,38),(x,49 if x%16==6 else 46),width=2)
            if mark:label(d,(53,57),mark,11)
    elif name in ('froid','chaud','goutte','vent','soleil','feuille','terre','arbre'):
        if name=='goutte':
            polygon(d,[(54,15),(32,47),(27,62),(35,80),(54,87),(74,77),(81,62),(72,44)],BLUE)
        elif name in ('soleil','chaud','froid','vent'):
            if name=='vent':
                for i,y in enumerate([34,51,68]):
                    st=13+i*5
                    line(d,(st,y),(71,y),(82,y-7),(83,y-13),(78,y-18),width=4,fill=BLUE)
            elif name in ('chaud','soleil'):
                ellipse(d,(33,32,71,70),GOLD,INK,2)
                for a in [i*pi/4 for i in range(8)]:line(d,(52+25*cos(a),51+25*sin(a)),(52+33*cos(a),51+33*sin(a)),fill=WOOD,width=4)
            else:
                for a in [i*pi/3 for i in range(6)]:
                    line(d,(52,52),(52+35*cos(a),52+35*sin(a)),fill=DARK_BLUE,width=4)
                    xx,yy=52+22*cos(a),52+22*sin(a)
                    for b in [-.6,.6]:line(d,(xx,yy),(xx+12*cos(a+b),yy+12*sin(a+b)),fill=DARK_BLUE,width=3)
        else:
            if name=='feuille':
                polygon(d,[(24,67),(25,43),(46,25),(82,20),(75,56),(62,74),(37,76)],TEAL)
                line(d,(25,80),(61,45),width=3)
            elif name=='arbre':
                rectangle(d,(47,51,58,85),WOOD,2)
                for b in [(25,31,68,65),(44,24,84,59),(37,15,68,54)]:ellipse(d,b,TEAL,INK)
            else:
                ellipse(d,(23,22,82,82),BLUE,INK,3)
                polygon(d,[(27,35),(40,29),(62,45),(47,48),(42,68),(31,62)],TEAL)
                polygon(d,[(64,55),(76,50),(79,63),(68,74),(61,66)],TEAL)
    elif name in ('danger','alerte','ok','refus','controle'):
        if name=='danger' or name=='alerte':
            polygon(d,[(53,17),(91,80),(14,80)],GOLD)
            label(d,(53,58),'!',34)
        elif name=='controle':
            ellipse(d,(20,22,66,68),PALE,INK,5)
            line(d,(62,64),(83,85),width=8)
            line(d,(34,47),(42,54),(55,39),fill='#258473',width=3)
        else:
            ellipse(d,(23,22,83,82),TEAL if name=='ok' else RED,INK,3)
            if name=='ok':line(d,(37,52),(49,65),(70,40),fill=WHITE,width=6)
            else:
                line(d,(40,39),(65,65),fill=WHITE,width=6)
                line(d,(40,65),(65,39),fill=WHITE,width=6)
    elif name in ('courbe','barresgraphe','ratio','monnaie','cout','jauge'):
        if name in ('monnaie','cout'):
            for x,y in [(25,46),(38,40),(48,46)]:
                ellipse(d,(x,y,x+36,y+33),GOLD,INK,2)
            label(d,(67,62),mark or 'CHF',12)
        elif name=='ratio':
            ellipse(d,(22,22,83,83),PALE,INK,3)
            d.pieslice((22,22,83,83),-90,40,fill=TEAL,outline=INK,width=2)
            if mark:label(d,(52,60),mark,14)
        elif name in ('courbe','barresgraphe'):
            line(d,(19,23),(19,77),(87,77),width=3)
            if name=='courbe':
                line(d,(24,63),(39,52),(48,61),(66,37),(79,45),(87,28),fill=DARK_BLUE,width=4)
                for x,y in [(39,52),(66,37),(87,28)]:ellipse(d,(x-3,y-3,x+3,y+3),TEAL,None)
            else:
                for x,y,c in [(29,40,TEAL),(50,52,BLUE),(71,64,WOOD)]:rectangle(d,(x,y,x+12,76),c,1,None)
        else:
            d.pieslice((17,28,87,98),185,355,fill=PALE,outline=INK,width=3)
            line(d,(52,63),(69,44),fill=RED,width=4)
            ellipse(d,(48,59,56,67),INK)
    elif name in ('route','reseau','cible','sequence','fleches','levier','parametre'):
        if name=='route':
            line(d,(16,71),(42,61),(37,41),(81,28),width=8,fill=GRAY)
            for x,y,c in [(17,71,DARK_BLUE),(40,51,WOOD),(82,28,TEAL)]:ellipse(d,(x-7,y-7,x+7,y+7),c,INK)
        elif name in ('reseau','sequence'):
            points=[(24,59),(52,27),(80,59)] if name=='reseau' else [(22,52),(52,52),(82,52)]
            for (x1,y1),(x2,y2) in zip(points,points[1:]):line(d,(x1,y1),(x2,y2),width=4,fill=DARK_BLUE)
            if name=='reseau':line(d,points[0],points[-1],width=3,fill=DARK_BLUE)
            for i,(x,y) in enumerate(points):
                ellipse(d,(x-10,y-10,x+10,y+10),[BLUE,WOOD,TEAL][i])
                if name=='sequence':label(d,(x,y),str(i+1),10)
        elif name=='cible':
            for r,c in [(34,PALE),(23,BLUE),(11,WOOD)]:ellipse(d,(52-r,52-r,52+r,52+r),c,INK)
            arrow(d,86,18,55,48,fill=DARK_BLUE,width=4)
        elif name=='fleches':
            arrow(d,23,38,82,38)
            arrow(d,82,67,23,67,fill='#368d7f')
        elif name=='levier':
            polygon(d,[(47,79),(58,56),(68,79)],TEAL)
            line(d,(18,68),(90,40),width=7)
            carton(d,23,38,25,23)
            arrow(d,84,19,84,40,fill=RED,width=4)
        else:
            for y,x in [(34,63),(51,32),(68,72)]:
                line(d,(16,y),(88,y),width=3,fill=GRAY)
                ellipse(d,(x-7,y-7,x+7,y+7),TEAL)
    elif name in ('conteneur','convoi','outil','crochet','fut','conveyor','couches','paquet','bulle','petri'):
        if name=='conteneur':
            polygon(d,[(10,41),(36,22),(92,37),(92,70),(61,83),(10,68)], BLUE)
            line(d,(61,52),(61,83),(92,70),(92,37),(61,52),(10,41),width=2)
            for x in [19,28,37,46,54]:line(d,(x,43+(x-19)*.22),(x,70+(x-19)*.22),width=2)
        elif name=='convoi':
            carton(d,18,19,35,32);carton(d,54,19,33,32)
            polygon(d,[(11,59),(91,59),(95,76),(7,76)], PALE)
            for x in [15,30,45,60,75,89]:ellipse(d,(x-4,63,x+4,71),BLUE)
            line(d,(20,78),(20,88),width=4);line(d,(84,78),(84,88),width=4)
        elif name=='conveyor':
            polygon(d,[(11,54),(92,54),(96,71),(8,71)],GRAY)
            line(d,(16,63),(87,63),width=3,fill=WHITE)
            carton(d,27,27,47,32)
        elif name=='outil':
            line(d,(23,77),(76,28),width=13,fill=GRAY)
            d.arc((55,13,91,47),30,285,INK,6)
            ellipse(d,(15,70,31,86),GRAY,INK,3)
        elif name=='crochet':
            line(d,(52,11),(52,39),width=4)
            d.arc((34,37,72,74),0,290,INK,6)
            line(d,(53,66),(30,82),(77,82),(53,66),width=2)
        elif name=='fut':
            rectangle(d,(29,25,76,79),DARK_BLUE,7)
            ellipse(d,(29,18,76,33),BLUE)
            for y in [45,62]:line(d,(30,y),(75,y),width=3,fill=WHITE)
        elif name=='couches' or name=='paquet':
            for i,c in enumerate([WOOD,BLUE,TEAL]):
                y=59-i*15
                polygon(d,[(14,y),(49,y-12),(90,y),(54,y+14),(14,y+5)],c)
        elif name=='petri':
            ellipse(d,(22,28,82,75),PALE,INK,3)
            for x,y in [(36,44),(61,44),(44,60),(67,57)]:ellipse(d,(x-5,y-4,x+5,y+4),TEAL,INK)
        else:
            polygon(d,[(16,28),(86,28),(86,65),(55,65),(38,78),(38,65),(16,65)], BLUE)
            for x in [35,50,65]:ellipse(d,(x-3,44,x+3,50),WHITE,None)
    else: raise ValueError('Symbole inconnu : '+tag)
    return im

def lines_in_width(draw, text, size, width):
    current = []
    result = []
    for word in text.split():
        line_words = ' '.join(current + [word])
        if current and draw.textlength(line_words, font=font(size, True)) > width:
            result.append(' '.join(current))
            current = [word]
        else:
            current.append(word)
    if current:
        result.append(' '.join(current))
    return result

def illustration(term, scenario, theme):
    tokens = list(re.finditer(r'([a-z][a-z0-9]*(?::[^\[\]\s]+)?)\[([^\]]+)\]', scenario))
    if not tokens or len(tokens) > 4 or scenario[:tokens[0].start()] or scenario[tokens[-1].end():]:
        raise ValueError(f'Scène invalide pour {term} : {scenario}')
    nodes = [(token.group(1), token.group(2)) for token in tokens]
    links = [scenario[first.end():second.start()].strip() for first, second in zip(tokens, tokens[1:])]
    tint = TINTS[theme - 1]
    canvas = Image.new('RGB', (448, 252), tint)
    d = ImageDraw.Draw(canvas)
    rectangle(d,(1,1,446,250),tint,12,'#abc2d1',2)
    terms = lines_in_width(d, term, 24, 405)
    if len(terms) > 2:
        terms = lines_in_width(d, term, 20, 405)
    for y,text in enumerate(terms):
        label(d,(224,23+y*23),text,23,strong=True)
    start_y = 72 if len(terms)>1 else 60
    width = 408/len(nodes)
    icon_size = 120 if len(nodes) <= 2 else 100 if len(nodes) == 3 else 85
    centers = [20 + (i+.5)*width for i in range(len(nodes))]
    d.line((24,200,424,200),fill='#c3d3dc',width=2)
    for center,(shape,tag) in zip(centers,nodes):
        symbol = icon(shape).resize((icon_size,icon_size), Image.Resampling.LANCZOS)
        canvas.paste(symbol,(round(center-icon_size/2),start_y+round((120-icon_size)/2)),symbol)
        size = 21 if len(nodes) <= 2 else 19 if len(nodes)==3 else 16
        words = lines_in_width(d, tag, size, width-7)
        while size > 12 and (len(words) > 2 or any(d.textlength(word, font=font(size, True)) > width - 7 for word in words)):
            size -= 1
            words = lines_in_width(d,tag,size,width-7)
        for y,text in enumerate(words):
            label(d,(center,211+y*(size+2)),text,size,strong=True)
    for i, link in enumerate(links):
        x = (centers[i]+centers[i+1])/2
        y = start_y + 61
        if link in ('>','<'):
            direction = 1 if link == '>' else -1
            arrow(d,x-direction*14,y,x+direction*14,y,width=4,head=10)
        elif link == '~':
            arrow(d,x-13,y-5,x+13,y-5,width=3,head=8)
            arrow(d,x+13,y+6,x-13,y+6,fill='#2a887c',width=3,head=8)
        elif link in ('+','−','=','/','×','↑','↓'):
            label(d,(x,y),link,25,DARK_BLUE)
        else:
            raise ValueError(f'Relation inconnue pour {term} : {link}')
    description = ' · '.join(tag for _,tag in nodes)
    return canvas, f'{term} — {description}.'

def normalized(value):
    import unicodedata
    letters = ''.join(c for c in unicodedata.normalize('NFKD', value.lower().replace('œ','oe'))
                      if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+',' ',letters).strip()

def editorial_rows(path):
    return (line for line in path.read_text().splitlines() if line and not line.startswith('#'))

def load_scenarios(path):
    result = {}
    for line in editorial_rows(path):
        keys, pattern = line.split('|')
        for key in keys.split(';'):
            if key in result:
                raise ValueError(f'Scène déclarée deux fois : {key}')
            result[key] = pattern
    return result

def prepare(glossaries):
    import json
    source = Path('docs/logistique/preparation')
    public = Path('public')
    photos_by_name = {asset.name:asset.relative_to(public).as_posix()
                      for asset in (public/'assets/logistique').rglob('*.webp')}
    scenarios = load_scenarios(source/'glossaires-scenes-v006.txt')
    photographs = {}
    for row in editorial_rows(source/'glossaires-photos-v006.txt'):
        module, term, file, alt = row.split('|')
        photographs[(module,term)] = {'src':'/'+photos_by_name[file], 'alt':alt}
    manifest = {}
    diagrams = 0
    photographic_rows = 0
    for glossary in glossaries:
        module = glossary['module']
        visual_rows = manifest[module] = {}
        used = set()
        for index, entry in enumerate(glossary['entries'], 1):
            term = entry['term']
            key = normalized(term)
            scoped = module + '/' + key
            photo = photographs.get((module,term)) or (entry.get('figure') if scoped not in scenarios else None)
            if photo:
                if not (public / photo['src'].lstrip('/')).is_file():
                    raise ValueError(f'Image introuvable : {photo["src"]}')
                if photo['src'] in used:
                    raise ValueError(f'Visuel partagé dans le module {module} : {photo["src"]}')
                used.add(photo['src'])
                visual_rows[term] = photo
                photographic_rows += 1
                continue
            scenario = scenarios.get(scoped) or scenarios.get(key)
            if not scenario:
                raise ValueError(f'Notion sans scénario : {module} / {term}')
            image, alt = illustration(term,scenario,int(module[0]))
            slug = key.replace(' ','-')[:60].rstrip('-')
            path = f'assets/logistique/{module[0]}00/{module}/glossaire/log-{module}-{index:02d}-{slug}-schema-v006.webp'
            destination = public / path
            destination.parent.mkdir(exist_ok=True,parents=True)
            image.save(destination,'WEBP',quality=88,method=6)
            visual_rows[term] = {'src':'/'+path, 'alt':alt}
            diagrams += 1
    manifest_path = Path('src/logistique/banks/glossaires-visuels-v006.json')
    lines = ['{']
    for m_index,(module,rows) in enumerate(manifest.items()):
        lines.append(f'  "{module}": {{')
        for index,(term,figure) in enumerate(rows.items()):
            lines.append('    '+json.dumps(term,ensure_ascii=False)+': '+json.dumps(figure,ensure_ascii=False)
                         + (',' if index+1 < len(rows) else ''))
        lines.append('  }'+(',' if m_index+1 < len(manifest) else ''))
    manifest_path.write_text('\n'.join(lines+['}','']))
    print(f'{len(manifest)} glossaires · {diagrams} schémas créés · {photographic_rows} visuels photographiques ou existants')

if __name__ == '__main__':
    import json
    import sys
    prepare(json.load(sys.stdin))
