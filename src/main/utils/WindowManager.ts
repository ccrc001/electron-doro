import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// 全局标志，确保 IPC 处理程序只注册一次
let ipcHandlersRegistered = false

// 窗口配置接口
export interface WindowConfig {
  route: string // 路由路径
  width?: number // 窗口宽度
  height?: number // 窗口高度
  minWidth?: number // 最小宽度
  minHeight?: number // 最小高度
  maxWidth?: number // 最大宽度
  maxHeight?: number // 最大高度
  title?: string // 窗口标题
  icon?: string // 自定义图标路径
  backgroundColor?: string // 背景色
  transparent?: boolean // 是否透明
  opacity?: number //窗口透明度
  resizable?: boolean // 是否可调整大小
  minimizable?: boolean // 是否可最小化
  maximizable?: boolean // 是否可最大化
  closable?: boolean // 是否可关闭
  alwaysOnTop?: boolean // 是否置顶
  modal?: boolean // 是否为模态窗口
  parent?: BrowserWindow // 父窗口
  center?: boolean // 是否居中
  show?: boolean // 是否立即显示
  frame?: boolean // 是否显示边框
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover'
  webSecurity?: boolean // 是否启用 web 安全
  params?: any // 传递给窗口的参数
}

// 默认窗口配置
const DEFAULT_CONFIG: Partial<WindowConfig> = {
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  title: 'Doro爱吃欧润吉',
  backgroundColor: '#ffffff',
  transparent: false,
  opacity: 1,
  resizable: true,
  minimizable: true,
  maximizable: true,
  closable: true,
  alwaysOnTop: false,
  modal: false,
  center: true,
  show: false,
  frame: true,
  titleBarStyle: 'default',
  webSecurity: true
}

// 窗口管理器类
export class WindowManager {
  private static instance: WindowManager
  private windows: Map<string, BrowserWindow> = new Map()
  private icon: string

  private constructor() {
    // 设置应用图标路径
    this.icon = is.dev
      ? join(__dirname, '../../resources/icon.png')
      : join(process.resourcesPath, 'icon.png')

    // 注册全局 IPC 处理程序（只注册一次）
    this.registerGlobalIpcHandlers()
  }

  /**
   * 注册全局 IPC 处理程序
   */
  private registerGlobalIpcHandlers(): void {
    if (ipcHandlersRegistered) {
      return
    }

    // 设置窗口透明度
    ipcMain.handle('set-opacity', (event, opacity: number) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (window && !window.isDestroyed()) {
        window.setOpacity(opacity)
      }
    })

    ipcHandlersRegistered = true
  }

  // 获取单例实例
  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager()
    }
    return WindowManager.instance
  }

  /**
   * 创建或获取窗口
   * @param key 窗口唯一标识
   * @param config 窗口配置
   * @returns BrowserWindow 实例
   */
  public createOrGetWindow(key: string, config: WindowConfig): BrowserWindow {
    // 如果窗口已存在，则获取焦点并返回
    if (this.windows.has(key)) {
      const existingWindow = this.windows.get(key)!
      if (!existingWindow.isDestroyed()) {
        existingWindow.focus()
        existingWindow.show()

        // 如果有新参数，发送给窗口
        if (config.params) {
          existingWindow.webContents.send('window-params', {
            route: config.route,
            params: config.params
          })
        }

        return existingWindow
      } else {
        // 窗口已销毁，从 Map 中移除
        this.windows.delete(key)
      }
    }

    // 创建新窗口
    return this.createWindow(key, config)
  }

  /**
   * 创建新窗口
   * @param key 窗口唯一标识
   * @param config 窗口配置
   * @returns BrowserWindow 实例
   */
  private createWindow(key: string, config: WindowConfig): BrowserWindow {
    // 合并配置
    const finalConfig = { ...DEFAULT_CONFIG, ...config }

    // 构建 BrowserWindow 选项
    const windowOptions: BrowserWindowConstructorOptions = {
      width: finalConfig.width,
      height: finalConfig.height,
      minWidth: finalConfig.minWidth,
      minHeight: finalConfig.minHeight,
      maxWidth: finalConfig.maxWidth,
      maxHeight: finalConfig.maxHeight,
      title: finalConfig.title,
      backgroundColor: finalConfig.backgroundColor,
      transparent: finalConfig.transparent,
      opacity: finalConfig.opacity,
      resizable: finalConfig.resizable,
      minimizable: finalConfig.minimizable,
      maximizable: finalConfig.maximizable,
      closable: finalConfig.closable,
      alwaysOnTop: finalConfig.alwaysOnTop,
      modal: finalConfig.modal,
      parent: finalConfig.parent,
      center: finalConfig.center,
      show: finalConfig.show,
      frame: finalConfig.frame,
      titleBarStyle: finalConfig.titleBarStyle,

      icon: finalConfig.icon || this.icon,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        webSecurity: finalConfig.webSecurity,
        nodeIntegration: false,
        contextIsolation: true,
        // 开发环境打开开发者工具
        devTools: is.dev ? true : false
      }
    }

    // 创建窗口
    const window = new BrowserWindow(windowOptions)

    // 注册窗口事件
    this.setupWindowEvents(key, window, config)

    // 加载页面
    this.loadPage(window, config.route,config.params)

    // 存储窗口引用
    this.windows.set(key, window)

    return window
  }

  /**
   * 设置窗口事件
   */
  private setupWindowEvents(key: string, window: BrowserWindow, config: WindowConfig): void {
    // 窗口准备显示时
    window.once('ready-to-show', () => {
      // 确保窗口标题正确设置
      if (config.title) {
        window.setTitle(config.title)
      }

      if (config.show !== false) {
        window.show()
      }

    })

      // 发送参数给渲染进程
      if (config.params) {
        window.webContents.send('window-params', {
          route: config.route,
          params: config.params
        })
      }
    // 窗口关闭时
    window.on('closed', () => {
      // 从 Map 中移除窗口引用
      this.windows.delete(key)

      // 清理所有事件监听器
      window.removeAllListeners()
    })

    // 如果是模态窗口，设置父窗口关系
    if (config.modal && config.parent) {
      window.setParentWindow(config.parent)
    }
  }

  /**
   * 加载页面
   */
  private loadPage(window: BrowserWindow, route: string,params:any): void {
    const paramData = params ? "?urlParamData=" + JSON.stringify(params) : "";
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}${paramData}`)
    } else {
      window.loadFile(join(__dirname, '../renderer/index.html'), { hash: route+paramData })
    }
  }

  /**
   * 获取窗口
   * @param key 窗口唯一标识
   * @returns BrowserWindow 实例或 undefined
   */
  public getWindow(key: string): BrowserWindow | undefined {
    return this.windows.get(key)
  }

  /**
   * 关闭窗口
   * @param key 窗口唯一标识
   */
  public closeWindow(key: string): void {
    const window = this.windows.get(key)
    if (window && !window.isDestroyed()) {
      window.close()
    }
  }

  /**
   * 关闭所有窗口
   */
  public closeAllWindows(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close()
      }
    })
    this.windows.clear()
  }

  /**
   * 获取所有窗口
   */
  public getAllWindows(): Map<string, BrowserWindow> {
    return new Map(this.windows)
  }

  /**
   * 窗口是否存在
   * @param key 窗口唯一标识
   */
  public hasWindow(key: string): boolean {
    const window = this.windows.get(key)
    return window !== undefined && !window.isDestroyed()
  }
}

// 导出单例实例
export const windowManager = WindowManager.getInstance()
