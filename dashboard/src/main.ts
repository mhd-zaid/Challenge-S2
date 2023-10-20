import './assets/main.css'
import {createApp} from 'vue'
import {plugin, defaultConfig} from '@formkit/vue'
import config from '@/modules/formkit.config'
import {createPinia} from 'pinia'
import 'vue3-toastify/dist/index.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig(config))

app.mount('#app')
