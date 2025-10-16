<template>
  <main class="text-center">
    <img src="/RRR_logo_wordmark.svg" alt="" class="pt-5 pb-3">
    <hr>
    <div class="container">
      <div class="row">

        <div class="col-lg-6 offset-lg-3" v-if="PlayStore.routes.length">
          <div class="btn-group w-100 mb-3">
            <RouterLink class="btn btn-primary w-50 mb-3" to="/route" v-if="PlayStore.routeTitle != ''">
              Resume current route
            </RouterLink>
            <RouterLink class="btn w-50 mb-3" to="/add-route" :class="PlayStore.routeTitle != '' ? 'btn-secondary': 'btn-primary'">
              <i class="bi bi-plus-lg"></i>
              New route
            </RouterLink>
          </div>
            <div role="button" class="card w-100 text-start my-3" @click="loadRoute(route)" v-for="route of PlayStore.routes" >
              <div class="card-body">
                <h5 class="card-title">{{route.name}}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">{{ route.route.metadata.extensions['openrally:distance'] }}{{ route.route.metadata.extensions['openrally:units'] == 'metric' ? 'km':'miles' }}</h6>
                <p class="card-text">
                  {{route.route.wpt.length}} WPs 
                  <span class="fst-italic" v-if="route.hasOwnProperty('notes')">
                    - {{ route.notes.length }} notes
                  </span>
                </p>
              </div>
            </div>
        </div>
        <div class="col-lg-6 offset-lg-3 px-4" v-else>
          <h1 class="text-white">You don't have any routes defined yet</h1>
          <RouterLink to="/add-route" class="btn btn-light mt-5 btn-lg w-100">
            Add one now
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { RouterLink } from 'vue-router';
import { PlayStore } from '../stores/PlayStore.js';

export default {
  data() {
    return {
      RouterLink,
      PlayStore
    }
  },
  methods:{
    loadRoute(route){
      PlayStore.activateRoute(route);
      this.$router.push('/route');
    }
  }
}
</script>

<style scoped>
main{
  min-height: 100vh;
}
img{
  width: 90vw;
}
</style>
