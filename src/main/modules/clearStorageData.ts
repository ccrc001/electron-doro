import { ipcMain, session, BrowserWindow } from 'electron'
// 清除缓存
export default function clearStorageData(): void {
  ipcMain.handle('clear-storage-data', () => {
    session.defaultSession.clearStorageData()
    //刷新页面
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.reload()
    })
  })
}
