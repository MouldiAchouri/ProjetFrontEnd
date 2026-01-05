<script setup>
  /* Importation de la fonction de calcul reactif de vue */
  import { computed } from 'vue';
  /* Importation du magasin de donnees pour la gestion des favoris */
  import favoritesStore from '../stores/favoritesStore'; 
      
  /* Definition des proprietes recues par le composant notamment l objet film */
  const props = defineProps({
    film: {
      type: Object,
      required: true,
    },
  });
      
  /* Definition des evenements que le composant peut emettre vers son parent */
  const emit = defineEmits(['view-detail']);
      
  /* Recuperation des methodes utilitaires directement depuis le magasin de favoris */
  const { isFavorite, toggleFavorite } = favoritesStore; 
      
  /* Propriete calculee pour verifier en temps reel si ce film precis est dans les favoris */
  const isThisFilmFavorite = computed(() => {
    /* Appel de la fonction de verification avec l identifiant unique du film */
    return isFavorite(props.film.imdbID);
  });
      
  /* Fonction declenchee lors du clic sur l icone en forme de coeur */
  const handleToggleFavorite = (event) => {
    /* Arret de la propagation de l evenement pour ne pas declencher le clic sur la carte */
    event.stopPropagation();
    
    /* Ajout ou suppression du film dans le magasin de favoris */
    toggleFavorite(props.film);
  };
      
  /* Fonction declenchee lors du clic sur la carte pour voir les details */
  const handleViewDetail = () => {
    /* Emission de l evenement vers le parent avec l identifiant du film */
    emit('view-detail', props.film.imdbID);
  };
      
  /* Url de l image de remplacement si l affiche originale est manquante */
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Image+Indisponible';
  
  /* Fonction de secours si le chargement de l image de l api echoue */
  const handleImageError = (event) => {
    /* Remplacement de la source par l image par defaut */
    event.target.src = placeholderImage;
  };
  </script>
      
  <template>
    /* Conteneur principal de la carte avec detection du clic pour la navigation */
    <div class="film-card" @click="handleViewDetail">
      /* Zone reservee a l affichage de l affiche du film */
      <div class="poster-container">
        /* Affichage de l image avec verification du contenu et gestion d erreur */
        <img
          :src="props.film.Poster !== 'N/A' ? props.film.Poster : placeholderImage"
          :alt="props.film.Title"
          @error="handleImageError" 
        />
      </div>
    </div>
  </template>
      
  <style scoped>
  /* Style de base pour l apparence de la carte de film */
  .film-card {
    width: 200px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: white;
    cursor: pointer;
  }
  
  /* Effet visuel de surlevement lors du passage de la souris */
  .film-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
    
  /* Conteneur pour calibrer la taille de l image de l affiche */
  .poster-container {
      width: 100%;
      height: 300px; 
  }
  
  /* Ajustement de l image pour remplir le conteneur sans deformation */
  .film-card img {
    width: 100%;
    height: 100%; 
    object-fit: cover;
    border-radius: 4px;
  }
    
  /* Zone des informations textuelles situee sous l image */
  .film-info { 
      margin-top: 10px; 
      text-align: left; 
  }
  
  /* Disposition en ligne pour aligner le titre et l icone de favori */
  .title-and-heart {
      display: flex;
      align-items: center; 
      justify-content: space-between; 
      gap: 5px; 
  }
    
  /* Style du titre avec gestion du texte trop long par des points de suspension */
  .film-info h3 { 
      font-size: 1.1em; 
      margin: 0; 
      color: #34495e; 
      flex-grow: 1;
      overflow: hidden; 
      text-overflow: ellipsis; 
      white-space: nowrap; 
  }
    
  /* Style de l icone de favori cliquable */
  .favorite-icon-inline {
      font-size: 1.5em; 
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s;
      flex-shrink: 0; 
      line-height: 1; 
  }
    
  /* Couleur grise par defaut pour un coeur non selectionne */
  .favorite-icon-inline {
      color: #999; 
  }
    
  /* Couleur rouge pour indiquer que le film est en favori */
  .favorite-icon-inline.is-favorite {
      color: #e74c3c; 
  }
    
  /* Effet de zoom lors du survol de l icone de coeur */
  .favorite-icon-inline:hover {
      transform: scale(1.1);
  }
    
  /* Style pour les informations secondaires comme l annee ou le type */
  .film-info p { 
      font-size: 0.9em; 
      color: #7f8c8d; 
      text-align: left; 
      margin-top: 3px;
  }
  </style>