<script setup>
  import favoritesStore from '../stores/favoritesStore'; // Import du store de favoris
  import FilmCard from '../components/FilmCard.vue';
  import BackButton from '../components/BackButton.vue';
  import { useRouter } from 'vue-router';
  import {computed} from "vue";
  
  const router = useRouter();
  
  // Récupère la liste des favoris depuis le store (elle est réactive !).
  const favorisList = favoritesStore.state.list;
  
  // Fonction pour naviguer vers les détails d'un film.
  const goToDetail = (imdbID) => {
      router.push(`/movie/${imdbID}`);
  };
  </script>
  
  <template>
    <div class="favoris-view">
      <BackButton text="Retour"/>
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">❤️ Mes Films Favoris</h1>
  
      <p v-if="favorisList.length === 0" class="empty-message">
        Vous n'avez pas encore ajouté de film à vos favoris.
        Recherchez un film et cliquez sur le cœur !
      </p>
  
      <div v-else class="results-grid">
          <FilmCard
              v-for="film in favorisList"
              :key="film.imdbID"
              :film="film"
              @view-detail="goToDetail" 
          />
      </div>
    </div>
  </template>
  
  <style scoped>
  .favoris-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
  .empty-message { text-align: center; font-size: 1.2em; color: #7f8c8d; margin-top: 50px; }
  .results-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      padding-top: 20px;
  }
  </style>