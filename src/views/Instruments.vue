<template>
  <div class="main-instruments instruments">
    <div class="row bg-dark text-white">
      <div class="col-12">
        <button class="btn px-5 btn-secondary text-white ms-2 me-2 mt-1 mb-1" @click="togglePlayStore()">
          <i class="bi bi-play-fill" v-if="PlayStore.pause"></i>
          <i class="bi bi-pause-fill" v-else></i>
        </button>
        <button class="btn px-5 btn-secondary text-white ms-2 me-2 mt-1 mb-1 float-end" @click="toggleReverse()">
          <i class="bi bi-arrow-left" v-if="PlayStore.reverse"></i>
          <i class="bi bi-arrow-right" v-else></i>
        </button>
      </div>
    </div>
    <div class="row gauges d-flex align-content-stretch flex-wrap">
      <div class="col-md-6 col-6 text-center flex-fill position-relative bg-info" v-on-long-press="[resetTotalDriven, { delay: 1000, modifiers: { stop: true } }]" v-if="SettingsStore.settings.instruments.showTotOdo">
        <h2 class="position-absolute text-center user-select-none top-50 start-50 translate-middle">
          <span  v-if=" 'metric' === 'metric'">{{ Math.round(totalDriven * 0.001 * 100)/100 }}</span>
          <span v-else>{{ Math.round(totalDriven * 0.0006213712 * 100) / 100 }}</span>
          <br>
          TOT
        </h2>
      </div>
      <div class="col-md-6 col-6 text-center flex-fill position-relative bg-secondary" @click="wpDriven=0" v-if="SettingsStore.settings.instruments.showWpOdo">
        <h2 class="position-absolute text-center top-50 start-50 translate-middle">
          <span  v-if="'metric' === 'metric'">{{ Math.round(wpDriven * 0.001 * 100)/100 }}</span>
          <span v-else>{{ Math.round(wpDriven * 0.0006213712 * 100) / 100 }}</span>
          <br>
          WP
        </h2>
      </div>
      <div class="col-md-6 col-6 text-center flex-fill position-relative bg-success" v-if="SettingsStore.settings.instruments.showSpeed">
        <h2 class="position-absolute text-center top-50 start-50 translate-middle">
          <template v-if="loc.speed == null">
            <span>-</span><br>
          </template>
          <template v-else>
            <span v-if="'metric' === 'metric'">{{ Math.round(loc.speed * 3.6 *100)/100 }}</span>
            <span v-else>{{ Math.round(loc.speed * 2.23694 * 100)/100 }}</span>
            <br/>
          </template>
          <span v-if="'metric' === 'metric'">KMH</span>
          <span v-else>MPH</span>
        </h2>
      </div>
      <div class="col-md-6 col-6 border-end text-center flex-fill position-relative bg-warning" v-if="SettingsStore.settings.instruments.showCap">
        <h2 class="position-absolute text-center top-50 start-50 translate-middle">
          <span v-if="loc.heading">{{ Math.round(loc.heading) }}</span>
          <span v-else>-</span>
          <br>
          CAP
        </h2>
      </div>
      <div class="col-md-12 col-12 text-end position-relative bg-secondary" v-if="SettingsStore.settings.instruments.showDebug">
        <h2 class="position-absolute text-center flex-fill top-50 start-50 translate-middle">
            <span>{{ loc.latitude }}</span><br>
            <span>{{ loc.longitude }} </span><br>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
  import { SettingsStore } from '../stores/SettingsStore.js';
  import { PlayStore } from '../stores/PlayStore.js';


  export default {
    data() {
      return {
        PlayStore,
        SettingsStore,
        totalDriven: 0,
        wpDriven: 0,
        loc: {},
        prevLoc: {},
      }
    },
    methods: {
      resetTotalDriven(e){
        this.totalDriven = 0;
      },
      togglePlayStore(){
        console.log('toggle');
        this.PlayStore.toggle();
      },
      toggleReverse(){
        console.log('toggle reverse');
        this.PlayStore.toggleReverse();
      },
      getLoc(){
        // window.alert('Getting GPS')
        const success = (position) => {
          // window.alert('GPS SUCCESS')
          console.log(position);
          this.prevLoc = this.loc;
          this.loc = position.coords;
          if( !this.PlayStore.pause){
            console.log('prevDriven', this.totalDriven)
            if( this.PlayStore.reverse){
              this.totalDriven = this.totalDriven - this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
              his.wpDriven = this.wpDriven - this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            } else {
              this.totalDriven = this.totalDriven + this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
              this.wpDriven = this.wpDriven + this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            }
            
          }
          if(isNaN(this.totalDriven)){
            this.totalDriven = 0;
          }
          if(isNaN(this.wpDriven)){
            this.wpDriven = 0;
          }
        };

        const error = (err) => {
            // window.alert('GPS Error')
            console.log(error)
        };
        navigator.geolocation.getCurrentPosition(success,error);
        navigator.geolocation.watchPosition(
          success,
          error,
          { enableHighAccuracy: true, maximumAge: 30000 }
        );
      },
      cosineDistanceBetweenPoints(prevLoc, loc) {
        console.log('prevLoc', prevLoc, 'loc', loc);
        const lat1 = prevLoc.latitude;
        const lon1 = prevLoc.longitude;
        const lat2 = loc.latitude;
        const lon2 = loc.longitude;
        const R = 6371e3;
        const p1 = lat1 * Math.PI/180;
        const p2 = lat2 * Math.PI/180;
        const deltaP = p2 - p1;
        const deltaLon = lon2 - lon1;
        const deltaLambda = (deltaLon * Math.PI) / 180;
        const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) +
                  Math.cos(p1) * Math.cos(p2) *
                  Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
        console.log('delta Distance', d)
        return d;
      },
    },
    mounted() {
      this.getLoc();
    }
  }
</script>

<style scoped>
.modal-bg{
  z-index:9999;
  height: 100vh;
}
.instruments{
  width: 100vw;
  z-index: 999;
  top:0;
}
.main-instruments{
  height: calc(100vh - 54px);
  width: 100vw;
  overflow-x: clip;
  overflow-y: scroll;
}
.main-instruments .gauges{
  height: calc(100vh - 54px - 46px);
}

@media (max-width: 767.98px) {
  .h-6{
    height: 12rem;
  }
  .gps-wp-pos{
    font-size: 75%;
  }
  .wps h2{
    font-size: 100%;
  }
  .wps h5{
    font-size: 75%;
  }
  .wps span{
    font-size: 75%;
  }
}
</style>
