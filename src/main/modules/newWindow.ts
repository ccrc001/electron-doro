import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
const preload = join(__dirname, '../../preload/index.js')

const indexHtml = join(__dirname, '../../renderer/index.html')
export default function newWindow() {
  ipcMain.handle('open-win', (_, route: string, paramJsonStr: string) => {
    let childWindow = new BrowserWindow({
      webPreferences: {
        preload,
        sandbox: false
      }
    })

    // 当窗口准备好时显示
    childWindow.on('ready-to-show', () => {
      childWindow?.show() // 直接使用可选链操作符更简洁
      childWindow?.setTitle('我不爱摸鱼子窗口')
      childWindow?.webContents.openDevTools()
    })

    const paramData = paramJsonStr ? '?urlParamData=' + paramJsonStr : ''
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      childWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}${paramData}`)
    } else {
      childWindow.loadFile(indexHtml, { hash: route + paramData })
    }
    childWindow.on('closed', () => {
      // 在窗口对象被关闭时，取消订阅所有与该窗口相关的事件
      childWindow.removeAllListeners()

      childWindow = null
    })
  })
}
