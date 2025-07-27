import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
//*************** 应用唤醒相关 ********************/
export default function setupAppWakeup(mainWindow: BrowserWindow): void {
  // 注册协议
  const PROTOCOL = 'doroapp'
  /**添加注册表信息 用于浏览器启动客户端 */
  function registerScheme(): void {
    const args: string[] = []
    if (!app.isPackaged) {
      // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
      args.push(join(process.argv[1]))
    }
    // 加一个 `--` 以确保后面的参数不被 Electron 处理
    args.push('--')
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)
    handleArgv(process.argv)
  }

  // 处理浏览器打开应用的启动参数信息
  function handleArgv(argv: string[]): void {
    const prefix = `${PROTOCOL}:`
    // 开发阶段，跳过前两个参数（`electron.exe .`）
    // 打包后，跳过第一个参数（`myapp.exe`）
    const offset = app.isPackaged ? 1 : 2
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
    if (url) handleUrl(url)
  }
  // 房间号
  let roomCode = ''

  // 处理url打开应用的请求
  function handleUrl(url: string): void {
    // doroapp://joinRoom?roomCode=123
    const urlObj = new URL(url)
    const { searchParams } = urlObj
    roomCode = searchParams.get('roomCode') || ''
    if (mainWindow && mainWindow.webContents) {
      mainWindow?.webContents.send('launch-app', roomCode)
    }
  }

  // 返回房间号，主要用于mac主动获取，因为mac在执行handleUrl操作时，可能页面窗口还未初始化完成
  ipcMain.on('get-roomCode', (e) => {
    e.returnValue = roomCode
  })
  // 注册协议，用于浏览器打开应用
  registerScheme()
  // macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
  app.on('open-url', (event, urlStr) => {
    handleUrl(urlStr)
  })

  //*************** 应用唤醒相关 ********************/
}
