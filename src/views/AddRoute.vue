<template>
  <section>
    <div class="container">
      <div class="row pt-5">
        <h1 class="text-white">Add Route</h1>
      </div>
      <div class="row pt-5">
        <div class="col">
          <div class="mb-4">
            <input class="form-control" type="text" v-model="routeTitle" placeholder="Route Title"/>
          </div>
          <input v-if="detectedOS=='MacOS'" type="file" ref="myFile" @change="onFileChange" class="inputFile form-control" :class="{'disabled':routeTitle == ''}" :disabled="routeTitle == ''" />
          <input v-else type="file" ref="myFile" accept="application/gpx+xml" @change="onFileChange" class="inputFile form-control" :class="{'disabled':routeTitle == ''}" :disabled="routeTitle == ''" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { XMLParser} from 'fast-xml-parser';
  import { PlayStore } from '../stores/PlayStore.js';

  export default {
    data() {
      return {
        PlayStore,
        file: null,
        routeTitle: '',
        route: {},
        detectedOS: null
      }
    },
    mounted(){
      if (navigator.userAgent.indexOf("Mac") != -1) 
          this.detectedOS = "MacOS";

      if (navigator.userAgent.indexOf("Win") != -1) 
          this.detectedOS = "Windows";

      if (navigator.userAgent.indexOf("Linux") != -1) 
          this.detectedOS = "Linux";
    },  
    methods: {
      async onFileChange(ev){
        console.log('File Changed',ev);
        if(this.routeTitle == ''){
          return;
        }
        if(ev.target?.files?.length == 0){
          return;
        }
        const file = ev.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function(){
            var xmlData = reader.result;
            console.log(xmlData);
            this.setRoute(xmlData);
        }.bind(this);
      },
      async setRoute(routeFilecontent) {
        const parser = new XMLParser(
          {
            ignoreAttributes: false,
            namePrefix: '@_'
          }
        );
        let jObj = parser.parse(routeFilecontent)
        console.log(jObj)
        this.route = jObj.gpx;
        this.PlayStore.addRoute(this.routeTitle, jObj.gpx);
        console.log('Reroute user to route');
        this.$router.push('/route');
      }
    },
  }
</script>

<style scoped>
section{
  height: calc(100vh - 54px);
}
.modal-bg{
  z-index:9999;
  height: 100vh;
  background: rgba(var(--bs-dark-rgb),0.7)!important
}
.instruments{
  width: 100vw;
  z-index: 999;
  top:0;
}
main{
  height: 100vh;
  width: 100vw;
  overflow-x: clip;
  overflow-y: scroll;
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
  left:0;
}
.tucked-bottom{
  bottom:0;
}
.wpt{
  overflow-x: hidden;
}
.wpt img{
  max-width: 100%;
}
.bg-cleared{
  background: lightgreen
}
.o-5{
  opacity: 0.5;
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
