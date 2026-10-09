import type { TcfCompetence } from '@/tcf/types'
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
    texte: 'Remplir un formulaire, compléter un dialogue, écrire un message et un e-mail.',
    deroulement: 'Écrivez sur les lignes et respectez le nombre de mots indiqué.',
  },
  {
    id: 'PO',
    titre: 'production orale',
    texte: 'Entretien dirigé, poser des questions sur un thème, décrire une image puis jouer une situation.',
    deroulement: 'Face à l’examinateur·trice ; la fiche sert de support.',
  },
]

/** Page 1 du TCF : les quatre parties du test. */
export function TcfInformations() {
  return (
    <div className="tcf-info">
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
    </div>
  )
}
