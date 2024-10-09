import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { vOnLongPress } from '@vueuse/components';

const app = createApp(App)

app.use(router)
app.use(vOnLongPress);

app.mount('#app')
