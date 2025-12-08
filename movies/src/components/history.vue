<script setup>
    import historyStore from '../stores/historyStore';
    import FilmCard from '../components/FilmCard.vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    
    // Récupère la liste de l'historique (qui est réactive).
    const historyList = historyStore.state.list;
    
    const goToDetail = (imdbID) => {
        router.push(`/movie/${imdbID}`);
    };
    
</script>

<template>
  <div class="historique-view">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">🕰️ Historique de Consultation</h1>

    <p v-if="historyList.length === 0" class="empty-message">
      Vous n'avez pas encore consulté de film.
    </p>

    <div v-else class="results-grid">
        <FilmCard
            v-for="(entry, index) in historyList"
            :key="`${entry.imdbID}-${entry.viewedAt}-${index}`" 
            :film="entry"
            @view-detail="goToDetail" 
        />
    </div>
  </div>
</template>

<style scoped>
.historique-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
.empty-message { text-align: center; font-size: 1.2em; color: #7f8c8d; margin-top: 50px; }
.results-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding-top: 20px;
}
</style>