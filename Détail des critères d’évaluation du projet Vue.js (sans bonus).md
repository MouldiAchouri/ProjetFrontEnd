# Détail des critères d’évaluation du projet Vue.js (sans bonus)

Ce document décrit en détail les critères utilisés pour évaluer les projets Vue.js des étudiant·e·s.  
Il peut être utilisé comme support de suivi, d’auto-évaluation ou comme grille de correction standardisée.

---

## README (3 points)

| Critère                            | Ce qu'on attend                                              | Exemple concret                                              |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Installation bien expliquée**    | Commandes pour cloner, installer, lancer le projet           | ```bash<br>git clone ...<br>cd projet<br>npm install<br>npm run serve<br>``` |
| **Structure du projet décrite**    | Arborescence ou explication des répertoires principaux       | Section “Structure” avec `/src/components`, `/views`, etc.   |
| **Utilisation de l’API expliquée** | Lien vers l’API utilisée + exemple de requête ou d’intégration | https://www.omdbapi.com + exemple avec `axios` dans le code  |

> 💡 **Barème d’attribution :**
> - 3/3 : Tout est présent et clair
> - 2/3 : Deux éléments sur trois (souvent API ou structure manquante)
> - 1/3 ou moins : README trop sommaire

---

## Qualité du code (8 points)

| Critère                              | Ce qu'on attend                                             | Exemple concret                                              |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------ |
| **Code clair, modulaire, structuré** | Composants bien nommés, indentation propre, logique séparée | `MovieCard.vue`, `SearchResults.vue`, etc. bien isolés       |
| **Utilisation de Composition API**   | Syntaxe Vue 3 moderne : `setup()`, `ref`, `computed`        | ```js<br>setup() { const name = ref(''); return { name }; }``` |
| **Composants réutilisables**         | Utilisation de `props`, `emit`, évite la duplication        | `SearchBar.vue` utilisé sur plusieurs pages                  |

> 💡 **Barème d’attribution :**
> - 8/8 : Code structuré, Composition API bien utilisée
> - 6/8 : Options API mais composants réutilisables
> - 4/8 ou moins : Peu de séparation ou logique en vrac

---

## Interface utilisateur (6 points)

| Critère                                       | Ce qu'on attend                                      | Exemple concret                                             |
| --------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| **Interface responsive et agréable**          | Utilisation de media queries, mise en page adaptable | CSS avec `@media`, Flexbox ou Grid responsive               |
| **Navigation claire**                         | Routing fluide, organisation logique des pages       | `router-link` vers `/details/:id`, `/search`, etc.          |
| **Icônes / images enrichissant l’expérience** | Visuels, affiches, pictos utiles pour l’UX           | Images des films, logo, favicon, pictogrammes de navigation |

> 💡 **Barème d’attribution :**
> - 6/6 : UI claire, responsive, riche visuellement
> - 4-5/6 : Bon design mais non responsive
> - 3/6 ou moins : Interface fonctionnelle mais peu soignée

---

## Total hors bonus : 17 / 20

Les 3 derniers points bonus sont à ajouter à cette base, séparément si activés par le projet.

---

*Document de référence pédagogique – Vue.js Projects*  
Dernière mise à jour : Avril 2025