import './assets/main.css'
import { initTheme } from '@utils/themeUtils'

import { createApp } from 'vue'
import App from './App.vue'

import './scripts/appInit'
import './scripts/mockProdServer'
import router from './router'
import i18n from './locales'

// Mock 服务初始化 - 根据环境变量决定是否启用
// if (import.meta.env.VITE_USE_MOCK === 'true') {
//   if (import.meta.env.PROD) {
//     // 生产环境 Mock (手动方式，更可靠)
//     console.log('🎯 [Manual] Starting production mock server...')
//     import('./api/mock/mock-prod-server')
//       .then(({ setupProdMockServer }) => {
//         setupProdMockServer()
//         console.log('🚀 [Manual] Production Mock Server started successfully')
//       })
//       .catch((error) => {
//         console.error('❌ [Manual] Failed to start production mock server:', error)
//       })
//   } else {
//     // 开发环境 Mock 由 viteMockServe 自动处理
//     console.log('🔧 [Auto] Development Mock Server handled by viteMockServe')
//   }
// }
// import { createPinia } from 'pinia'//引入pinia持久化插件
// import 'element-plus/theme-chalk/el-message.css'
// import 'element-plus/theme-chalk/el-message-box.css'
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
