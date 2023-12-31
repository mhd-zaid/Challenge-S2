import {createApp} from 'vue'
import './assets/main.css'
import {createPinia} from 'pinia'
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast);

app.mount('#app')
