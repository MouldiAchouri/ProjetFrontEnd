<script setup>
  // Import du hook useRouter depuis vue-router
  import { useRouter } from 'vue-router'
  
  // Initialisation du router pour la navigation
  const router = useRouter()
  
  // Définition des props du composant
  const props = defineProps({
    // Prop permettant de personnaliser le texte du bouton
    text: {
      // Type de la prop
      type: String,
      // Valeur par défaut du texte
      default: '← Retour'
    }
  })
  
  // Fonction qui gère le retour arrière
  const goBack = () => {
    // Vérifie s’il existe une page précédente dans l’historique
    if (window.history.state?.back) {
      // Retour à la page précédente
      router.back()
    } else {
      // Redirection vers la page d’accueil si aucun historique
      router.push('/')
    }
  }
  </script>
  
  <template>
    <!-- Bouton permettant de revenir à la page précédente -->
    <button
      @click="goBack"

      class="back-button"
    >
      <!-- Affichage du texte provenant de la prop -->
      {{ text }}
    </button>
  </template>
  
  <style scoped>
  /* Style principal du bouton */
  .back-button {
    /* Espace sous le bouton */
    margin-bottom: 25px;
  
    /* Espacement intérieur */
    padding: 10px 15px;
  
    /* Couleur de fond */
    background-color: #3498db;
  
    /* Couleur du texte */
    color: white;
  
    /* Suppression de la bordure */
    border: none;
  
    /* Coins arrondis */
    border-radius: 6px;
  
    /* Curseur pointeur */
    cursor: pointer;
  
    /* Taille du texte */
    font-size: 16px;
  
    /* Texte en gras */
    font-weight: bold;
  
    /* Animation fluide */
    transition: background-color 0.2s, transform 0.1s;
  
    /* Alignement avec flex */
    display: inline-flex;
  
    /* Centrage vertical */
    align-items: center;
  
    /* Suppression du soulignement */
    text-decoration: none;
  }
  
  /* Style au survol */
  .back-button:hover {
    /* Couleur plus foncée */
    background-color: #2980b9;
  }
  
  /* Style lors du clic */
  .back-button:active {
    /* Effet de pression */
    transform: scale(0.98);
  }
  
  /* Styles pour les écrans mobiles */
  @media (max-width: 600px) {
    .back-button {
      /* Pleine largeur */
      width: 100%;
  
      /* Contenu centré */
      justify-content: center;
  
      /* Espace inférieur réduit */
      margin-bottom: 20px;
    }
  }
  </style>
  