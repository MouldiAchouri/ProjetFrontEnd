<script setup>
</script>


<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<style>

/* garde en mémoire la recherche précédente. (keepalive)*/
/* Styles globaux pour la page */
body {
  margin: 0;
  background-color: #f4f7f6;
  font-family: sans-serif;
}
</style>