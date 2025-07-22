// import { app, BrowserWindow, Menu } from 'electron'
// // 创建 Dock 菜单
// export function createDockMenu(createWindow: () => void) {
//     // 针对 macOS 的 Dock 菜单
//     if (process.platform === 'darwin') {
//       const dockMenu = Menu.buildFromTemplate([
//         {
//           label: '新建窗口',
//           click() {
//             createWindow()
//           }
//         },
//         { type: 'separator' },
//         {
//           label: '用户管理',
//           click() {
//             const win = BrowserWindow.getFocusedWindow()
//             if (win) {
//               win.webContents.send('navigate', '/user')
//             }
//           }
//         },
//         {
//           label: '系统设置',
//           click() {
//             const win = BrowserWindow.getFocusedWindow()
//             if (win) {
//               win.webContents.send('navigate', '/settings')
//             }
//           }
//         }
//       ])
//       app.dock?.setMenu(dockMenu)
//     }
  
//     // 针对 Windows 的任务栏菜单
//     if (process.platform === 'win32') {
//       const windowsMenu = Menu.buildFromTemplate([
//         {
//           label: '新建窗口',
//           click() {
//             createWindow()
//           }
//         },
//         { type: 'separator' },
//         {
//           label: '用户管理',
//           click() {
//             const win = BrowserWindow.getFocusedWindow()
//             if (win) {
//               win.webContents.send('navigate', '/user')
//             }
//           }
//         },
//         {
//           label: '系统设置',
//           click() {
//             const win = BrowserWindow.getFocusedWindow()
//             if (win) {
//               win.webContents.send('navigate', '/settings')
//             }
//           }
//         }
//       ])
//       app.setUserTasks(windowsMenu.items.map(item => ({
//         program: process.execPath,
//         arguments: '',
//         iconPath: process.execPath,
//         iconIndex: 0,
//         title: item.label || '',
//         description: item.label || ''
//       })))
//     }
//   }