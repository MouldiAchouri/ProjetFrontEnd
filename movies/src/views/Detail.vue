<script setup>
  import { ref, watch, computed } from 'vue'; 
  import { useRoute, useRouter } from 'vue-router';
  import favoritesStore from '../stores/favoritesStore'; // Import du store de favoris
  
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
  
  const route = useRoute();
  const router = useRouter();
  const filmDetail = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
  
  // Récupère les fonctions du store de favoris 
  const { isFavorite, toggleFavorite } = favoritesStore;
  
  // Définition de la fonction asynchrone pour récupérer les détails d'un film.
  const fetchFilmDetail = async (imdbID) => {
    isLoading.value = true;
    error.value = null;
  
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.Response === "True") {
        filmDetail.value = data;
      } else {
        error.value = data.Error || "Détails du film introuvables.";
      }
    } catch (err) {
      error.value = `Erreur lors du chargement des détails : ${err.message}`;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Propriété calculée pour l'état du cœur
  const isCurrentFilmFavorite = computed(() => {
    if (!filmDetail.value) return false;
    return isFavorite(filmDetail.value.imdbID);
  });
  
  // Gère le clic sur l'icône de cœur.
  const handleToggleFavorite = () => {
    if (filmDetail.value) {
      // Passer un objet contenant seulement les infos nécessaires (ID, Titre, Poster) pour le store
      const filmForStore = {
        imdbID: filmDetail.value.imdbID,
        Title: filmDetail.value.Title,
        Poster: filmDetail.value.Poster,
        Year: filmDetail.value.Year,
        Type: filmDetail.value.Type || 'movie'
      };
      toggleFavorite(filmForStore);
    }
  };

  // Surveille le paramètre de route 'id' pour recharger le film.
  watch(
    () => route.params.id, 
    (newID) => {
      if (newID) {
        fetchFilmDetail(newID);
      } else {
        error.value = "Erreur : ID du film manquant dans l'URL.";
        isLoading.value = false;
      }
    },
    { immediate: true }
  );
  
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Pas+d Affiche';
</script>
  
<template>
    <div class="detail-view">
      <button @click="router.back()" class="back-button">← Retour à la recherche</button>
  
      <p v-if="isLoading" class="loading-message">Chargement des détails...</p>
      <p v-else-if="error" class="error-message">Erreur : {{ error }}</p>
  
      <div v-else-if="filmDetail" class="film-details-container">
        <div class="poster-section">
          <div class="poster-wrapper">
              <img
                  :src="filmDetail.Poster !== 'N/A' ? filmDetail.Poster : placeholderImage"
                  :alt="filmDetail.Title"
              />
              <i 
                  @click="handleToggleFavorite"
                  :class="{'is-favorite': isCurrentFilmFavorite}"
                  class="favorite-icon-overlay">
                  {{ isCurrentFilmFavorite ? '❤️' : '🤍' }}
              </i>
          </div>
        </div>
        <div class="info-section">
          <h1 class="title">{{ filmDetail.Title }} <span class="year">({{ filmDetail.Year }})</span></h1>
          
          <p class="plot">{{ filmDetail.Plot }}</p>
  
          <div class="key-info">
            <p><strong>Genre :</strong> {{ filmDetail.Genre }}</p>
            <p><strong>Réalisateur :</strong> {{ filmDetail.Director }}</p>
            <p><strong>Acteurs :</strong> {{ filmDetail.Actors }}</p>
            <p><strong>Durée :</strong> {{ filmDetail.Runtime }}</p>
            <p><strong>Note IMDb :</strong> {{ filmDetail.imdbRating }}</p>
          </div>
        </div>
      </div>
    </div>
</template>
  
<style scoped>
/* Styles par défaut */
.detail-view { padding: 40px; max-width: 1000px; margin: 0 auto; }
/* ... autres styles de base ... */

.back-button {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* Flexbox horizontal sur grand écran. */
.film-details-container {
  display: flex;
  gap: 40px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Conteneur pour le positionnement relatif du cœur  */
.poster-wrapper {
    position: relative;
    width: 300px; /* Largeur de l'affiche par défaut */
    height: 450px; /* Hauteur standard pour un ratio 2:3 */
}

.poster-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Style de l'icône de favoris superposée (Haut à Droite) */
.favorite-icon-overlay {
    position: absolute;
    top: 5px;   /* 5px du haut */
    right: 5px; /* 5px de la droite */
    
    font-size: 2em;
    cursor: pointer;
    user-select: none;
    background: rgba(255, 255, 255, 0.8); /* Fond semi-transparent */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    z-index: 10; /* Assure que le cœur est au-dessus de l'image */
    color: #999; /* Cœur vide (gris) */
}

.favorite-icon-overlay.is-favorite {
    color: #e74c3c; /* Rouge vif pour le cœur plein */
}

.favorite-icon-overlay:hover {
    transform: scale(1.1);
}

.info-section { flex: 1; }
.title { font-size: 2.2em; margin-bottom: 10px; color: #34495e; }
/* ... autres styles d'information ... */



@media (max-width: 768px) {
  .detail-view { padding: 15px; }
  
  /* Empile l'affiche et le texte verticalement. */
  .film-details-container {
      flex-direction: column;
      gap: 20px;
      padding: 20px;
  }
  
  /* Centre l'affiche et ajuste la taille du wrapper sur mobile */
  .poster-section {
      display: flex;
      justify-content: center;
  }

  .poster-wrapper {
      width: 100%;
      max-width: 250px; /* Limite la largeur de l'image sur mobile */
      height: auto; /* Permet à la hauteur de s'adapter */
  }

  .poster-section img {
      width: 100%;
      height: auto;
  }

  .title {
      font-size: 1.8em;
      text-align: center;
  }
}
</style>