<script setup>
  import { computed } from 'vue';
  import favoritesStore from '../stores/favoritesStore'; 
    
  const props = defineProps({
    film: {
      type: Object,
      required: true,
    },
  });
    
  const emit = defineEmits(['view-detail']);
    
  const { isFavorite, toggleFavorite } = favoritesStore; 
    
  // Propriété calculée pour savoir si ce film est favori.
  const isThisFilmFavorite = computed(() => {
    return isFavorite(props.film.imdbID);
  });
    
  // Fonction exécutée lorsqu'on clique sur le CŒUR.
  const handleToggleFavorite = (event) => {
    // Empêche le clic de se propager à la carte entière (navigation).
    event.stopPropagation();
    
    // Appelle l'action du store pour ajouter/supprimer le film.
    toggleFavorite(props.film);
  };
    
  // Fonction exécutée lorsqu'on clique sur le reste de la carte (navigation).
  const handleViewDetail = () => {
    emit('view-detail', props.film.imdbID);
  };
    
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Pas+dAffiche';
  </script>
    
  <template>
    <div
      class="film-card"
      @click="handleViewDetail"
    >
      <div class="poster-container">
        <img
          :src="props.film.Poster !== 'N/A' ? props.film.Poster : placeholderImage"
          :alt="props.film.Title"
        />
      </div>
    
      <div class="film-info">
        <div class="title-and-heart">
          <h3>{{ props.film.Title }}</h3>
          
          <i 
              @click="handleToggleFavorite"
              :class="{'is-favorite': isThisFilmFavorite}"
              class="favorite-icon-inline">
              {{ isThisFilmFavorite ? '❤️' : '🤍' }}
          </i>
        </div>
        
        <p>{{ props.film.Year }} - {{ props.film.Type }}</p>
      </div>
    </div>
  </template>
    
  <style scoped>
  /* Style général de la carte. */
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
  .film-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
    
  /* Conteneur de l'image (pas de positionnement absolu nécessaire ici) */
  .poster-container {
      width: 100%;
      height: 300px; 
  }
  .film-card img {
    width: 100%;
    height: 100%; 
    object-fit: cover;
    border-radius: 4px;
  }
    
  .film-info { 
      margin-top: 10px; 
      /* Le texte général reste centré ou à gauche si votre design l'exige */
      text-align: left; 
  }
    
  /* ⭐️ CRUCIAL : Flexbox pour aligner titre et cœur sur la même ligne ⭐️ */
  .title-and-heart {
      display: flex;
      align-items: center; /* Centre verticalement le titre et le cœur */
      justify-content: space-between; /* Pousse le cœur à l'extrémité droite */
      gap: 5px; /* Petit espace entre le titre et le cœur */
  }
    
  .film-info h3 { 
      font-size: 1.1em; 
      margin: 0; 
      color: #34495e; 
      /* Permet au titre de prendre le plus d'espace possible, et coupe le débordement */
      flex-grow: 1;
      overflow: hidden; 
      text-overflow: ellipsis; 
      white-space: nowrap; 
  }
    
  /* ⭐️ STYLE DE L'ICÔNE EN LIGNE (À CÔTÉ DU TITRE) ⭐️ */
  .favorite-icon-inline {
      font-size: 1.5em; 
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s;
      flex-shrink: 0; /* Empêche le cœur d'être compressé */
      line-height: 1; /* Assure un bon alignement vertical */
  }
    
  /* Cœur vide (gris léger) */
  .favorite-icon-inline {
      color: #999; 
  }
    
  /* Cœur favori (rouge) */
  .favorite-icon-inline.is-favorite {
      color: #e74c3c; 
  }
    
  .favorite-icon-inline:hover {
      transform: scale(1.1);
  }
    
  .film-info p { 
      font-size: 0.9em; 
      color: #7f8c8d; 
      text-align: left; /* Aligné sous le titre */
      margin-top: 3px;
  }
  </style>