<template>
  <main>
    <div class="card text-center text-white bg-secondary">
      <!-- <img class="card-image" src="https://terrapirata.com/wp-content/uploads/2023/08/theapp-176x300.png" alt=""> -->
      <div class="card-body my-4">
        <h5 class="card-title">Demo Route Title</h5>
        <p class="card-text" v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ route.metadata?.extensions["openrally:distance"] }}km</p>
        <p class="card-text" v-else>{{ route.metadata?.extensions["openrally:distance"] }}miles</p>
      </div>
    </div>
    <div class="row bg-white border-bottom wps" v-for="(wpt, index) in route.wpt">
      <div class="col-2 position-relative border-end">
        <h2 class="text-center position-absolute top-50 start-50 translate-middle">{{ wpt.extensions["openrally:distance"] }}</h2>
      </div>
      <div class="col-2 position-relative border-end">
        <h2 v-if="index > 0" class="text-center position-absolute top-50 start-50 translate-middle">{{ Math.round( ((wpt.extensions["openrally:distance"] - route.wpt[index - 1 ].extensions["openrally:distance"])) * 100) / 100 }}</h2>
        <h2 v-else class="text-center position-absolute top-50 start-50 translate-middle">0</h2>
        <span class="tucked fw-bold position-absolute p-2">{{ wpt.name }}</span>
      </div>
      <div class="col-4 border-end text-center">
        <img :src='wpt.extensions["openrally:tulip"]'>
      </div>
      <div class="col-4 ps-0">
        <div class="position-relative text-center h-100">
          <h4 class="tucked-left fw-bold position-absolute p-2 bg-warning mb-0">{{ wpt.extensions["openrally:cap"] }}</h4>
          <p class="tucked fw-bold position-absolute text-end px-2 mb-0">{{ wpt['@_lat'] }}<br/>{{ wpt['@_lon'] }}</p>
          <img style="z-index:999" :src='wpt.extensions["openrally:notes"]'>
        </div>
      </div>
      <!-- <div class="col-4 position-relative text-center h-100 bg-danger"> {{ wpt }}</div> -->
    </div>
  </main>
  <div class="instruments h-6">
    <div class="row h-100">
      <div class="col-2 border-end text-center position-relative bg-info" v-on-long-press="[resetTotalDriven, { delay: 1000, modifiers: { stop: true } }]">
        <h2 class="text-center position-absolute top-50 start-50 translate-middle user-select-none">
          <span  v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ Math.round(totalDriven * 0.001 * 100)/100 }}</span>
          <span v-else>{{ Math.round(totalDriven * 0.0006213712 * 100) / 100 }}</span>
          <br>
          TOT
        </h2>
      </div>
      <div class="col-2 border-end text-center position-relative bg-secondary">
        <h2 class="text-center position-absolute top-50 start-50 translate-middle">
          <span>0</span><br>
          WP
        </h2>
      </div>
      <div class="col-2 border-end text-center position-relative bg-success">
        <h2 class="text-center position-absolute top-50 start-50 translate-middle">
          <template v-if="loc.speed == null">
            <span>-</span><br>
          </template>
          <template v-else>
            <span v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ Math.round(loc.speed * 3.6 *100)/100 }}</span>
            <span v-else>{{ Math.round(loc.speed * 2.23694 * 100)/100 }}</span>
            <br/>
          </template>
          <span v-if="route.metadata?.extensions['openrally:units'] === 'metric'">KMH</span>
          <span v-else>MPH</span>
        </h2>
      </div>
      <div class="col-2 border-end text-center position-relative bg-warning">
        <h2 class="text-center position-absolute top-50 start-50 translate-middle">
          <span v-if="loc.heading">{{ Math.round(loc.heading) }}</span>
          <span v-else>-</span>
          CAP
        </h2>
      </div>
      <div class="col-4 border-end text-end position-relative bg-danger">
        <h2 class="text-end position-absolute top-50 start-50 translate-middle">
          <span>{{ loc.latitude }}</span><br>
          <span>{{ loc.longitude }} </span><br>
        </h2>
      </div>
      <!-- <div class="col-4 position-relative text-center h-100 bg-danger"> {{ wpt }}</div> -->
    </div>
  </div>
</template>

<script>
  import { XMLParser} from 'fast-xml-parser';
  import { vOnLongPress } from '@vueuse/components';

  export default {
    directives:{
      'on-long-press': vOnLongPress
    },
    data() {
      return {
        route: {},
        totalDriven: 0,
        loc: {},
        prevLoc: {}
      }
    },
    methods: {
      resetTotalDriven(e){
        this.totalDriven = 0;
      },
      getLoc(){
        // window.alert('Getting GPS')
        const success = (position) => {
            // window.alert('GPS SUCCESS')
            console.log(position);
            this.prevLoc = this.loc;
            this.loc = position.coords;
            console.log('prevDriven', this.totalDriven)
            this.totalDriven = this.totalDriven + this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            if(isNaN(this.totalDriven)){
              this.totalDriven = 0;
            }
            console.log('driven', this.totalDriven)
        };

        const error = (err) => {µ
            // window.alert('GPS Error')
            console.log(error)
        };

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
      async getDemoRoute() {
        
        let route = await (await fetch('/terrapirata.gpx')
        .then(response => response.text())
        .then(
          response=>{
            const parser = new XMLParser(
              {
                ignoreAttributes: false,
                namePrefix: '@_'
              }
            );
            let jObj = parser.parse(response)
            return jObj.gpx;
          }
        ));
        this.route = route;
      }
    },
    mounted() {
      this.getDemoRoute();
      this.getLoc();
    }
  }
</script>

<style>
.instruments{
  position:fixed;
  width: 100vw;
  z-index: 999;
  top:0;
}
main{
  margin-top: 6rem;
  height: 100vh;
  width: 100vw;
  overflow-x: clip;
  overflow-y: scroll;
  background: darkslategray
}

.h-6{
  height: 6rem;
}
.h-10{
  height: 10rem;
}
.tucked{
  bottom:0;
  right:0;
}
.tucked-left{
  bottom:0;
  left:0;
}
.wps{
  overflow-x: hidden;
}
.wps img{
  max-width: 100%;
}
</style>
