/**
 * Mock 工具函数
 * 确保 Mock.js 在开发和生产环境中都能正常工作
 */

import Mock from 'mockjs'

// 确保 Mock.js 在全局可用
// if (typeof window !== 'undefined') {
//   ;(window as any).Mock = Mock
// }

/**
 * 安全的 Mock 调用函数
 * 在生产环境中确保 Mock.js 可用
 */
export function safeMock(template: any): any {
  try {
    // 检查 Mock 是否可用
    if (typeof Mock === 'undefined') {
      console.warn('⚠️ Mock.js is not available, using fallback data')
      return getFallbackData({
        code: 200,
        msg: '成功',
        data: {
          id: 1,
          name: '夏明',
          age: 30,
          isActive: true,
          lastLogin: '2023-11-30 21:57:54',
          email: 'q.rwai@hsejqzh.mq',
          region: '西北'
        }
      })
    }

    // 使用 Mock.js 生成数据
    const result = Mock.mock(template)
    console.log('🎭 Mock.js generated data:', result)
    return result
  } catch (error) {
    console.error('❌ Mock.js error:', error)
    return getFallbackData(template)
  }
}

/**
 * 获取备用数据
 * 当 Mock.js 不可用时使用
 */
function getFallbackData(template: any): any {
  // 如果是简单的对象，尝试生成基本的备用数据
  if (template && typeof template === 'object') {
    if (template.code && template.msg && template.data) {
      // 用户列表的备用数据
      return {
        code: 200,
        msg: '成功',
        data: [
          {
            id: 1,
            name: '张三',
            age: 25,
            isActive: true,
            lastLogin: '2024-07-20 10:30:00',
            email: 'zhangsan@example.com',
            region: '北京市'
          },
          {
            id: 2,
            name: '李四',
            age: 30,
            isActive: false,
            lastLogin: '2024-07-19 15:20:00',
            email: 'lisi@example.com',
            region: '上海市'
          },
          {
            id: 3,
            name: '王五',
            age: 28,
            isActive: true,
            lastLogin: '2024-07-20 09:15:00',
            email: 'wangwu@example.com',
            region: '广州市'
          }
        ]
      }
    }
  }

  // 默认返回模板本身
  return template
}

/**
 * 检查 Mock.js 是否可用
 */
export function isMockAvailable(): boolean {
  return typeof Mock !== 'undefined' && typeof Mock.mock === 'function'
}

/**
 * 初始化 Mock.js
 * 在生产环境中确保正确初始化
 */
export function initializeMock(): void {
  if (typeof window !== 'undefined') {
    // 将 Mock 挂载到全局
    // ;(window as any).Mock = Mock

    // 设置 Mock.js 配置
    Mock.setup({
      timeout: '2000' // 设置响应时间为3秒
    })

    console.log('✅ Mock.js initialized successfully')
    console.log('📋 Mock.js version:', Mock.version || 'unknown')
  }
}

/**
 * 生成随机用户数据
 */
export function generateRandomUsers(count: number = 10): any[] {
  if (!isMockAvailable()) {
    return getFallbackData({}).data
  }

  return Mock.mock({
    [`data|${count}`]: [
      {
        'id|+1': 1,
        name: '@cname',
        'age|18-60': 1,
        'isActive|1': true,
        lastLogin: '@datetime',
        email: '@email',
        region: '@region'
      }
    ]
  }).data
}

export default {
  safeMock,
  isMockAvailable,
  initializeMock,
  generateRandomUsers
}
