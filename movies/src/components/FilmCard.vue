<script setup>
const props = defineProps({
  film: {
    type: Object,
    required: true,
  },
});

// Définit l'événement que ce composant peut émettre
const emit = defineEmits(['view-detail']);

// Fonction appelée au clic, qui émet l'ID du film
const handleClick = () => {
  emit('view-detail', props.film.imdbID);
};

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
.film-card {
  width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: white;
  cursor: pointer; /* Indique qu'il est cliquable */
}
.film-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.film-card img {
  width: 100%;
  height: 300px; /* Taille fixe pour éviter les décalages */
  object-fit: cover;
  border-radius: 4px;
}
.film-info {
  margin-top: 10px;
}
.film-info h3 {
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #34495e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.film-info p {
  font-size: 0.9em;
  color: #7f8c8d;
}
</style>