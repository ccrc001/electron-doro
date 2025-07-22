import { ipcMain, BrowserWindow } from 'electron'

export default function piniaStoreChange() {
/**pinia多窗口共享 */
ipcMain.handle(
    "pinia-store-change",
    (
      event,
      storeName: string,
      jsonStr: string,
      isResetVersion: boolean,
      storeUpdateVersion: number
    ) => {
      // 遍历window执行
      for (const currentWin of BrowserWindow.getAllWindows()) {
        const webContentsId = currentWin.webContents.id;
        if (webContentsId !== event.sender.id && !currentWin.isDestroyed()) {
          currentWin.webContents.send(
            "pinia-store-set",
            storeName,
            jsonStr,
            isResetVersion,
            storeUpdateVersion
          );
        }
      }
    }
  );
  
}
