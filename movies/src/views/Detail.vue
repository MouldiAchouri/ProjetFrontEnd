<script setup>
  import { ref, watch, computed } from 'vue'; 
  import { useRoute, useRouter } from 'vue-router';
  import BackButton from '../components/BackButton.vue';
  import favoritesStore from '../stores/favoritesStore'; 
  import historyStore from '../stores/historyStore'; 
    
  const API_KEY = "4726f8f9";
  const BASE_URL = "http://www.omdbapi.com/";
    
  const route = useRoute();
  const router = useRouter();
  const filmDetail = ref(null);
  const isLoading = ref(true);
  const error = ref(null);
    
  const fetchFilmDetail = async (imdbID) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.Response === "True") {
        filmDetail.value = data;
        historyStore.addHistoryEntry(data); 
      } else {
        error.value = data.Error || "Détails du film introuvables.";
      }
    } catch (err) {
      error.value = `Erreur lors du chargement des détails : ${err.message}`;
    } finally {
      isLoading.value = false;
    }
  };
  
  const isCurrentFilmFavorite = computed(() => {
    if (!filmDetail.value) return false;
    return favoritesStore.isFavorite(filmDetail.value.imdbID);
  });
  
  const handleToggleFavorite = () => {
    if (filmDetail.value) {
      const filmForStore = {
        imdbID: filmDetail.value.imdbID,
        Title: filmDetail.value.Title,
        Poster: filmDetail.value.Poster,
        Year: filmDetail.value.Year,
        Type: filmDetail.value.Type || 'movie'
      };
      favoritesStore.toggleFavorite(filmForStore);
    }
  };
  
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
    
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Image+Indisponible';

  // This function swaps the src if the browser cannot load the original image link
  const handleImageError = (event) => {
    event.target.src = placeholderImage;
  };
</script>
    
<template>
  <div class="detail-view">
    <BackButton text="Retour"/>
    <p v-if="isLoading" class="loading-message">Chargement des détails...</p>
    <p v-else-if="error" class="error-message">Erreur : {{ error }}</p>

    <div v-else-if="filmDetail" class="film-details-container">
      <div class="poster-section">
        <div class="poster-wrapper">
            <img
                :src="filmDetail.Poster && filmDetail.Poster !== 'N/A' ? filmDetail.Poster : placeholderImage"
                :alt="filmDetail.Title"
                @error="handleImageError"
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
  .detail-view {
    padding: 40px;
    max-width: 1000px;
    margin: 0 auto; 
  }

  .film-details-container {
    display: flex;
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .poster-wrapper {
      position: relative;
      width: 300px; 
      flex-shrink: 0;
  }

  .poster-section img {
    width: 100%;
    height: auto;
    min-height: 450px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: block;
  }

  .favorite-icon-overlay {
      position: absolute;
      top: 10px;   
      right: 10px; 
      font-size: 2em;
      cursor: pointer;
      user-select: none;
      background: rgba(255, 255, 255, 0.9); 
      border-radius: 50%;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background 0.2s;
      z-index: 10; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .favorite-icon-overlay.is-favorite {
      color: #e74c3c; 
  }

  .favorite-icon-overlay:hover {
      transform: scale(1.1);
      background: white;
  }
  
  .info-section { flex: 1; }
  .title { font-size: 2.2em; margin-bottom: 10px; color: #34495e; }
  .year { font-size: 0.7em; color: #7f8c8d; font-weight: normal; }
  .plot { margin-bottom: 25px; line-height: 1.6; color: #555; }
  .key-info p { margin-bottom: 8px; }
  .key-info strong { color: #3498db; }
  
  @media (max-width: 768px) {
    .detail-view { padding: 15px; }
    .film-details-container {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }
    .poster-section { display: flex; justify-content: center; }
    .poster-wrapper {
        width: 100%;
        max-width: 300px; 
    }
    .title { font-size: 1.8em; text-align: center; }
  }
</style>