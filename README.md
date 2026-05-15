# Saint-Maurice — visualisation des débits Hydro-Québec

## Voir l'animation sur les débits

→ **https://cg-247.github.io/saint-maurice/**

Animation interactive du **bassin Saint-Maurice** (Québec) :
débits, production électrique estimée et niveaux des réservoirs, à partir des données ouvertes
publiées par Hydro-Québec.

L'animation s'ouvre sur la vue **Heure** du mois courant. La barre de contrôle en bas
permet de naviguer dans le temps :

- **Sélecteur de pas** — bascule entre **Heure** (mois courant, plus historique chargé à la demande),
  **Jour** (heure de pointe de chaque jour, tout l'historique), **Semaine** (plage dim → sam, heure de
  pointe) et **Mois** (mois calendaire, heure de pointe).
- **▶ Play / ⏸ Pause** — lecture automatique.
- **◀ ▶▶** — frame précédente / suivante.
- **⏮ Début / ⏭ Maintenant** — saut direct à la première ou dernière frame.
- **Slider** — position libre dans la fenêtre de temps. En vue Heure, glisser vers la gauche charge
  automatiquement le mois précédent en arrière-plan.
- **Vitesse** — Lent / Normal / Rapide / Très rapide pour la lecture auto.
- **Triangle ▾ / ▴ sur une étiquette** — clic pour agrandir l'étiquette d'une centrale ou
  d'un réservoir et afficher les informations détaillées (débits turbiné/déversé, niveaux
  amont/aval, production estimée, sparkline historique, etc.).
- **Clic sur le sparkline** d'une centrale — ouvre un graphique grand format de l'historique.
  Le **curseur du graphique est cliquable** et déplace la ligne du temps : **toutes les
  centrales et tous les réservoirs** de l'animation se réajustent simultanément pour afficher
  l'état du bassin à l'instant choisi.

## Faits saillants automatiques

Un **bandeau textuel** en bas à droite affiche un résumé de l'état de la
rivière pour la date sélectionnée (« Pleine crue printanière », « Plateau
élevé », « Décrue amorcée », etc.) avec le contexte de la fonte au nord et
des mouvements des réservoirs amont.

Ce résumé est **calculé automatiquement à partir des chiffres bruts**, par
règles métier (cascade de seuils + phrases pré-écrites). Pas de jargon, pas
de chiffres dans la prose — les chiffres sont déjà dans les étiquettes et
sparklines de l'animation. Le texte change avec la frame quand vous naviguez
dans le temps.

## Étiquette « Neige et température en amont »

Une petite étiquette dans le **coin haut-gauche** de l'animation affiche, pour
la frame en cours, l'**épaisseur de neige restante** (cm) et les
**températures min/max** (°C) à quatre endroits clés du bassin, du nord vers
le sud :

- **Réservoir Gouin** — tête du bassin
- **Rapide-Blanc** — centre (couvre Chute-Allard, Rapides-des-Cœurs, Rapide-Blanc)
- **La Tuque** — sud (couvre Trenche, Beaumont, La Tuque)
- **Grand-Mère** — aval (couvre Grand-Mère, Shawinigan, La Gabelle)

En bas de l'étiquette, un **verdict de fonte** synthétise la situation :
*« fonte active (T > 0 même la nuit) »*, *« fonte en pause (gel la nuit) »*,
ou *« fonte partielle »* selon le signe des températures observées.

**L'étiquette se masque automatiquement** quand il n'y a plus de neige
significative en amont (≈ 0 cm partout) ou quand aucune donnée météo n'est
disponible — pas la peine d'occuper l'espace si l'info n'apporte rien.

L'objectif est d'**aider à anticiper** les variations de débit : un stock
nival important au nord avec des températures qui passent au-dessus de zéro
annonce une fonte qui va alimenter la rivière dans les jours suivants.

## Sources

### Image de fond

![Schéma du bassin Saint-Maurice](gestion-reservoir.jpg)

L'image de fond est le **schéma d'élévation du bassin Saint-Maurice** publié par
Hydro-Québec. Elle représente, en coupe, les ~280 km du bassin du nord (réservoir Gouin
à 400 m d'élévation) jusqu'au fleuve Saint-Laurent (centrale La Gabelle au niveau 0 m),
avec les neuf centrales (Chute-Allard, Rapides-des-Cœurs, Rapide-Blanc, Trenche, Beaumont,
La Tuque, Grand-Mère, Shawinigan, La Gabelle) et les principaux réservoirs amont
(Gouin, Manouane-A/B/C, Mondonac, Matawin, Mékinac, Cinconsine).

L'animation **superpose dynamiquement les mesures en temps quasi-réel** (débit, production
calculée, niveau, déversement) directement sur cette représentation géographique du bassin.

### Données

Les mesures proviennent de [**Hydro-Québec — Données ouvertes**](https://www.hydroquebec.com/documents-donnees/donnees-ouvertes/) :
fichiers JSON horaires des stations hydrométriques et hydrométéorologiques, mis à jour
quotidiennement. Licence des données : [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr).

### Icônes

- **Microsoft Fluent UI Emoji 3D** ([repo](https://github.com/microsoft/fluentui-emoji), [licence MIT](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE)) — gouttes 💦, engrenage ⚙, pouring 🫗, éclair ⚡, flèches de tendance, nuage (apport).
- **Icône barrage** : <a href="https://www.flaticon.com/fr/icones-gratuites/barrage" title="barrage icônes">Barrage icônes créées par Freepik - Flaticon</a>

### Différence avec l'outil officiel HQ

L'outil officiel d'Hydro-Québec [**Débits et niveaux d'eau**](https://www.hydroquebec.com/production/debits-niveaux-eau.html)
permet de consulter, **un site à la fois**, les graphiques 2D (temps × valeur) sur les
10 derniers jours, par sélection progressive (type de mesure → région → lieu).

Cette animation **fusionne** ces données pour offrir une **vue d'ensemble géographique
animée** du bassin entier : tous les sites en même temps, posés sur le schéma d'élévation,
avec lecture temporelle synchronisée. Permet de voir d'un coup d'œil **où l'eau se trouve
dans le bassin** à un instant donné, comment les pointes se propagent de l'amont vers
l'aval, et quels ouvrages déversent (eau perdue) à un moment donné.

## Méthodologie

- **Débit total / turbiné / déversé** : valeurs publiées directement par Hydro-Québec
  (mesures horaires, sommées sur les multiples turbines/déversoirs d'une même installation).
- **Niveau amont/aval** : station hydrométrique associée à chaque centrale.
- **Production électrique estimée** : `P (MW) = ρ · g · Q_turb · H · η / 10⁶`
  avec η = 0,90 (rendement turbine + génératrice).
- **Couleur** (statut de chaque centrale) : ratio `(débit_courant - min_historique) / (max - min)`
  — vert < 25 %, jaune 25-50 %, orange 50-75 %, rouge ≥ 75 %.
- **Pointe (vues Jour et Semaine)** : on retient l'horodatage où le débit total **bassin**
  est maximum sur la fenêtre, avec toutes les valeurs cohérentes de cet instant.
- **Heure** : convertie en heure locale Québec (HAE/HNE).
- **Neige et température (étiquette météo)** : agrégation des **stations hydrométéorologiques
  Hydro-Québec** voisines du bassin Saint-Maurice. Les valeurs publiées sont des mesures
  horaires de `Épaisseur de neige` (cm, instantanée), `Température Maximum` et
  `Température Minimum` (°C, max/min horaire). Pour chaque zone, on **moyenne** les
  stations qui lui sont rattachées, on **ignore les valeurs sentinelles -999** (capteur
  inactif, typiquement neige nulle hors saison) et on arrondit l'épaisseur à 0 cm sous 0,5 cm.
  Le verdict de fonte est une règle simple basée sur le **signe de T_min** par zone
  (toutes positives ⇒ « fonte active », toutes négatives ⇒ « fonte en pause »,
  mixte ⇒ « fonte partielle »).

  Stations utilisées (identifiants Hydro-Québec) :

  - **Réservoir Gouin** : Gouin Bois (CM2T, `1-10622`), La Loutre (CMUT, `1-7726`)
  - **Rapide-Blanc** : Weymount (CM5G, `1-15532`), Windigo (CMRW, `1-7322`), Rapide-Blanc (CM3U, `1-10496`)
  - **La Tuque** : Lac à la Truite (CMIM, `1-14194`)
  - **Grand-Mère** : Saint-Maurice (CM2X, `1-15306`)

  Ces stations ont été sélectionnées par **proximité géographique** (Haversine) des
  ouvrages couverts par chaque zone. Les données brutes sont issues du même flux ouvert
  que les débits (fichier `VUE_STATIONS_ET_TARAGES`).

## Licences

- **Code** ([HTML/CSS/JS de l'animation](index.html)) : [MIT](LICENSE)
- **Données et image** : [CC BY 4.0](LICENSE-DATA.md) (Hydro-Québec)

## Mise à jour

Animation régénérée manuellement à partir des fichiers ouverts d'Hydro-Québec.
Instantané du 2026-05-15.

---

*Projet personnel non affilié à Hydro-Québec. Les données sont reproduites avec attribution
selon les conditions de la licence d'utilisation des données ouvertes.*