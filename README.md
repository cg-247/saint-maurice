# Saint-Maurice — visualisation des débits Hydro-Québec

## Voir l'animation sur les débits

→ **URL** : <https://cg-247.github.io/saint-maurice/index.html>

Animation interactive du **bassin Saint-Maurice** (Québec) : débits, production électrique
estimée et niveaux des réservoirs, à partir des données ouvertes publiées par Hydro-Québec.

## Navigation

La barre de contrôle en bas permet de naviguer dans le temps :

- **Sélecteur ** — bascule entre **Heure**, **Jour**, **Semaine** et **Mois**.
- **Slider** — position libre dans le temps.
- **Clic sur une étiquette ou un sparkline** — agrandit l'installation et affiche son détail
  (débits, niveaux, production estimée, graphique grand format). Le curseur du graphique déplace
  toute l'animation à l'instant choisi.
- **Indicateur de turbines** *(vue bureau)* — sur une centrale agrandie, le type de turbine et le
  nombre de groupes en fonction ; un clic ouvre le régime estimé de chaque groupe.
- **Icône ℹ** — sur chaque étiquette (centrale ou réservoir), ouvre une fiche technique avec les
  données du barrage : classe de conséquences, hauteur, capacité de retenue, année de construction (source : CEHQ).

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

Les fiches techniques des barrages (classe de conséquences, hauteur, capacité de retenue,
année de construction) proviennent du [**Répertoire des barrages du CEHQ**](https://www.cehq.gouv.qc.ca/barrages/default.asp)
(Centre d'expertise hydrique du Québec, MELCCFP). Ces données sont accessibles publiquement
dans le cadre du programme de suivi de la sécurité des barrages au Québec.

### Icônes

- **Microsoft Fluent UI Emoji 3D** ([repo](https://github.com/microsoft/fluentui-emoji), [licence MIT](https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE)) — gouttes 💦, engrenage ⚙, pouring 🫗, éclair ⚡, flèches de tendance, nuage (apport).
- **Icône barrage** : <a href="https://www.flaticon.com/fr/icones-gratuites/barrage" title="barrage icônes">Barrage icônes créées par Freepik - Flaticon</a>
- **Icônes turbines** (Francis, Kaplan — vue bureau) : <a href="https://www.flaticon.com/fr/icones-gratuites/turbine" title="turbine icônes">Turbine icônes créées par Freepik - Flaticon</a>

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
- **Vues agrégées (Jour, Semaine, Mois)** : pour chaque centrale, on identifie le ts horaire
  où **son** débit total atteint son pic dans la période (jour, semaine ou mois), puis on lit
  toutes les autres séries (turbiné, déversé, niveau amont, niveau aval) à **ce ts précis**.
  La chute `H = amont - aval` et la puissance `P = 9,81 · Q · H · η / 1000` sont donc
  calculées au même instant que le pic débit, ce qui garantit la cohérence physique.
  Les niveaux de réservoir sont moyennés (variables lentes). Les apports (publiés en agrégat
  journalier) retiennent le max des apports journaliers de la période.
- **Heure** : valeurs instantanées au ts brut, convertie en heure locale Québec (HAE/HNE).

### Estimation des turbines en service *(vue bureau uniquement)*

Hydro-Québec publie le **débit turbiné total** d'une centrale, pas le détail par groupe. À partir
de ce total, du **type de turbine** (Francis ou Kaplan/Saxo, selon les fiches publiques de chaque
centrale) et du **nombre de groupes**, l'animation **estime** une configuration plausible — c'est
une reconstruction, pas une mesure :

- **Combien de groupes en service** : on en met le moins possible pour que chacun travaille dans sa
  **zone de bon rendement** (~85 % de son régime nominal). Sous un **plancher** technique (≈ 50 % pour
  les Francis, ≈ 25 % pour les Kaplan), un groupe est arrêté plutôt que de tourner à bas régime
  (vibrations, cavitation, usure).
- **Répartition de la charge** : également entre les groupes en service (optimum pour des groupes
  identiques).
- **Surcharge** : un groupe peut dépasser **100 %** de son régime nominal (réserve d'environ
  +5 à +15 %), généralement en crue, pour turbiner le maximum avant de devoir déverser. L'animation
  l'affiche alors en orange.

Ces valeurs par turbine sont **estimées** (la répartition réelle entre groupes n'est pas mesurée).

## Licences

- **Code** ([HTML/CSS/JS de l'animation](index.html)) : [MIT](LICENSE)
- **Données et image** : [CC BY 4.0](LICENSE-DATA.md) (Hydro-Québec)

## Installer comme application

Tu peux ajouter l'animation à l'écran d'accueil de ton téléphone ou au menu de
ton ordinateur pour l'ouvrir comme une vraie app, sans barre d'adresse.

### Sur Android (Chrome, Edge, Samsung Internet, Brave)

1. Ouvre <https://cg-247.github.io/saint-maurice/index.html> dans Chrome.
2. Une bannière « Ajouter à l'écran d'accueil » apparaît en bas. Sinon : menu **⋮ → Installer
   l'application** (ou **Ajouter à l'écran d'accueil**).
3. L'icône apparaît sur ton écran d'accueil, comme n'importe quelle app.

### Sur iPhone / iPad (Safari uniquement)

1. Ouvre <https://cg-247.github.io/saint-maurice/index.html> dans **Safari**
   (Chrome iOS ne supporte pas l'installation).
2. Touche le bouton **Partager** (carré avec flèche vers le haut).
3. Choisis **« Ajouter à l'écran d'accueil »**.

### Sur ordinateur (Windows, macOS, Linux)

1. Ouvre <https://cg-247.github.io/saint-maurice/index.html> dans Chrome, Edge ou Brave.
2. Une **icône d'installation** (un écran avec une flèche vers le bas) apparaît à droite
   de la barre d'adresse → clic dessus.
3. L'app est ajoutée au menu Démarrer (Windows), Launchpad (macOS) ou menu d'applications
   (Linux) ; tu peux l'épingler à la barre des tâches / au Dock.

### Désinstaller

- **Mobile** : long-press sur l'icône → Désinstaller (Android) ou Supprimer l'app (iOS).
- **Ordinateur** : ouvre l'app, clic sur les 3 points en haut à droite → Désinstaller.

---

*Projet personnel non affilié à Hydro-Québec. Les données sont reproduites avec attribution
selon les conditions de la licence d'utilisation des données ouvertes.*
