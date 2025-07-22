/**
 * Mock 工具类
 * 用于管理 Mock 服务的启用/禁用状态
 */

// Mock 状态管理
class MockManager {
  private isEnabled: boolean = false
  private isProduction: boolean = false

  constructor() {
    this.isEnabled = import.meta.env.VITE_USE_MOCK === 'true'
    this.isProduction = import.meta.env.PROD
    
    // 在控制台输出 Mock 状态
    this.logMockStatus()
  }

  /**
   * 获取 Mock 启用状态
   */
  public getStatus(): boolean {
    return this.isEnabled
  }

  /**
   * 获取环境信息
   */
  public getEnvironment(): string {
    return this.isProduction ? 'production' : 'development'
  }

  /**
   * 检查是否为生产环境
   */
  public isProductionMode(): boolean {
    return this.isProduction
  }

  /**
   * 动态切换 Mock 状态（仅开发环境）
   */
  public toggleMock(enabled: boolean): void {
    if (this.isProduction) {
      console.warn('⚠️ Cannot toggle mock in production mode')
      return
    }
    
    this.isEnabled = enabled
    console.log(`🔄 Mock ${enabled ? 'enabled' : 'disabled'}`)
  }

  /**
   * 输出 Mock 状态日志
   */
  private logMockStatus(): void {
    const status = this.isEnabled ? '✅ Enabled' : '❌ Disabled'
    const env = this.getEnvironment()
    
    console.log(`
🎭 Mock Service Status:
   Status: ${status}
   Environment: ${env}
   Use Mock: ${import.meta.env.VITE_USE_MOCK}
    `)
  }

  /**
   * 获取 Mock 配置信息
   */
  public getConfig(): {
    enabled: boolean
    environment: string
    useMock: string
    baseURL: string
  } {
    return {
      enabled: this.isEnabled,
      environment: this.getEnvironment(),
      useMock: import.meta.env.VITE_USE_MOCK || 'false',
      baseURL: import.meta.env.VITE_APP_PROXY_TARGET || ''
    }
  }

  /**
   * 检查 Mock 服务是否正常工作
   */
  public async checkMockService(): Promise<boolean> {
    if (!this.isEnabled) {
      return false
    }

    try {
      // 尝试调用一个 Mock 接口来检查服务状态
      const response = await fetch('/api/user/userinfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      return data.code === 200
    } catch (error) {
      console.error('❌ Mock service check failed:', error)
      return false
    }
  }

  /**
   * 获取所有可用的 Mock 接口列表
   */
  public getMockEndpoints(): string[] {
    return [
      'GET /api/user/userinfo - 获取用户信息',
      'GET /api/user/userlist - 获取用户列表', 
      'POST /api/user/login - 用户登录'
    ]
  }
}

// 创建单例实例
export const mockManager = new MockManager()

// 导出便捷方法
export const isMockEnabled = (): boolean => mockManager.getStatus()
export const getMockConfig = () => mockManager.getConfig()
export const checkMockService = () => mockManager.checkMockService()
export const toggleMock = (enabled: boolean) => mockManager.toggleMock(enabled)

// 在开发环境下将 mockManager 挂载到 window 对象，方便调试
if (!import.meta.env.PROD) {
  ;(window as any).mockManager = mockManager
  console.log('🔧 mockManager is available on window.mockManager for debugging')
}

export default mockManager
