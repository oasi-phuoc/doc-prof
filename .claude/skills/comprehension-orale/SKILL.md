---
name: comprehension-orale
description: >-
  Importe et maintient les CO (compréhension orale) TCF depuis le repo
  soutien-scolaire. À utiliser dès qu’on parle de CO TCF, banques
  src/content/tcf/*/co.json, audios soutien, ou import des questions orales.
---

# Compréhension orale TCF (soutien-scolaire)

Les CO de pratique viennent du repo **soutien-scolaire** et vivent dans les
banques TCF, pas dans le domaine français FLE.

## Emplacement

| Élément | Chemin |
|---|---|
| Banques | `src/content/tcf/{a0-a1,a1-a2,a2-b1}/co.json` |
| Audios (déjà classés) | `public/lib/audio/comprehension/{thème}/{niveau}__{stem}.mp3` |
| Manifest | `scripts/audio-theme-manifest.json` |
| Import | `scripts/import-tcf-co-soutien.mjs` |
| Libellés sélecteur | `src/tcf/sources.ts` (`tcf-ss-…`) |

Niveaux : `facile-a1` → `A0-A1`, `moyen-a2` → `A1-A2`, `difficile-b1` → `A2-B1`.

## Identifiants

- Préfixe : `tcf-ss-{a1\|a2\|b1}-s{N}-co-{1-4}`
- Séries de 4 exercices (slots CO Exercice 1…4)
- Les entrées `tcf-ss-*` sont régénérables ; le script les remplace sans toucher aux autres CO TCF.

## Relancer l’import

```bash
# clone si besoin
git clone --depth 1 https://github.com/oasi-phuoc/soutien-scolaire.git /tmp/soutien-scolaire
SOUTIEN_ROOT=/tmp/soutien-scolaire node scripts/import-tcf-co-soutien.mjs
```

Le script lit transcriptions + QCM soutien, ne garde que les audios du manifest
qui ont transcript **et** pool de questions, et écrit des exercices `complet`
(QCM texte, 4 questions en A0-A1 / 6 en A1-A2 et A2-B1).

## Forme d’un exercice

Comme les autres CO TCF `complet` : `support.audio` (chemin absolu
`/lib/audio/comprehension/…`), `support.transcription`, `questions[]` en
`qcm_texte` (3 choix, une bonne réponse).

## Workflow agent (doc-prof)

Sauf demande explicite contraire :

- **Pas** de `lint`, `build`, aperçu A4, screenshots, enregistrements ni plan de test.
- **Pas** de branche / PR : commit et **push direct sur `origin/main`**.
- L’utilisateur teste lui-même dans l’UI.

Raccourci Cursor pour ignorer les tests : `/no-test` (même effet ici par défaut).
