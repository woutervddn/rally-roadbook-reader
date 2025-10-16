import { reactive } from 'vue'

const defaultSettings = {
  instruments:{
    showDebug: {
      val: false,
      name: 'Show GPS position instrument'
    },
    showCap: {
      val: true,
      name: 'Show Cap instrument'
    },
    showSpeed: {
      val: true,
      name: 'Show Speed instrument'
    },
    showWpOdo: {
      val: true,
      name: 'Show WP ODO instrument'
    },
    showTotOdo: {
      val: true,
      name: 'Show Total ODO instrument'
    }
  },
  roadbook:{
    showCap: {
      val: true,
      name: 'Show Cap indications'
    },
    showGPS: {
      val: true,
      name: 'Show WP GPS'
    },
    showWPNo: {
      val: true,
      name: 'Show WP number'
    },
    showWPDist: {
      val: true,
      name: 'Show WP Distance'
    },
  },
  helpers:{
    pedal: {
      val: false,
      name: 'Use footpedal or pageturner'
    },
    autoclear: {
      val: true,
      name: 'Autocheck WPs when close'
    },
    autoclearwpdist:{
      val: true,
      name: 'Autoclear WP Dist when clearing WP'
    },
    autoscroll: {
      val: true,
      name: 'Autoscroll to next WP'
    },
    autosynctot:{
      val: false,
      name: 'Auto sync TOT when clearing WP'
    },
    showDistToNextWp:{
      val: true,
      name: 'Show Distance to next WP'
    }
  }
};

export const SettingsStore = reactive({
  settings:{
    instruments: {
      showDebug: localStorage.hasOwnProperty('instruments_showDebug') ? JSON.parse(localStorage.getItem('instruments_showDebug')).val : defaultSettings.instruments.showDebug.val,
      showCap: localStorage.hasOwnProperty('instruments_showCap') ? JSON.parse(localStorage.getItem('instruments_showCap')).val : defaultSettings.instruments.showCap.val,
      showSpeed: localStorage.hasOwnProperty('instruments_showSpeed') ? JSON.parse(localStorage.getItem('instruments_showSpeed')).val : defaultSettings.instruments.showSpeed.val,
      showWpOdo: localStorage.hasOwnProperty('instruments_showWpOdo') ? JSON.parse(localStorage.getItem('instruments_showWpOdo')).val : defaultSettings.instruments.showWpOdo.val,
      showTotOdo: localStorage.hasOwnProperty('instruments_showTotOdo') ? JSON.parse(localStorage.getItem('instruments_showTotOdo')).val : defaultSettings.instruments.showTotOdo.val
    },
    roadbook: {
      showCap: localStorage.hasOwnProperty('roadbook_showCap') ? JSON.parse(localStorage.getItem('roadbook_showCap')).val : defaultSettings.roadbook.showCap.val,
      showGPS: localStorage.hasOwnProperty('roadbook_showGPS') ? JSON.parse(localStorage.getItem('roadbook_showGPS')).val : defaultSettings.roadbook.showGPS.val,
      showWPNo: localStorage.hasOwnProperty('roadbook_showWPNo') ? JSON.parse(localStorage.getItem('roadbook_showWPNo')).val : defaultSettings.roadbook.showWPNo.val,
      showWPDist: localStorage.hasOwnProperty('roadbook_showWPDist') ? JSON.parse(localStorage.getItem('roadbook_showWPDist')).val : defaultSettings.roadbook.showWPDist.val,
    },
    helpers: {
      pedal: localStorage.hasOwnProperty('helpers_pedal') ? JSON.parse(localStorage.getItem('helpers_pedal')).val : defaultSettings.helpers.pedal.val,
      autoclear: localStorage.hasOwnProperty('helpers_autoclear') ? JSON.parse(localStorage.getItem('helpers_autoclear')).val : defaultSettings.helpers.autoclear.val,
      autoclearwpdist: localStorage.hasOwnProperty('helpers_autoclearwpdist') ? JSON.parse(localStorage.getItem('helpers_autoclearwpdist')).val : defaultSettings.helpers.autoclearwpdist.val,
      autosynctot: localStorage.hasOwnProperty('helpers_autosynctot') ? JSON.parse(localStorage.getItem('helpers_autosynctot')).val : defaultSettings.helpers.autosynctot.val,
      autoscroll: localStorage.hasOwnProperty('helpers_autoscroll') ? JSON.parse(localStorage.getItem('helpers_autoscroll')).val : defaultSettings.helpers.autoscroll.val,
      showDistToNextWp: localStorage.hasOwnProperty('helpers_showDistToNextWp') ? JSON.parse(localStorage.getItem('helpers_showDistToNextWp')).val : defaultSettings.helpers.showDistToNextWp.val
    },
    buttons: {
      wpdistclear: localStorage.hasOwnProperty('buttons_wpdistclear') ? JSON.parse(localStorage.getItem('buttons_wpdistclear')).val : '',
      nextwp: localStorage.hasOwnProperty('buttons_nextwp') ? JSON.parse(localStorage.getItem('buttons_nextwp')).val : '',
      synctot: localStorage.hasOwnProperty('buttons_synctot') ? JSON.parse(localStorage.getItem('buttons_synctot')).val : ''
    }
  },
  set(settingType, setting, value) {
    console.log(`setting ${settingType}.${setting} to ${value}`);
    this.settings[settingType][setting] = value;
    localStorage.setItem(`${settingType}_${setting}`, JSON.stringify({val: value}));
  },
  getName(settingType, setting){
    return defaultSettings[settingType][setting].name;
  },
  reset(settingType, setting){
    localStorage.removeItem(`${settingType}_${setting}`);
    return defaultSettings[settingType][setting];
  },
  resetAll(){
    for(settingType of Object.keys(defaultSettings)){
      for(setting of Object.keys(defaultSettings[settingType])){
        this.reset(`${settingType}_${setting}`);
      }
    }
  }

})
