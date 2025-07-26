import { ElectronAPI } from '@electron-toolkit/preload'

interface UpdaterAPI {
  checkForUpdates: () => Promise<any>
  downloadUpdate: () => Promise<boolean>
  installUpdate: () => void
  getAppVersion: () => Promise<>
  onUpdateStatus: (callback: (status: string) => void) => void
  onDownloadProgress: (callback: (progress: any) => void) => void
  removeAllListeners: () => void
}

interface API {
  updater: UpdaterAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
