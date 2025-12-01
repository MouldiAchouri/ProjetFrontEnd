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
/* Styles globaux pour la page */
body {
  margin: 0;
  background-color: #f4f7f6;
  font-family: sans-serif;
}
</style>