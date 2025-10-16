<template>
  <main class="pb-5 mb-5">
    <div class="container pt-2">
      <div class="card my-2 bg-secondary text-white">
        <div class="card-header">
          <h1 class="card-title">Instrument toggles</h1>
        </div>
        <div class="card-body">
          <div class="form-check form-switch py-2" v-for="setting of Object.keys(settingModels['instruments'])">
            <input class="form-check-input" type="checkbox" v-model="settingModels['instruments'][setting]" :id="`${setting}InstrumentLabel`" @change="toggle('instruments', setting)">
            <label class="form-check-label" :for="`${setting}InstrumentLabel`">{{ SettingsStore.getName('instruments', setting) }}</label>
          </div>
        </div>
      </div>

      <div class="card my-2 bg-secondary text-white">
        <div class="card-header">
          <h1 class="card-title">Roadbook toggles</h1>
        </div>
        <div class="card-body">
          <div class="form-check form-switch py-2" v-for="setting of Object.keys(settingModels['roadbook'])">
            <input class="form-check-input" type="checkbox" v-model="settingModels['roadbook'][setting]" :id="`${setting}RoadbookLabel`" @change="toggle('roadbook', setting)">
            <label class="form-check-label" :for="`${setting}RoadbookLabel`">{{ SettingsStore.getName('roadbook', setting) }}</label>
          </div>
        </div>
      </div>

      <div class="card my-2 bg-secondary text-white">
        <div class="card-header">
          <h1 class="card-title">Helper toggles</h1>
        </div>
        <div class="card-body">
          <div class="form-check form-switch py-2" v-for="setting of Object.keys(settingModels['helpers'])">
            <input class="form-check-input" type="checkbox" v-model="settingModels['helpers'][setting]" :id="`${setting}Helpersabel`" @change="toggle('helpers', setting)">
            <label class="form-check-label" :for="`${setting}HelpersLabel`">{{ SettingsStore.getName('helpers', setting) }}</label>
          </div>
        </div>
      </div>

      <div class="card my-2 bg-secondary text-white"  v-if="SettingsStore.settings.helpers.pedal === true">
        <div class="card-header">
          <h1 class="card-title">Pedal settings</h1>
        </div>
        <div class="card-body">
          <div class="input-group mb-3">
            <div class="input-group-append w-50">
              <button class="btn btn-primary w-100" type="button" @click="enableListener('wpdistclear')">Clear WP distance</button>
            </div>
            <input type="text" ref="wpdistclear_input" class="form-control" placeholder="press button" :disabled="!wpkeys.wpdistclear.listening" v-model="wpkeys.wpdistclear.inputval" @keydown="handleKeypressDetector">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-append w-50">
              <button class="btn btn-primary w-100" type="button" @click="enableListener('nextwp')">Check off waypoint</button>
            </div>
            <input type="text" ref="nextwp_input" class="form-control" placeholder="press button" :disabled="!wpkeys.nextwp.listening" v-model="wpkeys.nextwp.inputval" @keydown="handleKeypressDetector">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-append w-50">
              <button class="btn btn-primary w-100" type="button" @click="enableListener('synctot')">Sync TOT dist</button>
            </div>
            <input type="text" ref="synctot_input" class="form-control" placeholder="press button" :disabled="!wpkeys.synctot.listening" v-model="wpkeys.synctot.inputval" @keydown="handleKeypressDetector">
          </div>
        </div>
      </div>
    </div>
    

    <div class="container">
      <div class="btn-group mt-2 w-100">
        <RouterLink to="/credits" class="btn btn-secondary active">Credits</RouterLink>
        <RouterLink to="/faq" class="btn btn-secondary">FAQ</RouterLink>
      </div>
    </div>
  </main>
</template>

<script>
import { RouterLink } from 'vue-router';
import { SettingsStore } from '../stores/SettingsStore.js';

export default {
  data() {
    return {
      SettingsStore,
      settingModels: {
        instruments: {},
        roadbook: {},
        helpers: {}
      },
      wpkeys: {
        wpdistclear:{
          listening: false,
          inputval: '',
          value: null
        },
        nextwp:{
          listening: false,
          inputval: '',
          value: null
        },
        synctot:{
          listening: false,
          inputval: '',
          value: null
        }
      },
    }
  },
  methods:{
    toggle(settingsType, setting){
      this.SettingsStore.set(settingsType, setting, !this.SettingsStore.settings[settingsType][setting]);
      // this.showDebug = this.SettingsStore.get('showDebug');
    },
    handleKeypressDetector(e){
      if(this.wpkeys.wpdistclear.listening){
        this.wpkeys.wpdistclear.listening = false;
        this.wpkeys.wpdistclear.inputval = e.key;
        this.SettingsStore.set('buttons', 'wpdistclear', e.key);
        console.log(e.key)
      }
      if(this.wpkeys.nextwp.listening){
        this.wpkeys.nextwp.listening = false;
        this.wpkeys.nextwp.inputval = e.key;
        this.SettingsStore.set('buttons', 'nextwp', e.key);
        console.log(e.key)
      }
      if(this.wpkeys.synctot.listening){
        this.wpkeys.synctot.listening = false;
        this.wpkeys.synctot.inputval = e.key;
        this.SettingsStore.set('buttons', 'synctot', e.key);
        console.log(e.key)
      }
    },
    enableListener(field){
      this.wpkeys[field].listening = true;
      this.wpkeys[field].inputval = '';
      setTimeout(function(){
        this.$refs[`${field}_input`].focus()
        console.log('tick')
      }.bind(this),50)
    }
  },
  mounted(){
    for(let settingType of Object.keys(this.SettingsStore.settings)){
      if(settingType != 'buttons'){
        for(let setting of Object.keys(this.SettingsStore.settings[settingType])){
          console.log(settingType, setting, this.SettingsStore.settings[settingType][setting]);
          this.settingModels[settingType][setting] = this.SettingsStore.settings[settingType][setting];
        }
      }
      if(settingType == 'buttons'){
        for(let setting of Object.keys(this.SettingsStore.settings[settingType])){
          console.log(settingType, setting, this.SettingsStore.settings[settingType][setting]);
          this.wpkeys[setting].inputval = this.SettingsStore.settings[settingType][setting];
        }
      }
    }
  }
}
</script>

<style>
main{
  min-height: 100vh;
}
</style>
