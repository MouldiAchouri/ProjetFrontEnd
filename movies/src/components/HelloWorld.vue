<script setup>
  // Importe la fonction 'defineProps' de Vue pour déclarer les propriétés attendues.
  defineProps({
    // Déclare une propriété (prop) nommée 'msg'.
    msg: {
      // Spécifie que 'msg' doit être une chaîne de caractères (String).
      type: String,
      // Rend cette propriété obligatoire.
      required: true,
    },
  })
  </script>
  
  <template>
    <div class="greetings">
      <h1 class="green">{{ msg }}</h1>
      <h3>
        You’ve successfully created a project with
        <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      </h3>
    </div>
  </template>
  
  <style scoped>
  /* Début du bloc de style spécifique au composant. */
  /* Style pour le titre h1. */
  h1 {
    /* Poids de la police. */
    font-weight: 500;
    /* Taille de la police. */
    font-size: 2.6rem;
    /* Positionnement relatif. */
    position: relative;
    /* Décalage vers le haut. */
    top: -10px;
  }
  
  /* Style pour le titre h3. */
  h3 {
    font-size: 1.2rem;
  }
  
  /* Centre les titres h1 et h3 par défaut (pour les écrans étroits). */
  .greetings h1,
  .greetings h3 {
    text-align: center;
  }
  
  /* Début de la media query pour les écrans plus larges (ordinateur de bureau, etc.). */
  @media (min-width: 1024px) {
    /* Aligne les titres à gauche pour les écrans larges. */
    .greetings h1,
    .greetings h3 {
      text-align: left;
    }
  }
  </style>