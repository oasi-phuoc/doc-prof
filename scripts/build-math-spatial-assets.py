from pathlib import Path
from PIL import Image, ImageDraw
import json

out = Path(__file__).resolve().parents[1] / 'src/math/media/spatial'
out.mkdir(parents=True, exist_ok=True)
scenes = [
 ('quartier','Un quartier', 'urban', [('École',1,1,'school'),('Place',4,1,'fountain'),('Gare',2,2,'station'),('Parc',3,3,'tree'),('Mairie',0,3,'house')], [[3,0],[3,1],[3,2]]),
 ('musee','Un musée', 'indoor',[('Statue',1,1,'statue'),('Vase',4,1,'vase'),('Tableau',2,2,'frame'),('Banc',3,3,'bench'),('Entrée',0,3,'door')], [[4,2],[4,3],[4,4]]),
 ('zoo','Un parc animalier','nature',[('Girafe',2,1,'giraffe'),('Éléphant',4,2,'elephant'),('Étang',3,3,'pond'),('Oiseaux',1,2,'bird'),('Kiosque',0,3,'house')], [[2,2],[2,3],[2,4]]),
 ('camping','Un camping','nature',[('Tente',1,1,'tent'),('Borne',3,1,'tower'),('Chalet',4,2,'house'),('Feu',2,3,'fire'),('Accueil',5,3,'school')], [[1,2],[1,3],[1,4]]),
 ('port','Un port','water',[('Phare',1,1,'tower'),('Voilier',4,1,'boat'),('Hangar',2,2,'house'),('Grue',3,3,'crane'),('Plage',5,3,'umbrella')], [[4,2],[4,3],[4,4]]),
 ('ecole','Une cour d’école','urban',[('Panier',2,1,'basket'),('Toboggan',4,2,'slide'),('Fontaine',3,3,'fountain'),('Arbre',1,2,'tree'),('Préau',0,3,'school')], [[2,2],[2,3],[2,4]]),
 ('ferme','Une ferme','nature',[('Grange',1,1,'house'),('Silo',3,1,'tower'),('Tracteur',4,2,'tractor'),('Verger',2,3,'tree'),('Mare',5,3,'pond')], [[1,2],[1,3],[1,4]]),
 ('festival','Une fête de village','urban',[('Scène',1,1,'stage'),('Manège',4,1,'umbrella'),('Stand',2,2,'shop'),('Ballons',3,3,'balloon'),('Entrée',0,3,'door')], [[3,0],[3,1],[3,2]]),
 ('station','Une station de montagne','nature',[('Refuge',2,1,'house'),('Téléphérique',4,2,'crane'),('Sommet',3,3,'mountain'),('Sapin',1,2,'tree'),('Luge',0,3,'sled')], [[2,2],[2,3],[2,4]]),
 ('stade','Un stade','urban',[('But',1,1,'goal'),('Podium',3,1,'stage'),('Tribune',4,2,'bench'),('Vestiaire',2,3,'door'),('Buvette',5,3,'shop')], [[1,2],[1,3],[1,4]]),
 ('bibliotheque','Une bibliothèque','indoor',[('Livres',1,1,'books'),('Fauteuil',4,1,'bench'),('Horloge',2,2,'clock'),('Bureau',3,3,'desk'),('Entrée',0,3,'door')], [[4,2],[4,3],[4,4]]),
 ('ile','Une île','water',[('Pont',2,1,'bridge'),('Cabane',4,2,'house'),('Palmier',3,3,'palm'),('Barque',1,2,'boat'),('Rocher',0,3,'mountain')], [[2,2],[2,3],[2,4]]),
]

# Distinct rows and columns keep the foreground landmarks legible in each view.
arrangements = [
    [(1,0),(4,1),(2,2),(3,3)], [(1,1),(4,0),(2,3),(3,2)],
    [(2,0),(4,2),(3,3),(1,1)], [(1,1),(3,0),(4,3),(2,2)],
    [(1,2),(4,1),(2,0),(3,3)], [(2,1),(4,0),(3,3),(1,2)],
    [(1,0),(3,1),(4,2),(2,3)], [(1,2),(4,0),(2,1),(3,3)],
    [(2,1),(4,2),(3,3),(1,0)], [(1,1),(3,2),(4,3),(2,0)],
    [(1,3),(4,1),(2,2),(3,0)], [(2,1),(4,2),(3,3),(1,0)],
]

def icon(d, x, y, s, name):
    ink='#263645'
    def coords(*points):
        return [(round(x+xx*s),round(y+yy*s)) for xx,yy in points]
    def poly(fill,*pts):
        d.polygon(coords(*pts),fill=fill,outline=ink,width=max(1,round(s*.026)))
    def box(x0,y0,x1,y1,fill):
        d.rectangle(coords((x0,y0),(x1,y1)),fill=fill,outline=ink,width=max(1,round(s*.024)))
    def oval(x0,y0,x1,y1,fill):
        d.ellipse(coords((x0,y0),(x1,y1)),fill=fill,outline=ink,width=max(1,round(s*.024)))
    def line(fill,*pts,w=.03):
        d.line(coords(*pts),fill=fill,width=max(1,round(s*w)))
    if name in ('house','school','station','shop','stage'):
        roof={'house':'#c45b51','school':'#a45b45','station':'#336483','shop':'#d98240','stage':'#705397'}[name]
        box(.17,.39,.83,.92,'#f1d6a2')
        poly(roof,(.08,.42),(.5,.13),(.93,.42))
        box(.43,.63,.59,.92,'#485f6d')
        if name in ('school','station','shop'):
            box(.23,.51,.35,.62,'#91ccea')
            box(.65,.51,.77,.62,'#91ccea')
        if name=='station':
            oval(.41,.24,.59,.41,'#fff3dd')
        if name=='shop':
            box(.14,.43,.86,.56,'#f7a967')
        if name=='stage':
            box(.24,.48,.76,.85,'#643b70')
    elif name in ('tree','palm'):
        box(.46,.43,.56,.91,'#9b6644')
        if name=='tree':
            oval(.13,.12,.87,.66,'#72a966')
            oval(.32,.04,.68,.58,'#91ba72')
        else:
            for edge in (0.05,.25,.74,.94):
                poly('#44966c',(.51,.29),(edge,.17),(edge,.34),(.50,.45))
    elif name=='tower':
        poly('#f3e9d6',(.28,.91),(.37,.24),(.63,.24),(.72,.91))
        box(.33,.43,.67,.55,'#bb5549')
        box(.31,.14,.69,.29,'#485f6d')
        poly('#bb5549',(.24,.15),(.5,.04),(.76,.15))
    elif name in ('pond','fountain'):
        oval(.09,.57,.91,.92,'#60b7d1')
        if name=='fountain':
            box(.44,.37,.56,.77,'#536e8c')
            for end in (.20,.80):
                line('#286f9e',(.5,.31),(end,.39),(end,.64),w=.055)
    elif name=='statue':
        box(.25,.76,.75,.92,'#747f98')
        poly('#8da6b1',(.31,.76),(.41,.35),(.59,.35),(.68,.76))
        oval(.39,.11,.61,.40,'#b9c8cd')
    elif name=='vase':
        oval(.24,.31,.76,.88,'#c56d4e')
        box(.36,.17,.64,.41,'#e2a06e')
        line('#fbe0a6',(.29,.57),(.70,.57),w=.055)
    elif name in ('frame','books','clock'):
        box(.20,.22,.80,.77,'#83634e')
        box(.26,.28,.74,.70,'#f6dea0')
        if name=='clock':
            oval(.30,.32,.70,.66,'#fff4dc')
            line(ink,(.5,.37),(.5,.51),(.62,.55))
        elif name=='frame':
            poly('#75a669',(.27,.68),(.43,.44),(.58,.68))
            oval(.53,.31,.65,.42,'#dc8b45')
        else:
            for i, c in enumerate(['#a14c5d','#568d8f','#415985','#d49342']):
                box(.29+i*.10,.36+(i%2)*.07,.38+i*.10,.65,c)
    elif name in ('bench','desk'):
        box(.22,.66,.28,.93,'#594f50')
        box(.72,.66,.78,.93,'#594f50')
        box(.14,.62,.86,.73,'#be835b')
        if name=='bench':
            box(.16,.43,.84,.60,'#db9b69')
    elif name=='door':
        box(.22,.19,.78,.92,'#8a694f')
        box(.29,.27,.71,.92,'#476477')
        oval(.57,.57,.65,.65,'#eac772')
    elif name=='tent':
        poly('#e7a24e',(.08,.90),(.47,.16),(.81,.90))
        poly('#d58751',(.47,.16),(.72,.22),(.94,.90),(.81,.90))
        poly('#614e4c',(.32,.90),(.47,.51),(.62,.90))
    elif name=='fire':
        box(.22,.82,.78,.91,'#8d665a')
        poly('#e88055',(.28,.82),(.31,.48),(.44,.58),(.54,.25),(.73,.64),(.69,.82))
        poly('#f3ba58',(.43,.82),(.50,.55),(.59,.82))
    elif name in ('crane','basket','goal','bridge'):
        if name=='crane':
            box(.39,.21,.51,.91,'#d9ac49')
            box(.20,.21,.86,.31,'#d9ac49')
            line(ink,(.78,.31),(.78,.62))
            box(.71,.62,.85,.76,'#cf7854')
        elif name=='basket':
            box(.46,.42,.54,.93,'#4c7896')
            box(.22,.18,.78,.43,'#c8dbe7')
            oval(.34,.39,.66,.57,'#d86146')
        else:
            line('#557486',(.16,.88),(.16,.33),(.84,.33),(.84,.88),w=.075)
            for i in range(1,5):
                line('#8896a5',(.16+i*.14,.34),(.16+i*.14,.86),w=.013)
            if name=='bridge':
                box(.13,.74,.87,.88,'#bd906e')
    elif name in ('boat','sled'):
        poly('#a05a47',(.10,.70),(.89,.70),(.72,.92),(.27,.92))
        if name=='boat':
            poly('#dbe6f3',(.52,.15),(.16,.66),(.52,.66))
            poly('#6d93b6',(.57,.31),(.84,.66),(.57,.66))
    elif name in ('mountain','slide'):
        poly('#828b98' if name=='mountain' else '#e99454',(.10,.92),(.47,.16),(.89,.92))
        poly('#e6eef1',(.32,.46),(.47,.16),(.61,.46))
    elif name in ('balloon','umbrella'):
        for i,c in enumerate(['#d87772','#7da46b','#826eb2']):
            xx=.27+i*.22
            line(ink,(xx,.46),(.50,.91))
            if name=='balloon':
                oval(xx-.14,.14+(i%2)*.10,xx+.14,.50+(i%2)*.10,c)
        if name=='umbrella':
            poly('#bd6382',(.08,.51),(.33,.25),(.68,.25),(.92,.51))
    elif name in ('giraffe','elephant','bird','tractor'):
        c={'giraffe':'#dba356','elephant':'#879bb2','bird':'#7da16d','tractor':'#ac5e4b'}[name]
        oval(.18,.44,.76,.76,c)
        if name=='giraffe':
            box(.55,.23,.67,.61,c)
            oval(.55,.16,.84,.35,c)
            box(.25,.65,.34,.92,c)
            box(.58,.65,.67,.92,c)
        elif name=='elephant':
            oval(.56,.37,.83,.65,c)
            line(c,(.76,.55),(.82,.77),(.92,.79),w=.105)
            box(.30,.67,.44,.90,c)
            box(.59,.67,.73,.90,c)
        elif name=='tractor':
            box(.39,.30,.61,.63,'#7c9eaa')
            oval(.12,.61,.46,.92,'#4b4a56')
            oval(.58,.66,.81,.90,'#4b4a56')
        else:
            oval(.64,.31,.79,.47,c)
            poly('#e3a552',(.74,.40),(.94,.47),(.74,.50))
            poly('#597a6c',(.21,.50),(.51,.44),(.42,.69))
    else:
        raise ValueError(name)

palettes = {
 'urban':('#eeeae1','#d6dee1','#c4d6c0'),
 'indoor':('#f3eee4','#e5d4bb','#eadcc7'),
 'nature':('#e8edda','#cddcb8','#d3dfc0'),
 'water':('#eae1cb','#bcdae9','#d2e1da'),
}
tile=120
width,height=6*tile,5*tile
cameras = [('A',0,-1),('B',1,0),('C',0,1),('D',-1,0)]
models=[]
for (id,title,theme,objects,blocked), positions in zip(scenes, arrangements, strict=True):
    objects = [(name, x, y, shape) for (name, _, _, shape), (x, y) in zip(objects[:4], positions, strict=True)] + [objects[4]]
    blocked = [cell for cell in blocked if tuple(cell) not in {(x, y) for _, x, y, _ in objects}]
    assert len(blocked) >= 2
    base,feature,detail=palettes[theme]
    image=Image.new('RGB',(width,height),base)
    d=ImageDraw.Draw(image)
    if theme=='urban':
        d.line([(0,105),(width,105)],fill=feature,width=37)
        d.line([(106,0),(106,height)],fill=feature,width=35)
        d.line([(0,348),(width,348)],fill=feature,width=33)
    elif theme=='nature':
        d.line([(0,105),(width,105)],fill='#f4e8cb',width=36)
        d.line([(106,105),(106,height)],fill='#f4e8cb',width=32)
        for i in range(0,width,24):
            d.ellipse((i,550+(i%4)*5,i+12,562+(i%4)*5),fill=detail)
    elif theme=='indoor':
        d.rounded_rectangle((16,16,width-16,height-16),radius=15,outline='#ac9a80',width=10)
        d.rectangle((126,367,349,460),fill=feature)
    else:
        d.polygon([(0,0),(width,0),(width,70),(500,57),(353,93),(179,62),(0,96)],fill=feature)
        for i in range(24,width,65):
            d.arc((i,25,i+35,39),0,180,fill='#749eae',width=2)
    for bx,by in blocked:
        x,y=bx*tile,by*tile
        d.rectangle((x+1,y+1,x+tile-2,y+tile-2),fill=feature)
        for off in range(17,120,20):
            d.line((x+off,y+5,x+5,y+off),fill='#7d8b91',width=3)
            d.line((x+off,y+114,x+114,y+off),fill='#7d8b91',width=3)
    for _, ox,oy, shape in objects:
        icon(d,ox*tile+21,oy*tile+5,78,shape)
    image.save(out / f'{id}.png',optimize=True)
    labels = {}
    for letter, dx,dy in cameras:
        pic=Image.new('RGB',(520,240),'#e6edf0')
        d=ImageDraw.Draw(pic)
        d.rectangle((0,95,520,240),fill=base)
        d.line((0,95,520,95),fill='#9ca5a8',width=2)
        visible=sorted(objects[:4], key=lambda item:-(dx*(item[1]-2.5)+dy*(item[2]-2)))
        for _, ox,oy,shape in visible:
            vx,vy=ox-2.5,oy-2
            sideways=dy*vx-dx*vy
            near=dx*vx+dy*vy
            size=82+12*near
            x=260+sideways*(77+8*near)-size/2
            y=165+near*16-size
            d.ellipse((x+size*.12,y+size*.81,x+size*.89,y+size*.94),fill=detail)
            icon(d,x,y,size,shape)
        pic.save(out / f'{id}-{letter}.png',optimize=True)
        labels[letter] = [n for n, x, y, _ in sorted(objects[:4], key=lambda item:dy*(item[1]-2.5)-dx*(item[2]-2))]
    models.append(dict(id=id,title=title, landmarks=[dict(name=n,x=x,y=y) for n,x,y,_ in objects], blocked=blocked,views=labels))
(out/'maps.json').write_text(json.dumps(models,ensure_ascii=False,indent=2)+'\n')
