import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import '@/registerServiceWorker';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { vOnLongPress } from '@vueuse/components';
import './registerServiceWorker'

const app = createApp(App)

app.use(router)
app.use(vOnLongPress);

app.mount('#app')
