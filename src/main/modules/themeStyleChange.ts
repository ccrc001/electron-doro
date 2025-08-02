import { ipcMain, BrowserWindow, nativeTheme } from 'electron'

// 主题样式修改同步
export default function themeStyleChange(): void {
  ipcMain.handle('theme-style:change', (event, mode?: 'system' | 'light' | 'dark') => {
    if (mode && 'system,light,dark'.indexOf(mode) >= 0) {
      nativeTheme.themeSource = mode
    }
    // 通知所有窗口同步更改样式
    // 遍历window执行
    if (BrowserWindow.getAllWindows().length == 1) {
      for (const currentWin of BrowserWindow.getAllWindows()) {
        currentWin.webContents.send('theme-style:changed', mode)
      }
      return
    }

    for (const currentWin of BrowserWindow.getAllWindows()) {
      const webContentsId = currentWin.webContents.id
      if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
        currentWin.webContents.send('theme-style:changed', mode)
      }
    }
  })
}
