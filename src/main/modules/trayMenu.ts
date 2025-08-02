import { app, Tray, Menu, BrowserWindow } from 'electron'
// 定义应用图标路径
import icon from '../../../resources/icon.png?asset'

let tray: Tray | null = null
export default function createTray(mainWindow: BrowserWindow): void {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        mainWindow?.show()
      }
    },
    {
      label: '隐藏',
      click: () => {
        mainWindow?.hide()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('其实Doro并不喜欢吃欧润吉')
  tray.setContextMenu(contextMenu)

  // 点击托盘图标显示/隐藏窗口
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })
}
