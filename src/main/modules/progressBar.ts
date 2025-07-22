import { ipcMain, BrowserWindow } from 'electron'

/**
 * show : ture 显示app进度条，false，关闭显示
 */
let progressInterval
export default function createProgressBar(mainWindow: BrowserWindow) {
  ipcMain.handle('show-process', (_event, show: boolean) => {
    const INCREMENT = 0.03
    const INTERVAL_DELAY = 100 // ms

    let c = 0
    if (show) {
      progressInterval = setInterval(() => {
        mainWindow.setProgressBar(c)
        if (c < 2) {
          c += INCREMENT
        } else {
          c = -INCREMENT * 5
        }
      }, INTERVAL_DELAY)
    } else {
      c = 0
      mainWindow.setProgressBar(c)
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  })
}
