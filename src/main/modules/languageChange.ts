import { ipcMain, BrowserWindow } from 'electron'

/**语言修改同步 */
export default function languageChange() {
  ipcMain.handle('lang:change', (event, lang) => {
    // 通知所有窗口同步更改语言

    // 如果只有一个窗口就正常通知，如果有多个窗口，就排除掉发送通知的窗口
    if (BrowserWindow.getAllWindows().length == 1) {
      for (const currentWin of BrowserWindow.getAllWindows()) {
        currentWin.webContents.send('lang:change', lang)
      }
      return
    }
    for (const currentWin of BrowserWindow.getAllWindows()) {
      const webContentsId = currentWin.webContents.id

      // 这里排除掉发送通知的窗口
      if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
        currentWin.webContents.send('lang:change', lang)
      }
    }
  })
}
