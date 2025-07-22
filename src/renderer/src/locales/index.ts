import { createI18n } from 'vue-i18n'
import { useAppStore } from '@stores/useAppStore'
//自己的包
import zh from './lang/zh-cn'
import en from './lang/en'

//element语言包
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import English from 'element-plus/dist/locale/en.mjs'

const messages = {
  'zh-cn': {
    el: zh,
    ...zh
  },
  en: {
    el: en,
    ...en
  }
}
const i18n = createI18n({
  locale: cacheUtils.get('lang') || 'zh-cn', // 初始化配置语言
  messages, // 设置语言环境
  legacy: false, // 使用 Composition API
  globalInjection: true // 全局注入 $t 方法
})

export default i18n
// 初始化语言监听
export function initLangListener() {
  const appStore = useAppStore()
  // 监听语言切换时，同步本窗口更新
  window.electron.ipcRenderer.on('lang:change', (_event, lang: string) => {
    // console.log(lang)

    i18n.global.locale.value = lang
    appStore.lang = lang
  })
}
