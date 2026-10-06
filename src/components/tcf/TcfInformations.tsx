import type { TcfCompetence, TcfNiveau } from '@/tcf/types'
import { CompetenceIcon } from './CompetenceIcon'

const PARTIES: ReadonlyArray<{ id: TcfCompetence; titre: string; texte: string; deroulement: string }> = [
  {
    id: 'CE',
    titre: 'compréhension écrite',
    texte: 'Lire et comprendre des textes (messages, consignes, articles) et répondre à des questions.',
    deroulement: 'Lisez le document, puis répondez sur la fiche.',
  },
  {
    id: 'CO',
    titre: 'compréhension orale',
    texte: 'Écouter des documents audio et repérer les informations essentielles.',
    deroulement: 'Scannez le QR code ou écoutez l’enregistrement diffusé en classe.',
  },
  {
    id: 'PE',
    titre: 'production écrite',
    texte: 'Rédiger des textes (formulaires, messages, lettres) adaptés à la situation.',
    deroulement: 'Écrivez sur les lignes et respectez le nombre de mots indiqué.',
  },
  {
    id: 'PO',
    titre: 'production orale',
    texte: 'S’exprimer à l’oral : répondre, décrire, raconter et dialoguer.',
    deroulement: 'Face à l’examinateur·trice ; la fiche sert de support.',
  },
]

/** Ce que la personne sait faire à l’issue du niveau (formulation propre au test). */
const NIVEAU_TEXTE: Record<TcfNiveau, string> = {
  'A0-A1':
    'Comprendre et utiliser des mots et des phrases simples de la vie quotidienne : se présenter, demander et donner des informations personnelles.',
  'A1-A2':
    'Comprendre des phrases et des expressions fréquentes, échanger sur des sujets familiers (famille, achats, travail, environnement proche).',
  'A2-B1':
    'Comprendre l’essentiel d’un message clair, se débrouiller dans la plupart des situations et raconter un événement ou une expérience.',
}

const CONSIGNES = [
  'Lisez chaque consigne attentivement avant de répondre.',
  'QCM : cochez une seule case par question.',
  'Images à reconnaître : cochez toutes les images qui correspondent.',
  'Écrivez lisiblement, au stylo, dans les espaces prévus.',
  'Les dictionnaires, téléphones (sauf pour écouter les audios) et traducteurs ne sont pas autorisés.',
  'Si vous ne savez pas répondre, passez à la question suivante et revenez-y plus tard.',
]

/** Page 1 du TCF : les quatre parties, le niveau visé et les consignes. */
export function TcfInformations({ niveau }: { niveau: TcfNiveau }) {
  return (
    <div className="tcf-info">
      <p className="tcf-info-niveau">
        <span className="tcf-info-badge">Niveau {niveau}</span>
        {NIVEAU_TEXTE[niveau]}
      </p>
      <p className="tcf-info-lead">Il est organisé en quatre parties :</p>
      <ul className="tcf-info-parties">
        {PARTIES.map((p) => (
          <li key={p.id} className="tcf-info-partie">
            <CompetenceIcon competence={p.id} />
            <div>
              <p className="tcf-info-partie-title">
                <b>{p.id}</b> — {p.titre}
              </p>
              <p className="tcf-info-partie-text">{p.texte}</p>
              <p className="tcf-info-partie-how">{p.deroulement}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="tcf-info-sub">Consignes</p>
      <ul className="tcf-info-consignes">
        {CONSIGNES.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  )
}
