import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@tabler/core'
import '@tabler/core/dist/css/tabler.min.css'

import 'apexcharts'
import 'autosize'
import 'choices.js'
import 'countup.js'
import 'flatpickr'
import 'imask'
import 'litepicker'
import 'nouislider'
import 'tom-select'

const app = createApp(App)

app.use(router)

app.mount('#app')
