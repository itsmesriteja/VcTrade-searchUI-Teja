import { createApp } from 'vue'
import { store, key } from './store'
import './assets/main.css'
import App from './App.vue'

const app = createApp(App)

// Add Vuex store
app.use(store, key)

app.mount('#app')
