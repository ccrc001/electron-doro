import { app, Tray, Menu, BrowserWindow } from 'electron'
// import { join } from 'path'

import icon from '../../../resources/icon.png?asset'
// 定义应用图标路径
// const icon = join(__dirname, '../../../resources/icon.png')
let tray: Tray | null = null
export default function createTray(mainWindow: BrowserWindow) {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        mainWindow?.show() // 使用可选链操作符
      }
    },
    {
      label: '隐藏',
      click: () => {
        mainWindow?.hide() // 使用可选链操作符
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

  tray.setToolTip('摸鱼起来谁都找不到我')
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
