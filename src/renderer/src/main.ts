import './assets/main.css'
import { initTheme } from '@utils/themeUtils'

import { createApp } from 'vue'
import App from './App.vue'

import './scripts/appInit'
import './scripts/mockProdServer'
import router from './router'
import i18n from './locales'

import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import { initLangListener } from './locales/index'
import pinia from './stores'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// const pinia = createPinia()
// pinia.use(shareStorePlugin)
app
  .use(i18n)
  .use(router)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
    initLangListener() // 语言初始化
    initTheme() // 主题色初始化
  })
