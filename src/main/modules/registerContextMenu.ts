import { app, Menu, dialog, BrowserWindow, Notification } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
export default function registerContextMenu(mainWindow: BrowserWindow): void {
  // 右键菜单
  mainWindow.webContents.on('context-menu', (_event, params) => {
    console.log(params)

    const menu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy', enabled: params.editFlags.canCopy },
      { label: '粘贴', role: 'paste', enabled: params.editFlags.canPaste },
      { label: '剪切', role: 'cut', enabled: params.editFlags.canCut },

      { label: '全选', role: 'selectAll' },
      { type: 'separator' },
      {
        label: '重新加载',
        click: () => {
          mainWindow.reload()
        },
        accelerator: process.platform === 'darwin' ? 'Alt+Command+R' : 'Ctrl+Shift+R'
      },
      // 打开控制台 开发环境显示
      is.dev ? { label: '打开控制台', role: 'toggleDevTools' } :   { type: 'separator' },
      // 自定义功能
      {
        label: '帮助',
        submenu: [
          {
            label: '关于Doro',
            click: async () => {
              let validated = false

              while (!validated) {
                const result = await dialog.showMessageBox({
                  type: 'info',
                  icon: icon,
                  title: '关于Doro',
                  message: `版本 ${app.getVersion()}`,
                  detail: '请先承认自己帅才能继续',
                  buttons: ['中肯Doro', '俺不中嘞'],
                  checkboxLabel: '我承认自己帅',
                  checkboxChecked: false
                })

                if (result.checkboxChecked) {
                  validated = true
                  new Notification({
                    title: '感谢认可',
                    body: `你选择了: ${['中肯Doro', '俺不中嘞'][result.response]}`,
                    icon: icon
                  }).show()
                } else {
                  await dialog.showMessageBox({
                    type: 'warning',
                    message: '必须勾选确认框才能继续',
                    buttons: ['好的']
                  })
                }
              }
            }
          }
        ]
      }
      // {
      //   label: '自定义操作',
      //   click: (_menuItem, _browserWindow, event) => {
      //     console.log('_menuItem:', _menuItem)

      //     console.log('_browserWindow:', _browserWindow)

      //     console.log('event:', event)
      //   }
      // }
    ])
    menu.popup({ window: mainWindow })
  })
}
