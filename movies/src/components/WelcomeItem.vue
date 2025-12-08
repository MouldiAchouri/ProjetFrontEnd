<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
  
  /* Style de base de l'élément pour les petits écrans. */
  .item {
    /* Marge au-dessus de l'élément. */
    margin-top: 2rem;
    /* Active Flexbox pour aligner l'icône et le contenu horizontalement. */
    display: flex;
    /* Définit le contexte de positionnement pour les éléments enfants (positionnement absolu). */
    position: relative;
  }
  
  /* Style du conteneur des détails (texte). */
  .details {
    /* Permet au contenu de prendre tout l'espace restant dans le conteneur Flex. */
    flex: 1;
    /* Marge à gauche pour séparer l'icône du contenu. */
    margin-left: 1rem;
  }
  
  /* Style de la balise <i> (l'emplacement de l'icône). */
  i {
    /* Active Flexbox pour centrer l'icône. */
    display: flex;
    /* Centre les éléments verticalement. */
    place-items: center;
    /* Centre les éléments horizontalement. */
    place-content: center;
    /* Largeur fixe de l'icône. */
    width: 32px;
    /* Hauteur fixe de l'icône. */
    height: 32px;
  
    /* Couleur de l'icône (utilise une variable CSS globale). */
    color: var(--color-text);
  }
  
  /* Style du titre (h3). */
  h3 {
    /* Taille de police. */
    font-size: 1.2rem;
    /* Poids de la police. */
    font-weight: 500;
    /* Marge inférieure. */
    margin-bottom: 0.4rem;
    /* Couleur du titre (utilise une variable CSS globale). */
    color: var(--color-heading);
  }
  
  /* Media query pour les écrans plus larges (ordinateur de bureau, etc.). */
  @media (min-width: 1024px) {
    /* Styles pour le conteneur principal sur les grands écrans. */
    .item {
      /* Supprime la marge supérieure (réinitialisation). */
      margin-top: 0;
      /* Rembourrage : crée l'espace nécessaire pour la ligne verticale décorative. */
      padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    }
  
    /* Styles pour l'emplacement de l'icône (positionné à côté de la ligne verticale). */
    i {
      /* Positionnement vertical : centre l'icône. */
      top: calc(50% - 25px);
      /* Positionnement horizontal : décale l'icône à gauche (par rapport au conteneur parent). */
      left: -26px;
      /* Positionnement absolu par rapport au conteneur .item. */
      position: absolute;
      /* Ajoute une bordure. */
      border: 1px solid var(--color-border);
      /* Définit l'arrière-plan. */
      background: var(--color-background);
      /* Arrondit les coins. */
      border-radius: 8px;
      /* Augmente la taille de l'icône. */
      width: 50px;
      height: 50px;
    }
  
    /* Pseudo-élément :before (Ligne verticale au-dessus de l'icône). */
    .item:before {
      /* Contenu vide requis pour l'affichage. */
      content: ' ';
      /* Crée la ligne verticale fine. */
      border-left: 1px solid var(--color-border);
      /* Positionnement absolu. */
      position: absolute;
      /* Aligne la ligne sur le côté gauche. */
      left: 0;
      /* Positionne le début de la ligne (au-dessus de l'icône). */
      bottom: calc(50% + 25px);
      /* Définit la hauteur de la ligne. */
      height: calc(50% - 25px);
    }
  
    /* Pseudo-élément :after (Ligne verticale en dessous de l'icône). */
    .item:after {
      /* Contenu vide requis pour l'affichage. */
      content: ' ';
      /* Crée la ligne verticale fine. */
      border-left: 1px solid var(--color-border);
      /* Positionnement absolu. */
      position: absolute;
      /* Aligne la ligne sur le côté gauche. */
      left: 0;
      /* Positionne le début de la ligne (en dessous de l'icône). */
      top: calc(50% + 25px);
      /* Définit la hauteur de la ligne. */
      height: calc(50% - 25px);
    }
  
    /* Masque la ligne supérieure (:before) du tout premier élément pour un rendu propre. */
    .item:first-of-type:before {
      display: none;
    }
  
    /* Masque la ligne inférieure (:after) du tout dernier élément pour un rendu propre. */
    .item:last-of-type:after {
      display: none;
    }
  }
  </style>