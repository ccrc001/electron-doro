interface Config {
  api: string
  PERMISSIONS: string
  auth: {
    token: string
    userInfo: Record<string, any>
  }
  languageMap: Map<string, string>
}

const config: Config = {
  // 获取配置
  api: import.meta.env.VITE_APP_BASE_API,
  // 权限信息
  PERMISSIONS: '*:*:*',
  auth: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },

  // 语言设置
  languageMap: new Map([
    ['zh-cn', '中文'],
    ['en', 'English']
  ])
}

export default config
