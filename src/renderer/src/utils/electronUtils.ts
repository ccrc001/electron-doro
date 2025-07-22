/**
 * 新建一个窗口
 * @param path 路由地址
 */
export function openNewWindow(path: string, param: Object) {
  let paramJsonStr = undefined
  if (param) {
    paramJsonStr = JSON.stringify(param)
  }
  window.electron.ipcRenderer.invoke('open-win', path, paramJsonStr)
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
