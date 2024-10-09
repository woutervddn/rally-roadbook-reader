<template>
  <main>
    <img src="https://terrapirata.com/wp-content/uploads/2023/08/theapp-176x300.png" alt="">
    <hr>
    <RouterLink to="/demoroute">
      <button class="btn btn-primary">
        Go To Demo Route
      </button>
    </RouterLink>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style>
main{
  min-height: 100vh;
  background: darkslategray
}
</style>
