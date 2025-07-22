import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
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
  checkForUpdatesOnStartup
} from './modules'

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
    show: false, // 初始设置为 false，等待 ready-to-show 事件
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    title: 'Doro爱吃欧润吉',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,

      devTools: process.env.NODE_ENV !== 'production' // 生产环境关闭浏览器控制台
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
  electronApp.setAppUserModelId('electron.app')

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

/**pinia多窗口共享 */
// ipcMain.handle(
//   'pinia-store-change',
//   (
//     event,
//     storeName: string,
//     jsonStr: string,
//     isResetVersion: boolean,
//     storeUpdateVersion: number
//   ) => {
//     // 遍历window执行
//     for (const currentWin of BrowserWindow.getAllWindows()) {
//       const webContentsId = currentWin.webContents.id
//       if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
//         currentWin.webContents.send(
//           'pinia-store-set',
//           storeName,
//           jsonStr,
//           isResetVersion,
//           storeUpdateVersion
//         )
//       }
//     }
//   }
// )

/**语言修改同步 */
// ipcMain.handle('lang:change', (event, lang) => {
//   // 通知所有窗口同步更改语言
//   for (const currentWin of BrowserWindow.getAllWindows()) {
//     const webContentsId = currentWin.webContents.id
//     console.log(webContentsId !== event.sender.id && !currentWin.isDestroyed())
//     console.log(event.sender.id, webContentsId)

//     // 这里排除掉发送通知的窗口
//     if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
//       currentWin.webContents.send('lang:change', lang)
//     }
//   }
// })

// // 主题样式修改同步
// ipcMain.handle('theme-style:change', (event, mode?: 'system' | 'light' | 'dark') => {
//   if (mode && 'system,light,dark'.indexOf(mode) >= 0) {
//     nativeTheme.themeSource = mode
//   }
//   // 通知所有窗口同步更改样式
//   // 遍历window执行
//   for (const currentWin of BrowserWindow.getAllWindows()) {
//     const webContentsId = currentWin.webContents.id
//     if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
//       currentWin.webContents.send('theme-style:changed', mode)
//     }
//   }
// })

//*************** 应用唤醒相关 ********************/
// 注册协议
const PROTOCOL = 'bcxlelectrondemo'
/**添加注册表信息 用于浏览器启动客户端 */
function registerScheme() {
  const args = []
  if (!app.isPackaged) {
    // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
    args.push(join(process.argv[1]))
  }
  // 加一个 `--` 以确保后面的参数不被 Electron 处理
  args.push('--')
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)
  handleArgv(process.argv)
}

// 处理浏览器打开应用的启动参数信息
function handleArgv(argv: string[]) {
  const prefix = `${PROTOCOL}:`
  // 开发阶段，跳过前两个参数（`electron.exe .`）
  // 打包后，跳过第一个参数（`myapp.exe`）
  const offset = app.isPackaged ? 1 : 2
  const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
  if (url) handleUrl(url)
}
// 房间号
let roomCode = ''

// 处理url打开应用的请求
function handleUrl(url: string) {
  // bcxlelectrondemo://joinRoom?roomCode=123
  const urlObj = new URL(url)
  const { searchParams } = urlObj
  roomCode = searchParams.get('roomCode') || ''
  if (mainWindow && mainWindow.webContents) {
    mainWindow?.webContents.send('launch-app', roomCode)
  }
}

// 返回房间号，主要用于mac主动获取，因为mac在执行handleUrl操作时，可能页面窗口还未初始化完成
ipcMain.on('get-roomCode', (e) => {
  e.returnValue = roomCode
})
// 注册协议，用于浏览器打开应用
registerScheme()
// macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
app.on('open-url', (event, urlStr) => {
  handleUrl(urlStr)
})

//*************** 应用唤醒相关 ********************/

/**
 * 新建一个窗口
 * route=>路由地址  paramJsonStr => 序列化后的参数对象
 */
ipcMain.handle('open-win', (_, route: string, paramJsonStr: string) => {
  let childWindow = new BrowserWindow({
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,

      devTools: process.env.NODE_ENV !== 'production' // 生产环境关闭浏览器控制台
    }
  })

  // 当窗口准备好时显示
  childWindow.on('ready-to-show', () => {
    childWindow?.show() // 直接使用可选链操作符更简洁
    childWindow?.setTitle('Doro爱摸鱼-子窗口')
    // childWindow?.webContents.openDevTools()
  })

  const paramData = paramJsonStr ? '?urlParamData=' + paramJsonStr : ''
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    childWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}${paramData}`)
  } else {
    childWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: route + paramData })
  }

  childWindow.on('closed', () => {
    // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
    childWindow.removeAllListeners()

    childWindow = null
  })
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
