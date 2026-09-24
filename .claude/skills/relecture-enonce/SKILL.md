---
name: relecture-enonce
description: >-
  Relit consignes et énoncés de problèmes maths (clarté, vouvoiement, niveau de
  langue, neutralité des prénoms, cohérence réponse / figure). À utiliser dès
  qu'on demande de relire, valider ou corriger une fiche, une consigne ou un
  problème.
---

# Relecture des énoncés

## Checklist

- [ ] **Consigne** (`instruction`) : un verbe d’action, vouvoiement (« Calculez », « Posez », « Comparez »).
- [ ] **Problèmes** (`layout: text`) : phrases courtes ; nombres cohérents avec `answer` ; **≥100 modèles distincts par thème×niveau** dans `problem-banks.ts` (aucun prompt dupliqué entre cellules).
- [ ] **Prénoms** fictifs et variés ; pas de données personnelles réelles.
- [ ] **Unités** explicites (cm, m²…) alignées sur la figure / la réponse.
- [ ] **Figure** : cotes affichées = dims utilisées dans le calcul.
- [ ] **Corrigé** : même emplacement que la réponse élève ; pas de spoiler en mode `student`.
- [ ] **N&B** : aucune info critique seulement en couleur.
- [ ] **Densité** : énoncé trop long pour une case → réduire ou passer `columns: 1`.
- [ ] **Alignement** : texte justifié (`text-align: justify`) ; centrer seulement si demandé.
- [ ] **Phrases Gattegno** : un verbe = un modèle ; sujet personne ; complément qui va avec le verbe ; pas de *la maison voit une voiture*. Voir `phrase-gattegno`.

## À corriger immédiatement

- Ambiguïté (plusieurs réponses possibles non prévues).
- Incohérence calcul ↔ `answer`.
- Anglicismes (« worksheet », « solve for x » dans une consigne élève primaire).
- Texte collé depuis un site tiers.

## Terminé quand

Consigne claire · réponse unique · figure alignée · ton scolaire français.
