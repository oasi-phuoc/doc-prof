# Horloges et minuteurs à aiguilles

État vérifié le 7 novembre 2026 : **120 horloges et 18 minuteurs** utilisent un cadran peint commun et des aiguilles calculées, selon la méthode approuvée par l’utilisateur. Ce périmètre couvre les illustrations dédiées aux heures et durées, les anciens alias de vocabulaire et le réveil bleu ; les petites horloges accessoires des scènes ne font pas partie de cet inventaire.

Le fond peint commun est `public/lib/images/tcf/clock-assets/cadran-vierge-commun-20261106.webp`. Les aiguilles sont rendues avec Python/Pillow : même couleur, même longueur, même épaisseur, même pivot. Angle des minutes = 6 × minute ; angle des heures = 30 × (heure modulo 12) + 0,5 × minute. Les minuteurs ont un secteur rouge proportionnel à la durée et une seule aiguille ; l’unité est explicite. Le réveil conserve son boîtier bleu.

Le registre `horloges-aiguilles-uniformes-20261106.json` contient les heures, durées, angles et empreintes des 138 fichiers. Les noms historiques sont conservés pour les fiches enregistrées. Les sources, questions et corrigés restent identiques.

Contrôle sans modification :

```sh
python scripts/render_tcf_clocks.py --check
python scripts/test_tcf_clock_hands.py
```

Pour reconstruire, utiliser `scripts/render_tcf_clocks.py` (ou le lanceur `scripts/replace-digital-clocks.mjs`). Les fichiers reconstruits doivent être revus avant `--approve-reviewed`. Un rendu dont le modèle et l’empreinte sont déjà conformes est conservé. Les originaux autorisés à être harmonisés sont documentés séparément.
