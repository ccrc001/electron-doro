<template>
  <div class="mock-test-container">
    <div class="test-header">
      <h2>Mock 接口测试</h2>
      <p>测试 viteMockServe 是否正常工作</p>
    </div>

    <div class="test-section">
      <h3>API 测试</h3>
      <div class="test-buttons">
        <el-button type="primary" @click="testGetUserInfo" :loading="loading.userInfo">
          测试 getUserInfo
        </el-button>
        <el-button type="success" @click="testGetUserList" :loading="loading.userList">
          测试 getUserList
        </el-button>
        <el-button type="warning" @click="testGetUserLogin" :loading="loading.userLogin">
          测试 getUserLogin
        </el-button>
        <el-button type="info" @click="testAllApis" :loading="loading.all">
          测试所有接口
        </el-button>
      </div>
    </div>

    <div class="results-section">
      <h3>测试结果</h3>
      <div class="result-tabs">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="getUserInfo" name="userInfo">
            <div class="result-content">
              <pre>{{ JSON.stringify(results.userInfo, null, 2) }}</pre>
            </div>
          </el-tab-pane>
          <el-tab-pane label="getUserList" name="userList">
            <div class="result-content">
              <pre>{{ JSON.stringify(results.userList, null, 2) }}</pre>
            </div>
          </el-tab-pane>
          <el-tab-pane label="getUserLogin" name="userLogin">
            <div class="result-content">
              <pre>{{ JSON.stringify(results.userLogin, null, 2) }}</pre>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div class="status-section">
      <h3>Mock 状态</h3>
      <div class="status-info">
        <el-tag :type="mockStatus.type" size="large">
          {{ mockStatus.text }}
        </el-tag>
        <p class="status-desc">{{ mockStatus.desc }}</p>
      </div>

      <div class="config-info">
        <h4>配置信息</h4>
        <div class="config-grid">
          <div class="config-item">
            <span class="label">环境:</span>
            <el-tag :type="mockConfig.environment === 'production' ? 'danger' : 'success'">
              {{ mockConfig.environment }}
            </el-tag>
          </div>
          <div class="config-item">
            <span class="label">Mock启用:</span>
            <el-tag :type="mockConfig.enabled ? 'success' : 'danger'">
              {{ mockConfig.enabled ? '是' : '否' }}
            </el-tag>
          </div>
          <div class="config-item">
            <span class="label">代理目标:</span>
            <span class="value">{{ mockConfig.baseURL }}</span>
          </div>
          <div class="config-item">
            <span class="label">环境变量:</span>
            <span class="value">{{ mockConfig.useMock }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserInfo, getUserList, getUserLogin } from '@api/login'
import { mockManager, getMockConfig, checkMockService } from '@utils/mockUtils'

// 定义组件名称
defineOptions({
  name: 'MockTest'
})

// 响应式数据
const activeTab = ref('userInfo')
const loading = reactive({
  userInfo: false,
  userList: false,
  userLogin: false,
  all: false
})

const results = reactive({
  userInfo: null as any,
  userList: null as any,
  userLogin: null as any
})

const mockStatus = reactive({
  type: 'info' as 'success' | 'warning' | 'danger' | 'info',
  text: '检测中...',
  desc: '正在检测 Mock 服务状态'
})

const mockConfig = reactive(getMockConfig())

// 测试 getUserInfo 接口
const testGetUserInfo = async () => {
  loading.userInfo = true

  // 添加更明显的调试信息
  console.clear() // 清空控制台
  console.log('🚀 =================================')
  console.log('🧪 [MOCK TEST] Testing getUserInfo...')
  console.log('🌍 Environment:', import.meta.env.PROD ? 'Production' : 'Development')
  console.log('🔍 Mock enabled:', import.meta.env.VITE_USE_MOCK)
  console.log('🚀 =================================')

  try {
    const response = await getUserInfo()
    console.log('✅ [SUCCESS] getUserInfo response:', response)
    console.log('📊 Response data:', JSON.stringify(response, null, 2))

    results.userInfo = response.data
    ElMessage.success('getUserInfo 测试成功')
    updateMockStatus('success')
  } catch (error: any) {
    console.error('❌ [ERROR] getUserInfo 测试失败:', error)
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    results.userInfo = { error: error.message || 'Unknown error' }
    ElMessage.error('getUserInfo 测试失败')
    updateMockStatus('danger')
  } finally {
    loading.userInfo = false
    console.log('🏁 [FINISHED] getUserInfo test completed')
  }
}

// 测试 getUserList 接口
const testGetUserList = async () => {
  loading.userList = true

  // 添加更明显的调试信息
  console.clear() // 清空控制台
  console.log('🚀 =================================')
  console.log('🧪 [MOCK TEST] Testing getUserList...')
  console.log('🌍 Environment:', import.meta.env.PROD ? 'Production' : 'Development')
  console.log('🔍 Mock enabled:', import.meta.env.VITE_USE_MOCK)
  console.log('🚀 =================================')

  try {
    const response = await getUserList()
    console.log('✅ [SUCCESS] getUserList response:', response)
    console.log('📊 Response data:', JSON.stringify(response, null, 2))
    console.log('📋 Data type:', typeof response)
    console.log('📋 Data.data type:', typeof response.data)

    results.userList = response.data
    ElMessage.success('getUserList 测试成功')
    updateMockStatus('success')
  } catch (error: any) {
    console.error('❌ [ERROR] getUserList 测试失败:', error)
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    results.userList = { error: error.message || 'Unknown error' }
    ElMessage.error('getUserList 测试失败')
    updateMockStatus('danger')
  } finally {
    loading.userList = false
    console.log('🏁 [FINISHED] getUserList test completed')
  }
}

// 测试 getUserLogin 接口
const testGetUserLogin = async () => {
  loading.userLogin = true
  try {
    const loginData = {
      username: 'admin',
      password: '123456'
    }
    const response = await getUserLogin(loginData)
    console.log('✅ [SUCCESS] getUserList response:', response)
    console.log('📊 Response data:', JSON.stringify(response, null, 2))
    console.log('📋 Data type:', typeof response)
    console.log('📋 Data.data type:', typeof response.data)
    results.userLogin = response.data
    ElMessage.success('getUserLogin 测试成功')
    updateMockStatus('success')
  } catch (error: any) {
    console.error('getUserLogin 测试失败:', error)
    results.userLogin = { error: error.message || 'Unknown error' }
    ElMessage.error('getUserLogin 测试失败')
    updateMockStatus('danger')
  } finally {
    loading.userLogin = false
  }
}

// 测试所有接口
const testAllApis = async () => {
  loading.all = true
  try {
    await Promise.all([testGetUserInfo(), testGetUserList(), testGetUserLogin()])
    ElMessage.success('所有接口测试完成')
  } catch (error) {
    ElMessage.error('部分接口测试失败')
  } finally {
    loading.all = false
  }
}

// 更新 Mock 状态
const updateMockStatus = (type: 'success' | 'warning' | 'danger' | 'info') => {
  mockStatus.type = type
  switch (type) {
    case 'success':
      mockStatus.text = 'Mock 正常'
      mockStatus.desc = 'viteMockServe 正在正常工作'
      break
    case 'danger':
      mockStatus.text = 'Mock 异常'
      mockStatus.desc = 'Mock 服务可能未启动或配置错误'
      break
    case 'warning':
      mockStatus.text = 'Mock 警告'
      mockStatus.desc = '部分 Mock 接口可能有问题'
      break
    default:
      mockStatus.text = '检测中...'
      mockStatus.desc = '正在检测 Mock 服务状态'
  }
}

// 组件挂载时自动测试
// onMounted(() => {
//   // 页面加载时输出调试信息
//   console.clear()
//   console.log('🎯 =================================')
//   console.log('📱 [MOCK TEST PAGE] Mounted')
//   console.log('🌍 Environment:', import.meta.env.PROD ? 'Production' : 'Development')
//   console.log('🔍 Mock enabled:', import.meta.env.VITE_USE_MOCK)
//   console.log('🌐 Base API:', import.meta.env.VITE_APP_BASE_API)
//   console.log('🎯 =================================')

//   // 延迟一秒后自动测试第一个接口
//   setTimeout(() => {
//     console.log('🚀 Auto-testing getUserInfo in 1 second...')
//     testGetUserInfo()
//   }, 1000)
// })
</script>

<style scoped lang="scss">
.mock-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;

  h2 {
    color: #2d3748;
    margin-bottom: 10px;
  }

  p {
    color: #718096;
    margin: 0;
  }
}

.test-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    color: #2d3748;
    margin-bottom: 15px;
  }
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  .el-button {
    min-width: 120px;
  }
}

.results-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    color: #2d3748;
    margin-bottom: 15px;
  }
}

.result-content {
  background: #f7fafc;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;

  pre {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #2d3748;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.status-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    color: #2d3748;
    margin-bottom: 15px;
  }
}

.status-info {
  text-align: center;
  margin-bottom: 20px;

  .el-tag {
    margin-bottom: 10px;
  }

  .status-desc {
    color: #718096;
    margin: 0;
  }
}

.config-info {
  h4 {
    color: #2d3748;
    margin-bottom: 15px;
  }
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.config-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f7fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;

  .label {
    font-weight: 500;
    color: #4a5568;
    margin-right: 10px;
    min-width: 80px;
  }

  .value {
    color: #2d3748;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: #edf2f7;
    padding: 2px 6px;
    border-radius: 3px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .test-buttons {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>
