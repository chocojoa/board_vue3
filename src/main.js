import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import '@tabler/core'
import '@tabler/core/dist/css/tabler.min.css'

const app = createApp(App)

// Pinia 초기화
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.mount('#app')
