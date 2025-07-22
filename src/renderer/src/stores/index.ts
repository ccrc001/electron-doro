import { createPinia } from 'pinia'
import { shareStorePlugin } from '@stores/plugins/useShareStorePlugin'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()

// 添加状态共享插件
pinia.use(shareStorePlugin)

pinia.use(piniaPluginPersistedstate) // 使用pinia持久化插件
export default pinia
