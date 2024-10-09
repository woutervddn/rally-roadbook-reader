<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <header class="bg-dark text-white">
    <h1>NAV</h1>
  </header>
</template>

<style scoped>
header{
  position: fixed;
  bottom: 0;
  background: white;
  width: 100vw;
}
</style>
