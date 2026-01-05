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
    <div class="film-card" @click="handleViewDetail">
      <div class="poster-container">
        <img
          :src="props.film.Poster && props.film.Poster !== 'N/A' ? props.film.Poster : placeholderImage"
          :alt="props.film.Title"
          @error="handleImageError" 
        />
      </div>
  
      <div class="film-info">
        <div class="title-and-heart">
          <h3>{{ props.film.Title }}</h3>
          <span 
            class="favorite-icon-inline" 
            :class="{ 'is-favorite': isThisFilmFavorite }"
            @click="handleToggleFavorite"
          >
            {{ isThisFilmFavorite ? '❤️' : '🤍' }}
          </span>
        </div>
        <p>{{ props.film.Year }} • {{ props.film.Type }}</p>
      </div>
    </div>
  </template>
      
  <style scoped>
  /* Style general de la carte de film */
  .film-card {
    width: 200px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: white;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }
  
  /* Effet de survol sur la carte */
  .film-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
      
  /* Conteneur pour l image de l affiche */
  .poster-container {
    width: 100%;
    height: 280px; 
    overflow: hidden;
    border-radius: 4px;
  }
  
  .film-card img {
    width: 100%;
    height: 100%; 
    object-fit: cover;
  }
      
  /* Zone des informations sous l image */
  .film-info { 
    margin-top: 10px; 
    text-align: left; 
  }
  
  /* Alignement du titre et du coeur */
  .title-and-heart {
    display: flex;
    align-items: flex-start; 
    justify-content: space-between; 
    gap: 5px; 
  }
      
  /* Style du titre avec limitation a 2 lignes */
  .film-info h3 { 
    font-size: 0.95em; 
    margin: 0; 
    color: #34495e; 
    flex-grow: 1;
    overflow: hidden; 
    text-overflow: ellipsis; 
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
      
  /* Style du bouton coeur */
  .favorite-icon-inline {
    font-size: 1.2em; 
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s;
    flex-shrink: 0;
  }
      
  .favorite-icon-inline.is-favorite {
    color: #e74c3c; 
  }
      
  .favorite-icon-inline:hover {
    transform: scale(1.2);
  }
      
  /* Style du texte secondaire (annee et type) */
  .film-info p { 
    font-size: 0.85em; 
    color: #7f8c8d; 
    margin-top: 5px;
    text-transform: capitalize;
  }
  </style>