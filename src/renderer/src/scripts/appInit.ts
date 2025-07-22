import { useRouter } from 'vue-router'
// 监听初始化 main引入
window.electron.ipcRenderer.on('launch-app', (_, roomCode) => {
  console.log('收到来自url的房间号：', roomCode)
})

// 监听子窗口路由跳转
window.electron.ipcRenderer.on('child-window-load', (_, route, paramJsonStr) => {
  console.log('收到来自子窗口的路由跳转：', route, paramJsonStr)
  const router = useRouter()
  router.push(route)
})
