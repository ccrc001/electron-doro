/**
 * 新建一个窗口
 * @param path 路由地址
 */
export function openNewWindow(path: string, param: Object) {
  let paramJsonStr: string | undefined = undefined
  if (param) {
    paramJsonStr = JSON.stringify(param)
  }
  window.electron.ipcRenderer.invoke('open-win', path, paramJsonStr || '')
}

const urlParamKey = 'urlParamData='
/**
 * 返回url传输的对象
 */
export const getParamFromUrl = function (): any {
  const url = decodeURIComponent(document.location.href)
  const index = url.indexOf(urlParamKey)
  if (index >= 0) {
    return JSON.parse(url.substring(index + urlParamKey.length))
  }
  return null
}

export const getRoomCode = function (): any {
  return window.electron.ipcRenderer.sendSync('get-roomCode')
}

/**
 * 监听新窗口参数
 * @param callback 接收参数的回调函数
 */
export const onWindowParams = function (
  callback: (data: { route: string; params: any }) => void
): void {
  window.electron.ipcRenderer.on('window-params', (_, data) => {
    callback(data)
  })
}

/**
 * 移除窗口参数监听器
 */
export const offWindowParams = function (): void {
  window.electron.ipcRenderer.removeAllListeners('window-params')
}
