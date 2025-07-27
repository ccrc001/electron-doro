/**
 * 新建一个窗口
 * @param path 路由地址
 */
export function openNewWindow(path: string, param: Object): void {
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
export const getParamFromUrl = function (): object | null {
  const url = decodeURIComponent(document.location.href)
  const index = url.indexOf(urlParamKey)
  if (index >= 0) {
    return JSON.parse(url.substring(index + urlParamKey.length))
  }
  return null
}

export const getRoomCode = function (): string {
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

/**
 * 窗口配置接口
 */
export interface WindowConfig {
  route: string // 路由路径
  width?: number // 窗口宽度
  height?: number // 窗口高度
  minWidth?: number // 最小宽度
  minHeight?: number // 最小高度
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
  title?: string // 窗口标题
  backgroundColor?: string // 背景色
  transparent?: boolean // 是否透明
  opacity?: number //窗口透明度
  resizable?: boolean // 是否可调整大小
  minimizable?: boolean // 是否可最小化
  maximizable?: boolean // 是否可最大化
  closable?: boolean // 是否可关闭
  alwaysOnTop?: boolean // 是否置顶
  modal?: boolean // 是否为模态窗口
  center?: boolean // 是否居中
  show?: boolean // 是否立即显示
  frame?: boolean // 是否显示边框
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover'
  webSecurity?: boolean // 是否启用 web 安全
  params?: any // 传递给窗口的参数
}
/**
 * 创建自定义窗口
 * @param windowKey 窗口唯一标识
 * @param config 窗口配置
 */
export const createCustomWindow = function (
  windowKey: string,
  config: WindowConfig
): Promise<void> {
  return window.electron.ipcRenderer.invoke('create-custom-window', windowKey, config)
}

/**
 * 关闭指定窗口
 * @param windowKey 窗口唯一标识
 */
export function closeWindow(windowKey: string): Promise<void> {
  return window.electron.ipcRenderer.invoke('close-window', windowKey)
}

/**
 * 检查窗口是否存在
 * @param windowKey 窗口唯一标识
 */
export function hasWindow(windowKey: string): Promise<boolean> {
  return window.electron.ipcRenderer.invoke('has-window', windowKey)
}

/**
 * 设置页面透明度
 * @param opacity 透明度
 */
export function setOpacity(opacity: number): void {
  window.electron.ipcRenderer.invoke('set-opacity', opacity)
}
