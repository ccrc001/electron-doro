import { Menu, dialog, BrowserWindow, Notification } from 'electron'
// 定义应用图标路径
const icon = join(__dirname, '../../../resources/icon.png')
export default function registerContextMenu(mainWindow: BrowserWindow) {
  // 右键菜单
  mainWindow.webContents.on('context-menu', (_event, params) => {
    const menu = Menu.buildFromTemplate([
      { label: '复制', role: 'copy', enabled: params.editFlags.canCopy },
      { label: '粘贴', role: 'paste', enabled: params.editFlags.canPaste },
      { type: 'separator' },
      { label: '全选', role: 'selectAll' },
      // 自定义功能
      {
        label: 'Greet',
        click: () => {
          const answers = ['Yes', 'No', 'Maybe', 'xxxx']
          dialog
            .showMessageBox({
              title: 'Message box',
              message: 'please select an option',
              detail: 'Message detail',
              buttons: answers
            })
            .then((response) => {
              console.log(response)

              // 添加消息通知
              new Notification({
                title: 'Message box',
                body: 'please select an option',
                icon: icon
              }).show()
            })
        },
        accelerator: 'Shift+Alt+G'
      },
      {
        label: '自定义操作',
        click: (_menuItem, _browserWindow, event) => {
          console.log('点击位置:', event, event)
        }
      }
    ])
    menu.popup({ window: mainWindow })
  })
}
