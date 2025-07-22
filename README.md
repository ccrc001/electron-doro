<<<<<<< HEAD
# Doro

一个基于 Electron + Vue + TypeScript 的桌面应用程序。

## 开发环境设置

推荐使用 [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 项目设置

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 本地构建

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 发布流程

本项目使用 GitHub Actions 自动构建和发布。

### 创建新版本

1. 更新 `package.json` 中的版本号
2. 运行发布命令：

```bash
npm run create-release
```

这将自动：

- 提交必要的文件到 Git
- 创建版本标签
- 推送到 GitHub
- 触发 GitHub Actions 自动构建和发布

### 监控构建

访问 [GitHub Actions](https://github.com/ccrc001/diy-electron-doro/actions) 查看构建进度。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建应用
- `npm run create-release` - 创建新版本发布
- `npm run clean-repo` - 清理仓库（移除不必要的文件）
=======
# diy-electron-doro
doro爱吃欧润吉
>>>>>>> d04fd095f0a07f46d36cbd45a02d6b36a41151e8
