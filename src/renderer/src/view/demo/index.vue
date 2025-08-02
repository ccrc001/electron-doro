<template>
  <div class="demo-container">
    <div class="demo-header">
      <h1 class="demo-title">
        <el-icon class="title-icon"><i-ep-monitor /></el-icon>
        Doro 功能演示
      </h1>
      <p class="demo-subtitle">探索 Electron + Vue 的强大功能</p>
    </div>

    <div class="demo-content">
      <!-- 图标展示区域 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-picture /></el-icon>
          <h3>SvgIcon 图标展示</h3>
        </div>
        <div class="icon-showcase">
          <div class="icon-item">
            <SvgIcon name="fou-dazuo" :size="60" style="color: #f39c12" />
            <span class="icon-label">打坐</span>
          </div>
          <div class="icon-item">
            <SvgIcon name="yujia" :size="60" style="color: #e91e63" />
            <span class="icon-label">瑜伽</span>
          </div>
          <div class="icon-item">
            <el-icon size="60" color="#27ae60">
              <i-ep-user />
            </el-icon>
            <span class="icon-label">用户</span>
          </div>
          <div class="icon-item">
            <div class="img-box"></div>
            <span class="icon-label">应用图标</span>
          </div>
        </div>
      </div>

      <!-- IPC 通信测试 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-connection /></el-icon>
          <h3>IPC 通信测试</h3>
        </div>
        <div class="ipc-controls">
          <el-button type="primary" size="large" @click="handleLogin">
            <el-icon><i-ep-message /></el-icon>
            发送 Ping 消息
          </el-button>
          <el-button
            :type="showProcess ? 'danger' : 'warning'"
            size="large"
            @click="handleProgress"
          >
            <el-icon><i-ep-loading /></el-icon>
            {{ showProcess ? '关闭进度条' : '显示进度条' }}
          </el-button>
        </div>
      </div>

      <!-- 窗口管理 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-monitor /></el-icon>
          <h3>窗口管理</h3>
        </div>
        <div class="window-controls">
          <div class="control-group">
            <label class="control-label">选择路由：</label>
            <el-select
              v-model="windowPath"
              placeholder="选择要打开的路由"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option v-for="path in routerPaths" :key="path" :label="path" :value="path" />
            </el-select>
            <el-button type="success" size="large" @click="openWindow">
              <el-icon><i-ep-plus /></el-icon>
              新建窗口
            </el-button>
            <el-button type="success" size="large" @click="testDynamicRoute">
              <el-icon><i-ep-video-play /></el-icon>
              测试动态路由跳转
            </el-button>
          </div>
        </div>
      </div>

      <!-- 状态管理 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-data-analysis /></el-icon>
          <h3>Pinia 状态管理</h3>
        </div>
        <div class="state-controls">
          <div class="counter-display">
            <span class="counter-label">当前计数：</span>
            <span class="counter-value">{{ appStore.count }}</span>
          </div>
          <div class="counter-buttons">
            <el-button type="primary" size="large" @click="appStore.increment">
              <el-icon><i-ep-plus /></el-icon>
              增加
            </el-button>
            <el-button type="danger" size="large" @click="appStore.decrement">
              <el-icon><i-ep-minus /></el-icon>
              减少
            </el-button>
          </div>
        </div>
      </div>

      <!-- 应用唤醒 -->
      <div class="demo-section">
        <div class="section-header">
          <el-icon><i-ep-link /></el-icon>
          <h3>浏览器唤醒应用</h3>
        </div>
        <div class="url-controls">
          <div class="url-display">
            <label class="control-label">唤醒链接：</label>
            <el-input
              readonly
              model-value="doroapp://joinRoom?roomCode=doro爱吃欧润吉"
              class="url-input"
            >
              <template #prepend>
                <el-icon><i-ep-link /></el-icon>
              </template>
            </el-input>
          </div>
          <el-button type="info" size="large" @click="getRoomCodeByUrl">
            <el-icon><i-ep-search /></el-icon>
            获取房间号
          </el-button>
        </div>
      </div>
    </div>

    <!-- 窗口管理器演示 -->
    <WindowManager />
  </div>
</template>

<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Debug'
})
import { ref, onMounted } from 'vue'

import { openNewWindow, getRoomCode } from '@utils/electronUtils'
import { useAppStore } from '@stores/useAppStore'
import { ElMessage } from 'element-plus'
import WindowManager from '@components/WindowManager.vue'
import { useRouter } from 'vue-router'
import AppRouter from '@router/index'
const appStore = useAppStore()

const windowPath = ref('/')
const router = useRouter()
const routerPaths = ref<string[]>([])
// 取到所有的路径
routerPaths.value = router.getRoutes().map((item) => item.path)
routerPaths.value.push('/abc')
// console.log(routerPaths.value)

const handleLogin = () => {
  window.electron.ipcRenderer.send('ping')
}
// 进度条
const showProcess = ref(false)
const handleProgress = () => {
  showProcess.value = !showProcess.value
  window.electron.ipcRenderer.invoke('show-process', showProcess.value)
}

const openWindow = () => {
  const param = {
    message: '自定义传递的参数'
  }
  // router.push(windowPath.value)
  openNewWindow(windowPath.value, param)
}

// 通过浏览器唤醒应用的url获取房间号
const getRoomCodeByUrl = () => {
  const roomCode = getRoomCode()
  if (roomCode) {
    ElMessage.success(roomCode)
  } else {
    ElMessage.warning('浏览器输入唤醒应用')
  }
}

// 测试动态路由跳转
const testDynamicRoute = () => {
  // 打印所有路由
  // console.log('当前所有路由:', AppRouter.getRoutes())
  // 尝试解析路由
  // const resolved = AppRouter.resolve('/douyin')
  // console.log('路由解析结果:', resolved)

  // 尝试跳转
  try {
    router.push(windowPath.value)
    ElMessage.success('跳转成功')
  } catch (error) {
    console.error('跳转失败:', error)
    ElMessage.error('跳转失败: ' + error)
  }
}
onMounted(() => {})
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;
$bg-color: #f5f7fa;
$border-color: #dcdfe6;
$text-color: #303133;
$text-color-secondary: #606266;
$img-url: '@assets/images/icon.png';

.demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow-y: auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  .demo-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    .title-icon {
      font-size: 2.5rem;
      color: $primary-color;
    }
  }

  .demo-subtitle {
    font-size: 1.2rem;
    color: $text-color-secondary;
    margin: 0;
    font-weight: 300;
  }
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;

  .el-icon {
    font-size: 1.5rem;
    color: $primary-color;
  }

  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: $text-color;
  }
}

// 图标展示区域
.icon-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  justify-items: center;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
    transform: scale(1.05);
  }

  .icon-label {
    font-size: 0.9rem;
    color: $text-color-secondary;
    font-weight: 500;
  }
}

.img-box {
  width: 60px;
  height: 60px;
  background-image: url($img-url);
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

// IPC 控制区域
.ipc-controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

// 窗口控制区域
.window-controls {
  .control-group {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .control-label {
    font-weight: 600;
    color: $text-color;
    white-space: nowrap;
  }
}

// 状态管理区域
.state-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .counter-display {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 25px;
    color: white;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

    .counter-label {
      font-weight: 500;
    }

    .counter-value {
      font-weight: 700;
      font-size: 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      padding: 5px 15px;
      border-radius: 15px;
      min-width: 40px;
      text-align: center;
    }
  }

  .counter-buttons {
    display: flex;
    gap: 15px;
  }
}

// URL 控制区域
.url-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .url-display {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;

    .control-label {
      font-weight: 600;
      color: $text-color;
      white-space: nowrap;
    }

    .url-input {
      flex: 1;
      min-width: 300px;
    }
  }

  .el-button {
    align-self: center;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-container {
    padding: 10px;
  }

  .demo-header {
    padding: 20px 15px;

    .demo-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 10px;
    }

    .demo-subtitle {
      font-size: 1rem;
    }
  }

  .demo-section {
    padding: 20px 15px;
  }

  .icon-showcase {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
  }

  .ipc-controls,
  .window-controls .control-group {
    flex-direction: column;
    align-items: stretch;
  }

  .url-controls .url-display {
    flex-direction: column;
    align-items: stretch;

    .url-input {
      min-width: auto;
    }
  }

  .state-controls .counter-buttons {
    flex-direction: column;
    width: 100%;
  }
}

// 全局按钮样式增强
:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.el-button--large {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

// 选择器样式增强
:deep(.el-select) {
  .el-input__wrapper {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// 输入框样式增强
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
