import { defineStore } from 'pinia'
import { themeModeEnum, keyThemePrefix } from '@utils/themeUtils'

/**应用相关状态管理 */
export const useAppStore = defineStore('useAppStore', () => {
  const lang = ref(cacheUtils.get('lang') || 'zh-cn') // app的语言
  const theme = ref(cacheUtils.get(keyThemePrefix + 'mode')) || themeModeEnum.light // app的主题
  const count = ref(0)

  function increment() {
    count.value++
  }
  function decrement() {
    count.value--
  }

  return {
    lang,
    theme,
    count,
    increment,
    decrement
  }
})
