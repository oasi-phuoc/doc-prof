import type { GrammaireTheoryDoc } from '../types'

/** Théorie FALC — thème gram-entrer-contact. Français seul (pas de traductions). */
export const entrerContactDocs: GrammaireTheoryDoc[] = [
  {
    id: 'b1',
    typeId: 'gram-b1-theorie',
    index: 1,
    title: 'Tu et vous',
    topic: 'gram-entrer-contact',
    public: 'pré-A1 / A1',
    objectif: 'Choisir tu ou vous.',
    blocks: [
    { kind: 'heading', text: 'Tu et vous' },
    { kind: 'paragraph', text: '{ligne/4}' },
    { kind: 'paragraph', text: 'Je choisis {g}tu{/g} ou {g}vous{/g} selon la personne.' },
    { kind: 'paragraph', text: '{ligne/2}' },
    {
      kind: 'section',
      role: 'regarder',
      blocks: [
        { kind: 'examples', items: [
          '{tab:1<}Salut, comment {c}tu{/c} vas ? | Bonjour, comment allez-{c}vous{/c} ?',
          '{tab:1<}{c}Tu{/c} vas bien ? | {c}Vous{/c} allez bien ?',
          '{tab:1<}Comment {c}tu{/c} t’appelles ? | Comment {c}vous{/c} appelez-vous ?'
        ]}
      ],
    },
    {
      kind: 'section',
      role: 'expliquer',
      blocks: [
        { kind: 'paragraph', text: 'J’utilise {c}tu{/c} pour parler à une personne que {c}je connais bien{/c}.' },
        { kind: 'paragraph', text: '{ligne/2}' },
        { kind: 'examples', marker: 'puces',
            items: [
              '{tab:+1+}{g}Je parle avec …{/g} | {g}Exemples{/g}',
              '{tab:1>}Un {c}ami{/c} | Salut, tu ({c}Sacha{/c}) vas bien ?',
              '{tab:1>}Un membre de la {c}famille{/c} | Tu ({c}Mon frère{/c}) comprends ?',
              '{tab:1>}Un {c}enfant{/c} | Tu ({c}Eliott, 5 ans{/c}) as quel âge ?',
              '{tab:1>}Un autre {c}élève{/c} de la classe | Tu ({c}Dawit{/c}) habites où ? '
            ],
          },
        { kind: 'paragraph', text: '{ligne/2}' },
        { kind: 'paragraph', text: 'J’utilise {c}vous{/c} pour parler {c}poliment{/c} à une personne que {c}je ne connais pas bien{/c}.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'paragraph', text: '{c}Vous{/c} peut aussi parler à {c}plusieurs personnes{/c}.' },
                { kind: 'examples',  marker: 'puces',
            items: [
              '{tab:+1+}{g}Je parle avec …{/g} | {g}Exemples{/g}',
              '{tab:1>}Une {c}personne inconnue{/c} | Bonjour, vous ({c}une personne dans la rue{/c}) allez bien ?',
              '{tab:1>}Un {c}professeur{/c} | Vous ({c}M. Van{/c}) pouvez répéter ?',
              '{tab:1>}Un {c}médecin{/c} | Vous ({c}Dr. Grandjean{/c}) avez mal où ?',
              '{tab:1>}Plusieurs {c}personnes{/c} | Vous ({c}Mohammed et Ibrahim{/c}) êtes prêts ?'
            ],
          },
      ],
    },
    {kind: 'page'},
    {
      kind: 'section',
      role: 'retenir',
      blocks: [
        { kind: 'paragraph', text: '{c}tu{/c} = une personne proche.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'paragraph', text: '{c}Vous{/c} = forme de politesse ou plusieurs personnes.' },
        { kind: 'table', colHeader: true, rowHeader: true,
          headers: ['Tu', 'Vous'],
          rows: [
            ['un ami', 'une personne inconnue'],
            ['un élève', 'un professeur'],
            ['un enfant', 'un médecin']
          ] },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'astuce', text: 'Écoute aussi la façon dont la personne te parle.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'attention', text: '{c}Vous{/c} sert aussi pour plusieurs personnes.' }
      ],
    },
    ],
  },
  {
    id: 'b2',
    typeId: 'gram-b2-theorie',
    index: 2,
    title: 'Les salutations',
    topic: 'gram-entrer-contact',
    public: 'pré-A1 / A1',
    objectif: 'Saluer à l’arrivée et au départ.',
    blocks: [
    { kind: 'heading', text: 'Les salutations' },
    { kind: 'paragraph', text: '{ligne/4}' },
    { kind: 'paragraph', text: 'Je salue une personne quand j’arrive et quand je pars.' },
    { kind: 'paragraph', text: '{ligne/2}' },
    {
      kind: 'section',
      role: 'regarder',
      blocks: [
        { kind: 'examples', items: [
          '{tab:1<}Bonjour ! | Bonsoir !',
          '{tab:1<}Salut !', 'Au revoir !',
          '{tab:1<}À bientôt !', 'Bonne journée !'
        ] }
      ],
    },
    {
      kind: 'section',
      role: 'expliquer',
      blocks: [
        { kind: 'paragraph', text: 'Je dis {c}bonjour{/c} quand j’arrive pendant la journée.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'paragraph', text: 'Je dis {c}bonsoir{/c} quand j’arrive le soir.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'paragraph', text: 'Je dis {c}au revoir{/c} quand je pars.' },
        { kind: 'paragraph', text: '{ligne/2}' },
        { kind: 'examples', marker: 'puces',
            items: [
              '{tab:+1+}{g}Situation{/g} | {g}Expression{/g}',
              '{tab:1>}J’arrive le matin | Bonjour !',
              '{tab:1>}J’arrive le soir | Bonsoir !',
              '{tab:1>}Je pars | Au revoir !',
              '{tab:1>}Je pars et je pense revoir la personne | À bientôt !',
              '{tab:1>}Je quitte une personne pendant la journée | Bonne journée !'
            ],
          },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: '{c}Bonjour{/c}, {c}bonsoir{/c} et {c}au revoir{/c} conviennent avec {c}tu{/c} et {c}vous{/c}.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: '{c}Salut{/c} est familier. Je l’utilise surtout avec mes amis, ma famille ou les personnes que je connais bien.' },
        ],
    },
    {
      kind: 'section',
      role: 'retenir',
      blocks: [
        { kind: 'paragraph', text: 'Quand je pars, je dis au revoir.' },
        { kind: 'paragraph', text: '{ligne/4}' },
        { kind: 'paragraph', text: 'Quand j’arrive, je dis bonjour ou bonsoir.' },
        { kind: 'paragraph', text: '{ligne/2}' },
        { kind: 'table', colHeader: true, rowHeader: true,
            headers: ['Quand j’arrive', 'Quand je pars'],
            rows: [
              ['Bonjour !', 'Au revoir !'],
              ['Bonsoir !', 'À bientôt !'],
              ['Salut ! (familier)', 'Salut ! (familier)'],
              ['—', 'Bonne journée !'],
              ['—', 'Bonne soirée !'],
            ],
          },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'attention', text: '{c}Hello{/c} et {c}ciao{/c} sont très familiers.' }
      ],
    },
    ],
  },
  {
    id: 'b3',
    typeId: 'gram-b3-theorie',
    index: 3,
    title: 'Les remerciements',
    topic: 'gram-entrer-contact',
    public: 'pré-A1 / A1',
    objectif: 'Dire merci et répondre.',
    blocks: [
    { kind: 'heading', text: 'Les remerciements' },
    { kind: 'paragraph', text: '{ligne/4}' },
    { kind: 'paragraph', text: 'Je remercie une personne et je sais répondre à un merci.' },
    { kind: 'paragraph', text: '{ligne/2}' },
    {
      kind: 'section',
      role: 'regarder',
      blocks: [
        {
          kind: 'examples',
          items: [
            '{tab:1<}Merci ! | De rien !',
            '{tab:1<}Merci beaucoup ! | Avec plaisir !',
            '{tab:1<}C’est gentil de votre part ! | Je vous en prie !',
          ],
        },
      ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Quand une personne m’aide ou me donne quelque chose, je peut la remercier de différentes manières.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je peux dire {c}merci{/c} ou {c}merci beaucoup{/c} pour remercier davantage.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je peux aussi dire {c}je te remercie{/c} ({c}un ami{/c}) et {c}je vous remercie{/c} ({c}politesse{/c}).' },
          { kind: 'paragraph', text: '{ligne/2}' },
          {
            kind: 'examples',
            items: [
              '{tab:+1+}{g}Situation{/g} | {g}Je dis …{/g}',
              '{tab:1>}Un ami m’aide | {c}Merci !{/c}',
              '{tab:1>}Une personne me donne un document | {c}Merci beaucoup !{/c}',
              '{tab:1>}Un vendeur me donne mon sac | {c}Je vous remercie !{/c}'
            ],
          },
          { kind: 'paragraph', text: 'Quand une personne me remercie, je peux répondre de différentes manières.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je peux dire {c}de rien{/c} ou {c}avec plaisir{/c}.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je peux aussi dire {c}je t’en prie{/c} ({c}un ami{/c}) et {c}je vous en prie{/c} ({c}politesse{/c}).' },
          { kind: 'paragraph', text: '{ligne/2}' },
          {
            kind: 'examples',
            items: [
              '{tab:+1+}{g}Situation{/g} | {g}Je dis …{/g}',
              '{tab:1>}Merci pour ton aide. | {c}De rien !{/c}',
              '{tab:1>}Merci beaucoup. | {c}Avec plaisir !{/c}',
              '{tab:1>}Je vous remercie. | {c}Je vous en prie !{/c}'
            ],
          },
        ],
      },
      { kind: 'page' },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'Pour remercier, je dis {c}merci{/c}, {c}merci beaucoup{/c} ou {c}je vous remercie{/c}.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Pour répondre, je dis {c}de rien{/c}, {c}avec plaisir{/c} ou {c}je vous en prie{/c}.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          {
            kind: 'table',
            colHeader: true,
            rowHeader: true,
            headers: ['Je remercie', 'Je réponds'],
            rows: [
              ['Merci !', 'De rien !'],
              ['Merci beaucoup !', 'Avec plaisir !'],
              ['Je te remercie !', 'Je t’en prie !'],
              ['Je vous remercie !', 'Je vous en prie !'],
            ],
          },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: '{c}Attention :{/c}' },
          { kind: 'paragraph', text: '{ligne/4}' },
          {
            kind: 'table',
            colHeader: true,
            rowHeader: true,
            headers: ['Familier', 'Politesse'],
            rows: [
              ['Je te remercie !', 'Je vous remercie !'],
              ['Je t’en prie ! ', 'Je vous en prie !'],
            ],
          }
        ],
      },
    ],
  },
]
