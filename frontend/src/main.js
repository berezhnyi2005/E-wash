import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";



import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import router from './router'

const app = createApp(App)


app.use(createPinia())

app.use(Toast, {
  position: "bottom-center"
})
app.use(router)



app.mount('#app')
