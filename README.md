# Doro 爱吃欧润吉 🍊

<div align="center">

![Doro Logo](resources/icon.png)

**一个现代化的跨平台桌面应用程序**

基于 Electron + Vue 3 + TypeScript 构建的高性能桌面应用

[![Version](https://img.shields.io/badge/version-1.1.4-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-35.1.5-47848f.svg)](https://electronjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.13-4fc08d.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6.svg)](https://www.typescriptlang.org/)

</div>

## ✨ 特性

- 🚀 **现代化技术栈**: 基于 Electron + Vue 3 + TypeScript + Vite
- 🎨 **精美界面**: 使用 Element Plus 组件库，支持主题切换
- 🌍 **国际化支持**: 内置中英文切换，支持多语言扩展
- 📱 **响应式设计**: 适配不同屏幕尺寸，提供最佳用户体验
- 🔄 **自动更新**: 内置自动更新机制，保持应用最新版本
- 🎯 **动态路由**: 支持动态路由管理，灵活的页面导航
- 💾 **状态管理**: 使用 Pinia 进行状态管理，支持数据持久化
- 🔧 **开发友好**: 完整的开发工具链，支持热重载和调试
- 📦 **跨平台**: 支持 Windows、macOS、Linux 三大平台
- 🌐 **Mock 支持**: 内置 Mock 服务，便于前端独立开发

## 🛠️ 技术栈

### 核心框架

- **[Electron](https://electronjs.org/)** - 跨平台桌面应用框架
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript 的超集
- **[Vite](https://vitejs.dev/)** - 下一代前端构建工具

### UI 组件

- **[Element Plus](https://element-plus.org/)** - Vue 3 组件库
- **[Unplugin Icons](https://github.com/antfu/unplugin-icons)** - 图标自动导入
- **[Sass](https://sass-lang.com/)** - CSS 预处理器

### 状态管理

- **[Pinia](https://pinia.vuejs.org/)** - Vue 状态管理库
- **[Pinia Plugin Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate)** - 状态持久化

### 路由与国际化

- **[Vue Router](https://router.vuejs.org/)** - Vue 官方路由管理器
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Vue 国际化插件

### 开发工具

- **[Electron Vite](https://electron-vite.org/)** - Electron 开发构建工具
- **[ESLint](https://eslint.org/)** - 代码质量检查
- **[Prettier](https://prettier.io/)** - 代码格式化
- **[Vite Plugin Mock](https://github.com/vbenjs/vite-plugin-mock)** - Mock 数据服务

## 📁 项目结构

```
doro/
├── src/
│   ├── main/                 # 主进程代码
│   │   ├── index.ts         # 主进程入口
│   │   ├── modules/         # 功能模块
│   │   └── utils/           # 工具函数
│   ├── preload/             # 预加载脚本
│   └── renderer/            # 渲染进程代码
│       └── src/
│           ├── api/         # API 接口
│           ├── assets/      # 静态资源
│           ├── components/  # 公共组件
│           ├── config/      # 配置文件
│           ├── locales/     # 国际化文件
│           ├── router/      # 路由配置
│           ├── stores/      # 状态管理
│           ├── utils/       # 工具函数
│           └── view/        # 页面组件
├── resources/               # 应用资源
├── build/                   # 构建配置
├── env/                     # 环境变量
├── scripts/                 # 构建脚本
└── docs/                    # 文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: 最新版本

### 开发环境设置

推荐使用以下 VSCode 扩展：

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 代码质量检查
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 语言支持
- [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) - TypeScript 自动导入

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/ccrc001/electron-doro.git
cd electron-doro

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev
```

### 构建应用

```bash
# 构建所有平台
npm run build

# 构建 Windows 版本
npm run build:win

# 构建 macOS 版本
npm run build:mac

# 构建 Linux 版本
npm run build:linux

# 构建但不打包（用于调试）
npm run build:unpack
```

## 🔧 配置说明

### 环境变量

项目使用环境变量进行配置，配置文件位于 `env/` 目录：

- `env/.env.development` - 开发环境配置
- `env/.env.production` - 生产环境配置

主要配置项：

```bash
# 应用配置
VITE_APP_TITLE=Doro爱吃欧润吉
VITE_APP_PORT=3000
VITE_APP_OPEN=false

# API 配置
VITE_APP_BASE_API=/api
VITE_APP_PROXY_TARGET=https://jsonplaceholder.typicode.com

# Mock 配置
VITE_USE_MOCK=true

# 构建配置
VITE_APP_SOURCEMAP=true
VITE_APP_COMPRESS=false
```

### 应用配置

应用的主要配置位于 `src/renderer/src/config/index.ts`：

```typescript
const config = {
  api: import.meta.env.VITE_APP_BASE_API,
  PERMISSIONS: '*:*:*',
  auth: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  languageMap: new Map([
    ['zh-cn', '中文'],
    ['en', 'English']
  ])
}
```

## 📚 功能特性

### 🎯 动态路由系统

应用支持动态路由管理，可以在运行时动态添加、移除路由：

```typescript
// 添加动态路由
import { useDynamicRouter } from '@renderer/composables/useDynamicRouter'

const dynamicRouter = useDynamicRouter()

await dynamicRouter.addRoute({
  path: '/new-page',
  name: 'NewPage',
  component: () => import('./NewPage.vue'),
  meta: {
    title: 'New Page',
    icon: 'Star',
    label: 'router.newPage'
  }
})
```

### 🌍 国际化支持

内置中英文切换，支持多语言扩展：

```typescript
// 切换语言
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
locale.value = 'en' // 或 'zh-cn'
```

### 💾 状态管理

使用 Pinia 进行状态管理，支持数据持久化：

```typescript
// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({})

    const setUserInfo = (info: any) => {
      userInfo.value = info
    }

    return { userInfo, setUserInfo }
  },
  {
    persist: {
      pick: ['userInfo'] // 持久化指定字段
    }
  }
)
```

### 🔄 自动更新

内置自动更新机制，支持增量更新：

- 启动时自动检查更新
- 后台下载更新包
- 用户确认后安装更新
- 支持强制更新和可选更新

### 🌐 Mock 数据服务

开发环境支持 Mock 数据，便于前端独立开发：

```typescript
// Mock 配置示例
export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          token: 'mock-token',
          userInfo: { name: 'Admin' }
        }
      }
    }
  }
]
```

## 🎨 主题定制

### 主题切换

应用支持多主题切换，包括：

- 浅色主题（默认）
- 深色主题
- 自动跟随系统

### 自定义主题

可以通过修改 SCSS 变量来自定义主题：

```scss
// src/renderer/src/assets/variables.scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;
```

## 📱 应用功能

### 核心功能

- **用户认证**: 登录、注册、权限管理
- **文章管理**: 文章列表、搜索、筛选
- **设置中心**: 主题切换、语言切换、系统设置
- **调试工具**: 开发调试、Mock 测试、IPC 通信测试

### 系统功能

- **托盘支持**: 最小化到系统托盘
- **窗口管理**: 多窗口支持、窗口状态管理
- **快捷键**: 全局快捷键支持
- **通知系统**: 系统通知、应用内通知
- **文件操作**: 文件拖拽、文件选择
- **网络代理**: HTTP 代理支持

## 🔨 开发指南

### 添加新页面

1. 在 `src/renderer/src/view/` 下创建页面组件
2. 在路由配置中添加路由
3. 如需在 Dock 中显示，添加相应的 meta 信息

```typescript
// 路由配置示例
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('../view/new-page/index.vue'),
  meta: {
    title: 'New Page',
    icon: 'Star',
    label: 'router.newPage'
  }
}
```

### 添加新的 API

1. 在 `src/renderer/src/api/` 下创建 API 文件
2. 定义接口函数
3. 如需 Mock 数据，在 `src/renderer/src/api/mock/modules/` 下添加 Mock 配置

```typescript
// API 定义示例
export const getUserInfo = (id: string) => {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}
```

### 添加新的 Store

1. 在 `src/renderer/src/stores/` 下创建 Store 文件
2. 使用 Pinia 的 Composition API 风格
3. 配置持久化选项

```typescript
// Store 定义示例
export const useExampleStore = defineStore(
  'example',
  () => {
    const data = ref([])

    const fetchData = async () => {
      // 获取数据逻辑
    }

    return { data, fetchData }
  },
  {
    persist: {
      pick: ['data']
    }
  }
)
```

## 📦 构建与发布

### 本地构建

```bash
# 构建开发版本
npm run build

# 构建生产版本
npm run build --mode production

# 构建但不打包（用于调试）
npm run build:unpack
```

### 自动发布

本项目使用 GitHub Actions 进行自动构建和发布：

1. **更新版本号**：修改 `package.json` 中的 `version` 字段
2. **创建发布**：运行 `npm run create-release`
3. **自动构建**：GitHub Actions 会自动构建所有平台的安装包
4. **自动发布**：构建完成后自动创建 GitHub Release

### 发布流程

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 创建发布
npm run create-release

# 3. 监控构建进度
# 访问 GitHub Actions 页面查看构建状态
```

## 📋 可用脚本

| 命令                     | 描述                |
| ------------------------ | ------------------- |
| `npm run dev`            | 启动开发服务器      |
| `npm run build`          | 构建应用            |
| `npm run build:win`      | 构建 Windows 版本   |
| `npm run build:mac`      | 构建 macOS 版本     |
| `npm run build:linux`    | 构建 Linux 版本     |
| `npm run build:unpack`   | 构建但不打包        |
| `npm run start`          | 预览构建结果        |
| `npm run lint`           | 代码质量检查        |
| `npm run format`         | 代码格式化          |
| `npm run typecheck`      | TypeScript 类型检查 |
| `npm run create-release` | 创建新版本发布      |
| `npm run clean-repo`     | 清理仓库            |

## 🐛 常见问题

### 开发环境问题

**Q: 启动时报错 "Cannot find module"**
A: 请确保已正确安装依赖：`npm install`

**Q: 热重载不工作**
A: 检查防火墙设置，确保端口 3000 未被占用

**Q: TypeScript 类型错误**
A: 运行 `npm run typecheck` 检查类型错误

### 构建问题

**Q: 构建失败，提示权限错误**
A: 在 Windows 上可能需要以管理员身份运行

**Q: 构建的应用无法启动**
A: 检查 `electron-builder.yml` 配置，确保资源文件正确打包

### 运行时问题

**Q: 应用启动后白屏**
A: 检查控制台错误，可能是路由配置问题

**Q: Mock 数据不生效**
A: 检查环境变量 `VITE_USE_MOCK` 是否设置为 `true`

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交代码

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 Composition API 最佳实践
- 编写清晰的注释和文档
- 确保所有测试通过

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://electronjs.org/) - 跨平台桌面应用框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

## 📞 联系我们

- **GitHub**: [ccrc001](https://github.com/ccrc001)
- **项目地址**: [electron-doro](https://github.com/ccrc001/electron-doro)
- **问题反馈**: [Issues](https://github.com/ccrc001/electron-doro/issues)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ by [ccrc001](https://github.com/ccrc001)

</div>
