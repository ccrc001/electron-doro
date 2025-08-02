import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// const icon = join(__dirname, '../../../resources/icon.png')
import icon from '../../resources/icon.png?asset'

// 定义应用图标路径
// const icon = join(__dirname, '../../resources/icon.png')
// import { createDockMenu } from './modules/dockMenu'

import {
  createProgressBar,
  createTray,
  registerContextMenu,
  // newWindow,
  piniaStoreChange,
  languageChange,
  themeStyleChange,
  setupAutoUpdater,
  checkForUpdatesOnStartup,
  setupAppWakeup,
  clearStorageData
} from './modules'
import { windowManager, WindowConfig } from './utils/WindowManager'

// 声明全局变量
let mainWindow: BrowserWindow | null = null
// let tray: Tray | null = null
// 扩展 app 接口以添加 isQuitting 属性
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean
    }
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false, // 初始设置为 false，等待 ready-to-show 事件
    autoHideMenuBar: true,
    icon,
    title: 'Doro爱吃欧润吉',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true, // 允许使用webview标签
      contextIsolation: false,
      webSecurity: false
      // devTools: process.env.NODE_ENV !== 'production' // 生产环境关闭浏览器控制台
    }
  })

  // 监听窗口最小化事件
  mainWindow.on('minimize', () => {
    if (mainWindow) {
      mainWindow.hide()
    }
  })

  // 监听窗口关闭事件
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      if (mainWindow) {
        mainWindow.hide()
      }
    }
  })

  // 当窗口准备好时显示
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.setTitle('Doro爱吃欧润吉')
    // mainWindow?.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.doro.app')

  // 设置应用名称，不显示描述
  app.setName('Doro爱吃欧润吉')

  // 确保应用在任务栏中显示正确的名称
  if (process.platform === 'win32') {
    app.setAppUserModelId('Doro爱吃欧润吉')
  }

  // 初始化应用退出标志
  app.isQuitting = false

  // 创建窗口
  createWindow()

  if (mainWindow) {
    //创建托盘
    await createTray(mainWindow)
    //注册右键菜单
    await registerContextMenu(mainWindow)
    // 创建进度条
    await createProgressBar(mainWindow)
    // 新窗口
    // await newWindow()  //fix:preload 引入失败
    //pinia同步
    await piniaStoreChange()

    // 语言同步
    await languageChange()

    // 主题样式同步
    await themeStyleChange()

    // 设置自动更新
    setupAutoUpdater(mainWindow)

    // 启动时检查更新（延迟执行）
    checkForUpdatesOnStartup()
    
    // 应用唤醒
    setupAppWakeup(mainWindow)

    // 清除缓存
    clearStorageData()
  }

  // 创建 Dock 菜单
  // createDockMenu(createWindow)

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => {
    console.log(process.env)

    console.log('ping')
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


/**
 * 新建一个窗口
 * route=>路由地址  paramJsonStr => 序列化后的参数对象
 */
ipcMain.handle('open-win', (_, route: string, paramJsonStr: string) => {
  const params = paramJsonStr ? JSON.parse(paramJsonStr) : null

  // 使用路由作为窗口的唯一标识
  const windowKey = `window_${route.replace(/\//g, '_')}`

  const config: WindowConfig = {
    route,
    width: 700,
    height: 550,
    minWidth: 700,
    minHeight: 550,
    title: 'Doro爱摸鱼-子窗口',
    params
  }

  // 创建或获取窗口（如果已存在则获取焦点）
  windowManager.createOrGetWindow(windowKey, config)

  // 返回窗口标识而不是窗口对象
  return { windowKey, success: true }
})

/**
 * 创建自定义窗口 - 支持完整配置
 */
ipcMain.handle('create-custom-window', (_, windowKey: string, config: WindowConfig) => {
  windowManager.createOrGetWindow(windowKey, config)
  return { windowKey, success: true }
})

/**
 * 关闭指定窗口
 */
ipcMain.handle('close-window', (_, windowKey: string) => {
  windowManager.closeWindow(windowKey)
})

/**
 * 获取窗口是否存在
 */
ipcMain.handle('has-window', (_, windowKey: string) => {
  return windowManager.hasWindow(windowKey)
})

// 修改窗口关闭行为
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (app.isQuitting) {
      app.quit()
    }
  }
})

// 应用退出前清理
app.on('before-quit', () => {
  app.isQuitting = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
