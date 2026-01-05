<script setup>
  /* Importation des fonctions reactives de vue */
  import { ref, watch, computed } from 'vue'; 
  /* Importation des outils de gestion des routes pour recuperer l identifiant et naviguer */
  import { useRoute, useRouter } from 'vue-router';
  /* Importation du composant de bouton de retour personnalise */
  import BackButton from '../components/BackButton.vue';
  /* Importation du magasin de donnees pour la gestion des favoris */
  import favoritesStore from '../stores/favoritesStore'; 
  /* Importation du magasin de donnees pour la gestion de l historique de consultation */
  import historyStore from '../stores/historyStore'; 
      
  /* Definition de la clef api necessaire pour interroger omdb */
  const API_KEY = "4726f8f9";
  /* Definition de l adresse de base de l api pour les requetes de details */
  const BASE_URL = "http://www.omdbapi.com/";
      
  /* Initialisation de l outil d acces aux parametres de l url actuelle */
  const route = useRoute();
  /* Initialisation de l outil de navigation programmatique */
  const router = useRouter();
  /* Creation d une variable reactive pour stocker l objet contenant les details du film */
  const filmDetail = ref(null);
  /* Variable de suivi de l etat de chargement de la requete */
  const isLoading = ref(true);
  /* Variable de stockage des messages d erreur eventuels */
  const error = ref(null);
      
  /* Fonction asynchrone pour charger les informations completes d un film via son identifiant */
  const fetchFilmDetail = async (imdbID) => {
    /* Activation de l indicateur de chargement au debut de l appel */
    isLoading.value = true;
    /* Reinitialisation de l erreur avant de tenter l appel */
    error.value = null;
    
    try {
      /* Construction de l url avec l identifiant unique et l option pour le synopsis complet */
      const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      /* Envoi de la requete de recuperation des donnees */
      const res = await fetch(url);
      /* Conversion du corps de la reponse en objet javascript */
      const data = await res.json();
      
      /* Verification du succes de la reponse selon le format specifique de l api */
      if (data.Response === "True") {
        /* Mise a jour de la variable avec les donnees recues */
        filmDetail.value = data;
        /* Enregistrement automatique de la consultation dans l historique */
        historyStore.addHistoryEntry(data); 
      } else {
        /* Capture du message d erreur renvoye par l api si le film n existe pas */
        error.value = data.Error || "Détails du film introuvables.";
      }
    } catch (err) {
      /* Gestion des erreurs de reseau ou de syntaxe lors de l execution */
      error.value = `Erreur lors du chargement des détails : ${err.message}`;
    } finally {
      /* Desactivation du chargement quel que soit le resultat final */
      isLoading.value = false;
    }
  };
  
  /* Calcul reactif pour savoir si le film actuellement affiche est dans les favoris */
  const isCurrentFilmFavorite = computed(() => {
    /* Si les donnees du film ne sont pas encore la le resultat est faux */
    if (!filmDetail.value) return false;
    /* Interrogation du magasin de favoris avec l identifiant du film */
    return favoritesStore.isFavorite(filmDetail.value.imdbID);
  });
  
  /* Fonction declenchee par le clic sur l icone de coeur pour ajouter ou retirer des favoris */
  const handleToggleFavorite = () => {
    /* Action possible uniquement si les donnees du film sont chargees */
    if (filmDetail.value) {
      /* Preparation d un objet simplifie pour le stockage propre au magasin */
      const filmForStore = {
        imdbID: filmDetail.value.imdbID,
        Title: filmDetail.value.Title,
        Poster: filmDetail.value.Poster,
        Year: filmDetail.value.Year,
        Type: filmDetail.value.Type || 'movie'
      };
      /* Appel de la methode d inversion de l etat favori dans le magasin */
      favoritesStore.toggleFavorite(filmForStore);
    }
  };
  
  /* Surveillance du parametre id dans l url pour relancer le chargement si l id change */
  watch(
    () => route.params.id, 
    (newID) => {
      /* Si un identifiant est present on lance la requete de detail */
      if (newID) {
        fetchFilmDetail(newID);
      } else {
        /* Affichage d une erreur si l identifiant est absent de la route */
        error.value = "Erreur : ID du film manquant dans l'URL.";
        isLoading.value = false;
      }
    },
    /* Execution immediate du code lors du premier rendu du composant */
    { immediate: true }
  );
  
  /* Url de l image de remplacement a utiliser en cas d erreur ou d absence d affiche */
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Image+Indisponible';
  
  /* Fonction de secours declenchee si le navigateur ne parvient pas a charger le poster officiel */
  const handleImageError = (event) => {
    /* Remplacement automatique de la source de l image par l image de remplacement */
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
    /* Mise en page globale de la vue detaillee */
    .detail-view { padding: 40px; max-width: 1000px; margin: 0 auto; }
  
    /* Conteneur principal utilisant flexbox pour separer l image et le texte */
    .film-details-container { display: flex; gap: 40px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    
    /* Conteneur de l image avec largeur fixe et position relative pour l icone favori */
    .poster-wrapper { position: relative; width: 300px; flex-shrink: 0; }
  
    /* Style de l image du poster avec coins arrondis et ombre legere */
    .poster-section img { width: 100%; height: auto; min-height: 450px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block; }
  
    /* Style de l icone flottante de favori positionnee sur le poster */
    .favorite-icon-overlay { position: absolute; top: 10px; right: 10px; font-size: 2em; cursor: pointer; user-select: none; background: rgba(255, 255, 255, 0.9); border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; transition: transform 0.2s, background 0.2s; z-index: 10; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
  
    /* Changement de couleur de l icone si le film est marque comme favori */
    .favorite-icon-overlay.is-favorite { color: #e74c3c; }
  
    /* Effet de zoom lors du passage de la souris sur l icone favori */
    .favorite-icon-overlay:hover { transform: scale(1.1); background: white; }
    
    /* Gestion de la section de texte pour occuper l espace restant */
    .info-section { flex: 1; }
    /* Style du titre du film */
    .title { font-size: 2.2em; margin-bottom: 10px; color: #34495e; }
    /* Style de l annee avec taille reduite et couleur grise */
    .year { font-size: 0.7em; color: #7f8c8d; font-weight: normal; }
    /* Style du synopsis avec espacement des lignes ameliore */
    .plot { margin-bottom: 25px; line-height: 1.6; color: #555; }
    /* Espacement entre les lignes d informations cles */
    .key-info p { margin-bottom: 8px; }
    /* Mise en avant des labels d informations en bleu */
    .key-info strong { color: #3498db; }
    
    /* Adaptation de la mise en page pour les ecrans de smartphones */
    @media (max-width: 768px) {
      .detail-view { padding: 15px; }
      /* Passage de flexbox en mode colonne pour empiler l image et le texte */
      .film-details-container { flex-direction: column; gap: 20px; padding: 20px; }
      /* Centrage du poster sur petit ecran */
      .poster-section { display: flex; justify-content: center; }
      /* Ajustement de la largeur maximum du poster sur mobile */
      .poster-wrapper { width: 100%; max-width: 300px; }
      /* Centrage et reduction de la taille du titre */
      .title { font-size: 1.8em; text-align: center; }
    }
  </style>