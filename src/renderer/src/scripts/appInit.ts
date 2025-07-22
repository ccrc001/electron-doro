// 监听初始化 main引入
window.electron.ipcRenderer.on('launch-app', (_, roomCode) => {
  console.log('收到来自url的房间号：', roomCode)
})
