<script setup>
  // Importe la fonction 'defineProps' de Vue pour déclarer les propriétés (props) acceptées.
  const props = defineProps({
    // Déclare une propriété nommée 'film'.
    film: {
      // Spécifie que 'film' doit être un objet.
      type: Object,
      // Rend cette propriété obligatoire.
      required: true,
    },
  });
  
  // Définit l'événement que ce composant peut émettre à son parent.
  const emit = defineEmits(['view-detail']);
  
  // Fonction appelée lors du clic sur la carte du film.
  const handleClick = () => {
    // Émet l'événement 'view-detail' au composant parent, en passant l'ID IMDb du film.
    emit('view-detail', props.film.imdbID);
  };
  
  // Définit une URL d'image de substitution (placeholder) à utiliser si le film n'a pas d'affiche.
  const placeholderImage = 'https://placehold.co/300x450/cccccc/333333?text=Pas+dAffiche';
  </script>
  
  <template>
    <div
        class="film-card"
        @click="handleClick"
    >
      <img
          :src="props.film.Poster !== 'N/A' ? props.film.Poster : placeholderImage"
          :alt="props.film.Title"
      />
      <div class="film-info">
        <h3>{{ props.film.Title }}</h3>
        <p>{{ props.film.Year }} - {{ props.film.Type }}</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Début du bloc de style spécifique à ce composant (scoped). */
  /* Style pour la carte principale. */
  .film-card {
    width: 200px;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    /* Ajoute une transition douce pour les effets hover. */
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: white;
    /* Change le curseur en pointeur. */
    cursor: pointer; /* Indique qu'il est cliquable */
  }
  /* Style appliqué au survol de la carte. */
  .film-card:hover {
    /* Soulève légèrement la carte. */
    transform: translateY(-3px);
    /* Ajoute une ombre. */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  /* Style pour l'image. */
  .film-card img {
    width: 100%;
    /* Fixe la hauteur de l'image. */
    height: 300px; 
    /* Assure que l'image couvre la zone. */
    object-fit: cover;
    border-radius: 4px;
  }
  /* Style pour le conteneur d'informations. */
  .film-info {
    margin-top: 10px;
  }
  /* Style pour le titre. */
  .film-info h3 {
    font-size: 1.1em;
    margin-bottom: 5px;
    color: #34495e;
    /* Gère le débordement (points de suspension). */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Style pour les informations d'année et de type. */
  .film-info p {
    font-size: 0.9em;
    color: #7f8c8d;
  }
  </style>