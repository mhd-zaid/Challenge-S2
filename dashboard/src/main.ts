import './assets/main.css'

import { createApp } from 'vue'
import { plugin, defaultConfig } from '@formkit/vue'
import ToastPlugin from 'vue-toast-notification';
import config from '@/modules/formkit.config'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(plugin, defaultConfig(config))
app.use(ToastPlugin)

app.mount('#app')
