/// <reference types="vite/client" />
// 扩展 app 接口以添加 isQuitting 属性
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean
    }
  }
}
