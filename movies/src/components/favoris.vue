<script setup>
  /* Importation du magasin de donnees pour acceder a la liste des favoris */
  import favoritesStore from '../stores/favoritesStore';
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
  
  /* Recuperation de la liste des films stockes dans l etat du magasin de favoris */
  const favorisList = favoritesStore.state.list;
  
  /* Fonction declenchee pour rediriger l utilisateur vers la page de details d un film */
  const goToDetail = (imdbID) => {
      /* Utilisation du routeur pour envoyer l utilisateur vers l url du film specifique */
      router.push(`/movie/${imdbID}`);
  };
  </script>
  
  <template>
    /* Conteneur principal de la vue des favoris */
    <div class="favoris-view">
      /* Affichage du bouton de retour personnalise */
      <BackButton text="Retour"/>
      /* Titre principal de la page centré avec une marge basse */
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Mes Films Favoris</h1>
  
      /* Affichage d un message informatif si la liste des favoris est vide */
      <p v-if="favorisList.length === 0" class="empty-message">
        Vous n'avez pas encore ajouté de film à vos favoris.
        Recherchez un film et cliquez sur le cœur !
      </p>
  

      <div v-else class="results-grid">
          /* Generation d une carte pour chaque film present dans la liste des favoris */
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
  /* Definition des styles de la vue avec une largeur maximale et un centrage */
  .favoris-view { padding: 20px; max-width: 1200px; margin: 0 auto; }
  /* Style du message d absence de favoris centré et de couleur grise */
  .empty-message { text-align: center; font-size: 1.2em; color: #7f8c8d; margin-top: 50px; }
  /* Configuration de la grille utilisant flexbox pour aligner les cartes de films */
  .results-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      padding-top: 20px;
  }
  </style>