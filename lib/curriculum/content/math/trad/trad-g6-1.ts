import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const I = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G6_1: SubmoduleTrad = {
  submoduleId: "G6-1",
  title: S(
    "Se repérer dans le plan",
    "Finding your way on the grid",
    "تحديد الموضع في المستوى",
    "مکان‌یابی در صفحه",
    "ኣብ መጠና ምርኻብ",
    "Орієнтування на площині",
    "Localizar-se no plano",
    "Ku jihaynta goobta",
    "Düzlemde konum bulma",
    "په مسطح کې موقعیت موندل",
  ),
  blocks: [
    { text: S(
      "Repérer une position",
      "Finding a position",
      "تحديد موضع",
      "یافتن یک موقعیت",
      "ኣቀማምጣ ምርኻብ",
      "Визначення положення",
      "Localizar uma posição",
      "Helitaanka booska",
      "Bir konum bulma",
      "موقعیت موندل",
    ) },
    { text: S(
      "Pour localiser une case sur une grille, on utilise une **colonne** (lettre) et une **ligne** (chiffre).",
      "To locate a square on a grid, we use a **column** (letter) and a **row** (number).",
      "لتحديد خانة على شبكة، نستخدم **عموداً** (حرفاً) و**صفاً** (رقماً).",
      "برای یافتن یک خانه روی شبکه، از یک **ستون** (حرف) و یک **سطر** (عدد) استفاده می‌کنیم.",
      "ኣብ መርበብ ሓደ ክፍሊ ንምርኻብ **ኮለም** (ፊደል) ከምካይ **መስመር** (ቁጽሪ) ንጥቀም።",
      "Щоб знайти клітинку на сітці, використовуємо **стовпець** (літеру) та **ряд** (число).",
      "Para localizar uma casa numa grelha, usamos uma **coluna** (letra) e uma **linha** (número).",
      "Si aad u hesho goob cell ah oo shabakad ah, waxaan isticmaalnaa **tiir** (xaraf) iyo **safka** (tiro).",
      "Bir ızgarada bir kareyi bulmak için bir **sütun** (harf) ve bir **satır** (sayı) kullanırız.",
      "په یوې شبکې کې د یوې خانې موقعیت موندلو لپاره **ستون** (حرف) او **قطار** (شمېره) کاروو.",
    ) },
    { text: S(
      "On écrit sa position sous la forme **(colonne ; ligne)**, par exemple **(d ; 1)**.",
      "We write its position as **(column ; row)**, for example **(d ; 1)**.",
      "نكتب موضعه بالشكل **(عمود ; صف)**، مثلاً **(d ; 1)**.",
      "موقعیت را به صورت **(ستون ; سطر)** می‌نویسیم، مثلاً **(d ; 1)**.",
      "ኣቀማምጣና ብሓደ **(ኮለም ; መስመር)** ንጽሕፎ፣ ከም **(d ; 1)**።",
      "Записуємо положення у вигляді **(стовпець ; ряд)**, наприклад **(d ; 1)**.",
      "Escrevemos a posição como **(coluna ; linha)**, por exemplo **(d ; 1)**.",
      "Booska waxaa loo qoraa **(tiir ; saf)** sida **(d ; 1)**.",
      "Konumunu **(sütun ; satır)** olarak yazarız, örneğin **(d ; 1)**.",
      "موقعیت یې په **(ستون ; قطار)** بڼه لیکو، لکه **(d ; 1)**.",
    ) },
    { text: S(
      "Observer les tableaux",
      "Reading the grids",
      "مراقبة الجداول",
      "خواندن جدول‌ها",
      "መርበባት ምንባብ",
      "Читання таблиць",
      "Observar as grelhas",
      "Akhrinta shabakadaha",
      "Tabloları okuma",
      "جدولونه کتل",
    ) },
    {
      items: I(
        [
          "La case **jaune** est sur l'emplacement **(B ; 3)**.",
          "On lit d'abord la **colonne**, puis la **ligne**.",
        ],
        [
          "The **yellow** square is at **(B ; 3)**.",
          "We read the **column** first, then the **row**.",
        ],
        [
          "الخانة **الصفراء** في الموضع **(B ; 3)**.",
          "نقرأ **العمود** أولاً، ثم **الصف**.",
        ],
        [
          "خانه **زرد** در موقعیت **(B ; 3)** است.",
          "اول **ستون**، بعد **سطر** را می‌خوانیم.",
        ],
        [
          "እቲ **ብጫውሕ** ክፍሊ ኣብ **(B ; 3)** ይርከብ።",
          "ቀዳማይ **ኮለም**፣ ድሕሪኡ **መስመር** ንኽንብብ።",
        ],
        [
          "Жовта клітинка знаходиться в **(B ; 3)**.",
          "Спочатку читаємо **стовпець**, потім **ряд**.",
        ],
        [
          "A casa **amarela** está em **(B ; 3)**.",
          "Lemos primeiro a **coluna**, depois a **linha**.",
        ],
        [
          "Cell-ka **jaalle** wuxuu ku yaalaa **(B ; 3)**.",
          "Marka hore waxaan akhrinaa **tiirka**, kadib **safka**.",
        ],
        [
          "**Sarı** kare **(B ; 3)** konumundadır.",
          "Önce **sütunu**, sonra **satırı** okuruz.",
        ],
        [
          "**ژیړه** خانې په **(B ; 3)** کې ده.",
          "لومړی **ستون**، بیا **قطار** څیړو.",
        ],
      ),
    },
    {},
  ],
  consignes: {
    g6GridRead: S(
      "Notez les coordonnées des points.",
      "Write down the coordinates of the points.",
      "اكتب إحداثيات النقاط.",
      "مختصات نقاط را بنویسید.",
      "ናይ ነጥብታት ኮኦርድነታት ጽሓፉ።",
      "Запишіть координати точок.",
      "Anote as coordenadas dos pontos.",
      "Qor xuduudaha dhibcaha.",
      "Noktaların koordinatlarını yazın.",
      "د نقطو همغږي ولیکئ.",
    ),
    g6GridPlace: S(
      "Cliquez sur les formes et placez-les dans les coordonnées indiquées.",
      "Click the shapes and place them at the given coordinates.",
      "انقر على الأشكال وضعها في الإحداثيات المطلوبة.",
      "روی شکل‌ها کلیک کنید و آن‌ها را در مختصات داده‌شده قرار دهید.",
      "ኣብ እቶም ቅርጺታት ጠውቑ ኣብ እተነጸሩ ኮኦርድነታት ኣቐምጦም።",
      "Натисніть на фігури та розмістіть їх у вказаних координатах.",
      "Clique nas formas e coloque-as nas coordenadas indicadas.",
      "Guji qaababka oo ku dhig xuduudaha la bixiyay.",
      "Şekillere tıklayın ve verilen koordinatlara yerleştirin.",
      "په شکلونو کلیک وکړئ او په ورکړل شویو همغږیو کې یې ځای پر ځای کړئ.",
    ),
    g6Q1FigureCoords: S(
      "Notez les coordonnées des points.",
      "Write down the coordinates of the points.",
      "اكتب إحداثيات النقاط.",
      "مختصات نقاط را بنویسید.",
      "ናይ ነጥብታት ኮኦርድነታት ጽሓፉ።",
      "Запишіть координати точок.",
      "Anote as coordenadas dos pontos.",
      "Qor xuduudaha dhibcaha.",
      "Noktaların koordinatlarını yazın.",
      "د نقطو همغږي ولیکئ.",
    ),
  },
};
