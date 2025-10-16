<template>
  <div class="myApp bg-dark">
    <RouterView />
    <header class="bg-dark text-center pt-2 pb-2">
      <div class="container">
        <div class="btn-group w-100">
          <router-link to="/" class="btn btn-light">
            <i class="bi bi-house-fill"></i>
          </router-link>
          <router-link to="/instruments" class="btn btn-light">
            <i class="bi bi-speedometer2"></i>
          </router-link>
          <router-link to="/route" :class="{'disabled':PlayStore.routeTitle ===''}" class="btn btn-primary">
            <i class="bi bi-geo-fill"></i>
          </router-link>
          <router-link to="/notes" class="btn btn-light">
            <i class="bi bi-chat-left-text-fill"></i>
          </router-link>
          <router-link to="/settings" class="btn btn-light">
            <i class="bi bi-gear-fill"></i>
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';
import { PlayStore } from './stores/PlayStore.js';

export default {
  data() {
    return {
      RouterLink,
      RouterView,
      PlayStore,
    }
  },
  watch:{
  },
  async mounted(){
    if ('serviceWorker' in navigator) {
    // await this.setState({ loadingMessage: 'Updating Your Experience' })
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.map(r => {
        r.unregister()
      })
    })
    localStorage.setItem('appVersion', this.state.serverAppVersion)
    window.location.reload(true)
    } 
  },
  methods:{
    togglePlayStore(){
      console.log('toggle');
      this.PlayStore.toggle();
    }
  },
  computed:{
    playString(){
      return this.PlayStore.pause ? '⏸︎' : '⏵︎'
    }
  },
  async created(){
    this.PlayStore.refreshItems();

    //WAKE LOCK
    if ("wakeLock" in navigator) {
      // Create a reference for the Wake Lock.
      let wakeLock = null;

      // create an async function to request a wake lock
      try {
        wakeLock = await navigator.wakeLock.request("screen");
      } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        statusElem.textContent = `${err.name}, ${err.message}`;
      }
    }
  }
}
</script>

<style scoped>
header{
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 999999
}
</style>
