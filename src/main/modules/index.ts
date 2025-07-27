// 导出所有模块
import createProgressBar from './progressBar' // 进度条
import createTray from './trayMenu' // 托盘
import registerContextMenu from './registerContextMenu' // 右键菜单
import newWindow from './newWindow' //新窗口
import piniaStoreChange from './piniaStoreChange' //多窗口pinia同步
import languageChange from './languageChange' //语言同步
import themeStyleChange from './themeStyleChange' //主题样式同步
import { setupAutoUpdater, checkForUpdatesOnStartup } from './autoUpdater' // 自动更新
import setupAppWakeup from './appWakeup' // 应用唤醒
import clearStorageData from './clearStorageData' // 清除缓存

export {
  createProgressBar,
  createTray,
  registerContextMenu,
  newWindow,
  piniaStoreChange,
  languageChange,
  themeStyleChange,
  setupAutoUpdater,
  checkForUpdatesOnStartup,
  setupAppWakeup,
  clearStorageData
}
