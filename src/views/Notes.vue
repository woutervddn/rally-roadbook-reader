<template>
  <main>
    <div class="container">
      <h1 class="pt-3 text-white">Notes</h1>
      <p class="lead text-light">Pick a route to view it's notes</p>
      <div class="row mt-5">
        <div class="col">
          <div class="accordion">
            <div class="accordion-item border-0" :disabled="!route.hasOwnProperty('notes')" v-for="route,index of PlayStore.routes">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" @click="openCollapse === index ? openCollapse=null : openCollapse = index" :class="{'collapsed':openCollapse !== index}">
                  {{ route.name }}
                </button>
              </h2>
              <div class="accordion-collapse collapse" :class="{'show':openCollapse === index}">
                <div class="accordion-body bg-secondary rounded-bottom-1">
                  <div class="bg-light p-2 my-2 rounded-2" v-for="note in route.notes">
                    <strong>WP{{ note.wpIndex+1 }}</strong> {{ note.note }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { PlayStore } from '../stores/PlayStore.js';

export default {
  data() {
    return {
      PlayStore,
      openCollapse:null
    }
  },
  methods:{
  },
  mounted(){
    
  }
}
</script>

<style>
main{
  min-height: 100vh;
}
</style>
