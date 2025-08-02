// Mock 模块统一导出
import loginMocks from './login'
import autoMocks from './auto'
import postsMocks from './posts'

// 合并所有 mock 配置
export default [
  ...loginMocks,
  ...autoMocks,
  ...postsMocks
]
