import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 逐一导入您的mock文件
// 生产环境中这些文件将返回静态数据，不使用 Mock.js
// import autoMocks from './modules/auto'
// import loginMocks from './modules/login'
// import postsMocks from './modules/posts'
import mock from './modules/index'
export function setupProdMockServer(): void {
  console.log('🎯 [Manual] Starting production mock server...')

  // 合并所有 mock 配置
  const allMocks = [...mock]

  // 直接创建生产环境 Mock 服务
  createProdMockServer(allMocks)
  console.log('🚀 Production Mock Server started successfully')
}
