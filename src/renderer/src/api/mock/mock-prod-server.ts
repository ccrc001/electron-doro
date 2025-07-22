import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 逐一导入您的mock文件
// 生产环境中这些文件将返回静态数据，不使用 Mock.js
import autoMocks from './modules/auto'

export function setupProdMockServer(): void {
  console.log('🎯 [Manual] Starting production mock server...')
  // 直接创建生产环境 Mock 服务
  // auto.ts 中的接口会根据环境返回静态数据
  createProdMockServer([...autoMocks])
}
