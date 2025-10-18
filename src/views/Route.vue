<template>
  <section  v-if="!fileLoaded">
    <div class="container w-100 bg-dark text-white" style="min-height: 100vh;">
     
      <h1 class="pt-5 text-center">No route loaded</h1>
      <h4 class="pt-5 text-center">Go home and select route</h4>
    </div>
  </section>
  <main class="d-flex flex-column" v-else>
    <div class="instruments position-sticky">
      <div class="row bg-dark text-white">
        <div class="col-6">
          <button class="btn btn-sm btn-secondary text-white ms-2 me-2 mt-1 mb-1" @click="togglePlayStore()">
            <i class="bi bi-play-fill" v-if="PlayStore.pause"></i>
            <i class="bi bi-pause-fill" v-else></i>
          </button>
          <button class="btn btn-sm btn-secondary text-white ms-2 me-2 mt-1 mb-1" @click="toggleReverse()">
            <i class="bi bi-arrow-left" v-if="PlayStore.reverse"></i>
            <i class="bi bi-arrow-right" v-else></i>
          </button>
        </div>
        <div class="col-6"><h5 class="float-end mt-2 mb-2 pt-0 me-2">WP <strong>{{ PlayStore.activeWP+1 }}</strong> / {{ PlayStore.totalWPs }}</h5></div>
      </div>
      <div class="row d-flex flex-row">
        <div class="col-md-2 col-6 flex-fill border-end text-center position-relative bg-info" v-on-long-press="[resetTotalDriven, { delay: 1000, modifiers: { stop: true } }]" v-if="SettingsStore.settings.instruments.showTotOdo">
          <h2 class="text-center user-select-none">
            <span  v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ Math.round(PlayStore.totalDriven * 0.001 * 100)/100 }}</span>
            <span v-else>{{ Math.round(PlayStore.totalDriven * 0.0006213712 * 100) / 100 }}</span>
            <br>
            TOT
          </h2>
        </div>
        <div class="col-md-2 col-6 flex-fill border-end text-center position-relative bg-secondary" @click="PlayStore.wpDriven=0" v-if="SettingsStore.settings.instruments.showWpOdo">
          <h2 class="text-center">
            <span  v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ Math.round(PlayStore.wpDriven * 0.001 * 100)/100 }}</span>
            <span v-else>{{ Math.round(PlayStore.wpDriven * 0.0006213712 * 100) / 100 }}</span>
            <br>
            WP
          </h2>
        </div>
        <div class="col-md-2 col-6 flex-fill border-end text-center position-relative bg-success" v-if="SettingsStore.settings.instruments.showSpeed">
          <h2 class="text-center">
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
        <div class="col-md-2 col-6 flex-fill border-end text-center position-relative bg-warning" v-if="SettingsStore.settings.instruments.showCap">
          <h2 class="text-center">
            <span v-if="loc.heading">{{ Math.round(loc.heading) }}</span>
            <span v-else>-</span>
            <br>
            CAP
          </h2>
        </div>
        <div class="col-md-4 col-6 flex-fill border-end text-end position-relative bg-secondary" v-if="SettingsStore.settings.instruments.showDebug">
          <h2 class="text-end">
              <span>{{ loc.latitude }}</span><br>
              <span>{{ loc.longitude }} </span><br>
          </h2>
        </div>
        <div class="col-md-4 col-6 flex-fill border-end text-end position-relative bg-danger" v-if="SettingsStore.settings.helpers.showDistToNextWp">
          <h2 class="text-end">
            <span>NEXT WP</span><br/>
            <span v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ Math.round(distToNextWP * 0.001 * 100)/100 }}</span>
            <span v-else>{{ Math.round(distToNextWP * 0.0006213712 * 100) / 100 }}</span>
          </h2>
        </div>
        <!-- <div class="col-4 position-relative text-center h-100 bg-danger"> {{ wpt }}</div> -->
      </div>
    </div>

    <div class="route flex-fill mb-5">
      <!-- Title Row -->
      <div class="card text-center text-white bg-secondary">
        <!-- <img class="card-image" src="https://terrapirata.com/wp-content/uploads/2023/08/theapp-176x300.png" alt=""> -->
        <div class="card-body my-4">
          <h5 class="card-title">{{ routeTitle }}</h5>
          <p>v: 2.1</p>
          <code>{{ JSON.stringify(debugposition) }}</code>
          <button class="btn btn-danger" @click="reloadPage()">reload</button>
          <p class="card-text" v-if="route.metadata?.extensions['openrally:units'] === 'metric'">{{ route.metadata?.extensions["openrally:distance"] }}km</p>
          <p class="card-text" v-else>{{ route.metadata?.extensions["openrally:distance"] }}miles</p>
        </div>
      </div>

      <!-- WPs -->
      <swipe-list
        ref="wps"
        class="wps"
        :items="route.wpt"
        item-key="name"
        @swipeout:click="itemClick"
        @active="swipeEventTrigger"
        v-if="route.wpt"
      >
        <template v-slot="{ item, index, revealLeft, revealRight, close }">
          <div :ref="`wp-${index+2}`"
           class="row border-bottom wpt" :class="index+1 > PlayStore.activeWP ? 'bg-white' : (PlayStore.highlightPrevWP && index+1 == PlayStore.activeWP) ? 'bg-cleared o-5' : 'bg-light o-5'">
            <div class="col-2 position-relative border-end  user-select-none" :class="{'col-2': SettingsStore.settings.roadbook.showWPDist, 'col-3':!SettingsStore.settings.roadbook.showWPDist, 'bg-cleared':(Math.round( ((item?.extensions['openrally:distance'] - route.wpt[index - 1 ]?.extensions['openrally:distance'])) * 100) / 100) < 0.5}">
              <h2 class="text-center position-absolute top-50 start-50 translate-middle">{{ item.extensions["openrally:distance"] }}</h2>
            </div>
            <div class="col-2 position-relative border-end" v-if="SettingsStore.settings.roadbook.showWPDist">
              <h5 class="tucked tucked-bottom fw-bold position-absolute p-2 mb-0 gps-wp-pos" v-if="SettingsStore.settings.roadbook.showWPNo">{{ item.name }}</h5>
              <h2 v-if="index > 0" class="text-center position-absolute top-50 start-50 translate-middle">{{ Math.round( ((item.extensions["openrally:distance"] - route.wpt[index - 1 ].extensions["openrally:distance"])) * 100) / 100 }}</h2>
              <h2 v-else class="text-center position-absolute top-50 start-50 translate-middle">0</h2>
            </div>
            <div class="col-4 border-end text-center">
              <img :src='item.extensions["openrally:tulip"]'>
            </div>
            <div class="ps-0" :class="SettingsStore.settings.roadbook.showWPDist ? 'col-4' : 'col-5'">
              <div class="position-relative text-center h-100">
                <img style="z-index:999" :src='item.extensions["openrally:notes"]'>
                <h5 class="tucked-left tucked-bottom fw-bold position-absolute p-2 bg-warning mb-0"  v-if="SettingsStore.settings.roadbook.showCap">{{ item.extensions["openrally:cap"] }}</h5>
                <p class="tucked fw-bold position-md-absolute text-end px-2 mb-0 gps-wp-pos"  v-if="SettingsStore.settings.roadbook.showGPS">{{ item['@_lat'] }}<br/>{{ item['@_lon'] }}</p>
              </div>
            </div>
            <!-- <div class="col-4 position-relative text-center h-100 bg-danger"> {{ item }}</div> -->
          </div>
        </template>
        <template v-slot:left="{ item }">
          <div class="bg-success" style="width:25vw">
            <h1 class="text-white text-center position-absolute top-50 start-50 translate-middle"><i class="bi bi-check-lg"></i></h1>
          </div>
        </template>
        <template v-slot:right="{ item,index }">
          <div class="bg-secondary" style="width:18vw" @click="addNote(index)">
            <h1 class="text-white text-dark position-absolute top-50 start-50 translate-middle"><i class="bi bi-chat-left-text-fill"></i> </h1>
          </div>
          <div class="bg-danger" style="width:25vw" @click="setActiveWP(index)" v-if="PlayStore.activeWP >= index">
            <h1 class="text-white text-center position-absolute top-50 start-50 translate-middle"><i class="bi bi-x-lg"></i> </h1>
          </div>
        </template>
        <template v-slot:empty>
          <div>
            <!-- change mockSwipeList to an empty array to see this slot in action  -->
            No waypoints in this route
          </div>
        </template>
      </swipe-list>
    </div>

  </main>

  <div class="w-100 top-0 start-0 modal fade" tabindex="-1" :class="{'show':showModal, 'modal-bg':showModal, 'position-fixed':showModal,'d-block':showModal}">
    <div class="position-absolute top-50 start-50 translate-middle w-100">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a note to WP{{ activeNote+1 }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeNote"></button>
          </div>
          <div class="modal-body">
            <textarea name="" id="" rows="6" class="form-control" v-model="notearea"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"  @click="closeNote">Close</button>
            <button type="button" class="btn btn-primary" @click="saveNote">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
  import { XMLParser} from 'fast-xml-parser';
  import { vOnLongPress } from '@vueuse/components';
  import { PlayStore } from '../stores/PlayStore.js';
  import { SettingsStore } from '../stores/SettingsStore.js';
  import { SwipeList, SwipeOut } from 'vue3-swipe-actions';
  import 'vue3-swipe-actions/dist/index.css';


  export default {
    directives:{
      'on-long-press': vOnLongPress
    },
    components:{
      SwipeOut,
      SwipeList
    },
    data() {
      return {
        PlayStore,
        SettingsStore,
        fileLoaded: false,
        showModal: false,
        file: null,
        notearea: '',
        activeWP: 0,
        activeNote: null,
        routeTitle: '',
        route: {},
        loc: {},
        prevLoc: {},
        distToNextWP: 0,
        showDistToNext: false,
        eventListenerAttached: false,
        debugposition: null
      }
    },
    methods: {
      reloadPage(){
        window.location.href = `${window.location.origin}${window.location.pathname}/?t=${Math.floor(Date.now() / 1000)}`
      },
      addNote(index){
        this.activeNote=index;
        this.showModal=true;
        this.$refs.wps.closeActions();
        // window.alert('TODO: Make notes work')
      },
      closeNote(){
        this.showModal=false;
        this.activeNote=null;
        this.notearea='';
      },
      saveNote(){
        this.PlayStore.addNote(this.routeTitle, {'wpIndex':this.activeNote, 'note':this.notearea});
        this.closeNote();
      },
      async onFileChange(ev){
        console.log(ev);
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
        
        // reader.onload = e => this.$emit("load", e.target.result);
        // console.log("reading...")
        // reader.onLoadend= function(e){
        //   console.log('onloaded')
        //   console.log(e);
        //   console.log(routeFilecontent)
        //   this.setRoute(routeFilecontent.result);
        // }
        

        this.fileLoaded = true;
      },
      itemClick(e){
        console.log(e)
      },
      swipeEventTrigger(active){
        if(!active){
          setTimeout(this.getActive,10);
        }

      },
      getActive(){
        for(let i=this.PlayStore.activeWP; i<this.route.wpt.length; i++){
          if(this.$refs.wps.isRevealed(i) === 'left'){
            console.log('swiped: ', i, this.$refs.wps.isRevealed(i))
            this.setActiveWP(i, true);
          }
        }
        for(let i=0; i<this.PlayStore.activeWP+1; i++){
          if(this.$refs.wps.isRevealed(i) === 'left'){
            this.$refs.wps.closeActions();
          }
        }
      },
      setActiveWP(index,highlight){
        this.PlayStore.activeWP = index;
        if(highlight == true){
          this.PlayStore.incrementWP(); // This way we still get highlighting
        } // No else needed, index is already corrected when no need for highlight

        if(this.SettingsStore.settings.helpers.autosynctot){
          this.syncDistance( this.PlayStore.route.wpt[this.PlayStore.activeWP - 1].extensions['openrally:distance'] );
        }

        if(this.SettingsStore.settings.helpers.autoclearwpdist){
          this.PlayStore.wpDriven=0
        }

        this.$refs.wps.closeActions(index);

        if(this.SettingsStore.settings.helpers.autoscroll){
          this.scrollTo(`wp-${index}`)
        }

      },
      scrollTo(view) { 
        console.log(`scrolling to`, view)
        this.$refs[view].scrollIntoView({ behavior: 'smooth' }) 
      },

      resetTotalDriven(e){
        this.PlayStore.totalDriven = 0;
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
          this.debugposition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            speed: position.coords.speed,
            cap: position.coords.heading,
          };
          this.prevLoc = this.loc;
          this.loc = position.coords;
          if( !this.PlayStore.pause){
            console.log('prevDriven', this.PlayStore.totalDriven)
            if( this.PlayStore.reverse){
              this.PlayStore.totalDriven = this.PlayStore.totalDriven - this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            this.PlayStore.wpDriven = this.PlayStore.wpDriven - this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            } else {
              this.PlayStore.totalDriven = this.PlayStore.totalDriven + this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
              this.PlayStore.wpDriven = this.PlayStore.wpDriven + this.cosineDistanceBetweenPoints(this.prevLoc, this.loc);
            }
            
          }
          if(isNaN(this.PlayStore.totalDriven)){
            this.PlayStore.totalDriven = 0;
          }
          if(isNaN(this.PlayStore.wpDriven)){
            this.PlayStore.wpDriven = 0;
          }
          let WPLoc = {
            latitude:this.route.wpt[this.PlayStore.activeWP]['@_lat'],
            longitude:this.route.wpt[this.PlayStore.activeWP]['@_lon']

          }
          console.log('WPLoc', WPLoc)
          this.distToNextWP = this.cosineDistanceBetweenPoints(
            this.loc, 
            WPLoc
          )

          if( this.SettingsStore.settings.helpers.autoclear === true ){
            if(this.distToNextWP < 15){
              this.PlayStore.incrementWP();
            }
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
        this.PlayStore.route = this.route;
        this.PlayStore.routeTitle = this.routeTitle;
        this.PlayStore.totalWPs = this.route.wpt.length
      },
      evaluatePedalAction(e){
        if(!this.SettingsStore.settings.helpers.pedal){
          return
        }
        // wpdistclear
        if(e.key == this.SettingsStore.settings.buttons.wpdistclear){
          this.PlayStore.wpDriven=0
        }
        // nextwp
        if(e.key == this.SettingsStore.settings.buttons.nextwp){
          this.PlayStore.incrementWP();
        }
        // synctot
        if(e.key == this.SettingsStore.settings.buttons.synctot){
          console.log(`Setting totalDriven distance to: ${this.PlayStore.route.wpt[this.PlayStore.activeWP].extensions['openrally:distance']}`)
          this.syncDistance( this.PlayStore.route.wpt[this.PlayStore.activeWP - 1].extensions['openrally:distance'] );
        }
      },
      syncDistance(dist){
        console.log('dist', dist)
        if(dist !== undefined && dist !== null){
          console.log('syncing distance')
          this.PlayStore.totalDriven = dist * 1000;
        }
      }
    },
    mounted() {
      this.route = this.PlayStore.route;
      this.routeTitle = this.PlayStore.routeTitle;
      if(this.route.wpt?.length ){
        this.fileLoaded = true;
      }
      this.getLoc();

      if(this.SettingsStore.settings.helpers.pedal && this.PlayStore.activeEventListener == false){
        this.PlayStore.activeEventListener = true;
        console.log('adding Event Listener')
        this.PlayStore.activeEventListenerfunc = window.addEventListener('keyup', this.evaluatePedalAction.bind(this));
      }
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
