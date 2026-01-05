<script setup>
  /* Importation du magasin de donnees pour acceder a l historique des consultations */
  import historyStore from '../stores/historyStore';
  /* Importation du composant reutilisable affichant la carte d un film */
  import FilmCard from '../components/FilmCard.vue';
  /* Importation du composant de bouton pour revenir a la page precedente */
  import BackButton from '../components/BackButton.vue';
  /* Importation de l utilitaire de navigation pour changer de page */
  import { useRouter } from 'vue-router';
  /* Importation de la fonction de calcul reactif de vue */
  import {computed} from "vue";
  
  /* Initialisation du gestionnaire de navigation */
  const router = useRouter();
  
  /* Recuperation de la liste de l historique de maniere reactive via une propriete calculee */
  const historyList = computed(() => historyStore.state.list);
  
  /* Fonction declenchee pour rediriger l utilisateur vers la page de details d un film */
  const goToDetail = (imdbID) => {
      /* Utilisation du routeur pour envoyer l utilisateur vers l url du film selectionne */
      router.push(`/movie/${imdbID}`);
  };
  </script>
  
  <template>

    <div class="historique-view">
      <BackButton text="Retour"/>
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Historique de Consultation</h1>

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
  /* Definition des styles de la vue avec centrage horizontal */
  .historique-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
  /* Style du message vide avec une couleur grise et un espacement haut */
  .empty-message { text-align: center; font-size: 1.2em; color: #7f8c8d; margin-top: 50px; }
  /* Organisation de la grille avec flexbox pour aligner les cartes */
  .results-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      padding-top: 20px;
  }
  </style>