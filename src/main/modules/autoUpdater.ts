import { autoUpdater } from 'electron-updater'
import { BrowserWindow, dialog, ipcMain, Notification } from 'electron'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log'
import icon from '../../../resources/icon.png?asset'
let mainWindow: BrowserWindow | null = null

// 配置日志
log.transports.file.level = 'info'
log.transports.console.level = 'info'
// 配置自动更新
export function setupAutoUpdater(window: BrowserWindow): void {
  mainWindow = window
console.log('自动执行了',is.dev);

  // 配置更新服务器
  if (!is.dev) {
    // 生产环境配置
    // 禁用自动下载（手动控制下载）
    autoUpdater.autoDownload = false
     // 开启开发环境调试，后边会有说明
     autoUpdater.forceDevUpdateConfig = true
    // autoUpdater.checkForUpdatesAndNotify()
  }

  // 设置更新日志
  autoUpdater.logger = log

  // 检查更新事件
  autoUpdater.on('checking-for-update', () => {
    console.log('正在检查更新...')
    sendStatusToWindow('正在检查更新...')
  })

  // 发现可用更新
  autoUpdater.on('update-available', (info) => {
    console.log('发现新版本:', info.version)
    sendStatusToWindow(`发现新版本: ${info.version}`)
   new Notification({
    icon: icon,
    title: '发现新版本',
    body: `发现新版本 ${info.version}，是否立即下载？`
   }).show()

    // 显示更新提示对话框
    dialog
      .showMessageBox(mainWindow!, {
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 ${info.version}，是否立即下载？`,
        buttons: ['立即下载', '稍后提醒'],
        defaultId: 0
      })
      .then((result) => {
        if (result.response === 0) {
          // 通知获取更新
          sendStatusToWindow('获取更新中...')

          // 用户选择立即下载
          autoUpdater.downloadUpdate()
        }
      })
  })

  // 没有可用更新
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本:', info.version)
    sendStatusToWindow('当前已是最新版本')
  })

  // 更新下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `下载进度: ${progressObj.percent.toFixed(2)}%`
    logMessage += ` (${progressObj.transferred}/${progressObj.total})`
    console.log(logMessage)
    sendStatusToWindow(logMessage)

    // 发送下载进度到渲染进程
    mainWindow?.webContents.send('download-progress', {
      percent: progressObj.percent,
      transferred: progressObj.transferred,
      total: progressObj.total
    })
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', (info) => {
    console.log('更新下载完成:', info.version)
    sendStatusToWindow('更新下载完成，准备安装...')

    // 显示安装提示对话框
    dialog
      .showMessageBox(mainWindow!, {
        type: 'info',
        title: '更新下载完成',
        message: `新版本 ${info.version} 已下载完成，是否立即重启安装？`,
        buttons: ['立即重启', '稍后安装'],
        defaultId: 0
      })
      .then((result) => {
        if (result.response === 0) {
          // 用户选择立即重启安装
          autoUpdater.quitAndInstall()
        }
      })
  })

  // 更新错误
  autoUpdater.on('error', (err) => {
    console.error('自动更新错误:', err)
    sendStatusToWindow(`更新错误: ${err.message}`)
  })

  // 监听来自渲染进程的更新请求
  ipcMain.handle('check-for-updates', async () => {
    if (!is.dev) {
      try {
        const result = await autoUpdater.checkForUpdates()
        return result
      } catch (error) {
        console.error('检查更新失败:', error)
        return null
      }
    } else {
      console.log('开发环境，跳过更新检查')
      return null
    }
  })

  // 监听来自渲染进程的下载更新请求
  ipcMain.handle('download-update', async () => {
    if (!is.dev) {
      try {
        await autoUpdater.downloadUpdate()
        return true
      } catch (error) {
        console.error('下载更新失败:', error)
        return false
      }
    }
    return false
  })

  // 监听来自渲染进程的安装更新请求
  ipcMain.handle('install-update', () => {
    if (!is.dev) {
      autoUpdater.quitAndInstall()
    }
  })

  // 获取当前版本信息
  ipcMain.handle('get-app-version', () => {
    return autoUpdater.currentVersion
  })
}

// 发送状态消息到渲染进程
function sendStatusToWindow(text: string): void {
  console.log(text)
  mainWindow?.webContents.send('update-status', text)
}

// 启动时检查更新（延迟5秒）
export function checkForUpdatesOnStartup(): void {
  if (!is.dev) {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify()
    }, 5000)
  }
}
