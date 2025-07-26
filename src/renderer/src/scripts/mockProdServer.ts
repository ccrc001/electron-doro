// Mock 服务初始化 - 根据环境变量决定是否启用
console.log('🔍 [Debug] Environment check:', {
  VITE_USE_MOCK: import.meta.env.VITE_USE_MOCK,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  BASE_API: import.meta.env.VITE_APP_BASE_API
})

if (import.meta.env.VITE_USE_MOCK === 'true') {
  if (import.meta.env.PROD) {
    // 生产环境 Mock (手动方式，更可靠)
    console.log('🎯 [Manual] Starting production mock server...')
    import('../api/mock/mock-prod-server')
      .then(({ setupProdMockServer }) => {
        setupProdMockServer()
        console.log('🚀 [Manual] Production Mock Server started successfully')
      })
      .catch((error) => {
        console.error('❌ [Manual] Failed to start production mock server:', error)
      })
  } else {
    // 开发环境 Mock 由 viteMockServe 自动处理
    console.log('🔧 [Auto] Development Mock Server handled by viteMockServe')
  }
} else {
  console.log(
    '⚠️ [Warning] Mock service is disabled. VITE_USE_MOCK =',
    import.meta.env.VITE_USE_MOCK
  )
}
