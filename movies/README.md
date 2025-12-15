# Projet films

Une application web simple et intuitive pour rechercher des films, les ajouter à vos favoris et consulter votre historique de visionnage.

## Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [API](#api)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commandes disponibles](#commandes-disponibles)

## Description

Ce projet est une interface front-end développée avec Vue.js qui permet aux utilisateurs de naviguer dans un catalogue de films. L'application est conçue pour être rapide, réactive et facile à utiliser, offrant les fonctionnalités essentielles pour tout amateur de cinéma : la recherche de films, la gestion d'une liste de favoris et le suivi des films consultés.

## Fonctionnalités

-   **Recherche de films** : Un champ de recherche pour trouver des films par leur titre.
-   **Détails du film** : Affiche des informations détaillées pour chaque film sélectionné.
-   **Gestion des favoris** : Possibilité d'ajouter et de retirer des films d'une liste de favoris personnelle.
-   **Historique de consultation** : Garde une trace des films que vous avez consultés.
-   **Navigation fluide** : Utilisation de Vue Router pour une expérience de navigation sans rechargement de page.

## Technologies utilisées

-   **Vue.js (v3)** : Le framework JavaScript progressif pour la construction de l'interface utilisateur.
-   **Vite** : L'outil de build front-end moderne qui offre une expérience de développement ultra-rapide.
-   **Vue Router** : La bibliothèque de routage officielle pour Vue.js.
-   **JavaScript (ESM)** : Utilisation de modules ES pour une gestion d'état simple et réactive (`stores`).
-   **CSS** : Styles personnalisés pour une présentation claire et agréable.

## API

Cette application récupère les données des films à partir d'une API externe (par exemple, http://www.omdbapi.com/)). 
    Pour que les appels à l'API fonctionnent, vous devez obtenir une clé d'API auprès du fournisseur.

Une fois votre clé obtenue, vous devez la stocker de manière sécurisée dans un fichier d'environnement.

**Mise en garde :** La clé d'API est directement intégrée dans le code du composant Vue (Vue.js Composition API) et sera visible dans le code source de l'application déployée.
Il est recommandé, pour les clés sensibles, d'utiliser des fichiers d'environnement (`.env`) ou un serveur proxy.

## Structure du projet

```
/
├── public/                  # Fichiers statiques
├── src/
│   ├── assets/              # Fichiers CSS, polices, images
│   ├── components/          # Composants Vue réutilisables
│   ├── router/              # Configuration du routage
│   ├── stores/              # Modules de gestion d'état
│   ├── views/               # Composants de page
│   ├── App.vue              # Composant racine
│   └── main.js              # Point d'entrée de l'application
├── .gitignore               # Fichiers et dossiers ignorés par Git
├── index.html               # Fichier HTML principal
├── package.json             # Dépendances et scripts du projet
└── vite.config.js           # Configuration de Vite
```

## Prérequis

-   [Node.js](https://nodejs.org/) (version `^20.19.0` ou `>=22.12.0`)
-   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)

## Installation

1.  **Clonez le dépôt Git :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd nom-du-dossier
    ```

2.  **Installez les dépendances de base :**
    ```bash
    npm install
    ```


## Utilisation

Pour lancer l'application en mode développement :

```bash
npm run dev
```

## Commandes disponibles

-   `npm run dev`: Lance le serveur de développement.
-   `npm run build`: Compile l'application pour la production.
-   `npm run preview`: Prévisualise le build de production.