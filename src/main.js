import { createApp } from 'vue'
import store from '@/app/store'
import App from './app/App.vue'

createApp(App).use(store).mount('#app')
