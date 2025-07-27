<template>
  <div class="window-manager">
    <div class="manager-header">
      <h2 class="manager-title">
        <el-icon class="title-icon"><i-ep-monitor /></el-icon>
        窗口管理器演示
      </h2>
      <p class="manager-subtitle">体验强大的多窗口管理功能</p>
    </div>

    <!-- 快速创建窗口 -->
    <div class="demo-section">
      <div class="section-header">
        <el-icon><i-ep-plus /></el-icon>
        <h3>快速创建窗口</h3>
      </div>
      <div class="quick-actions">
        <el-button type="primary" size="large" @click="createArticleWindow">
          <el-icon><i-ep-user /></el-icon>
          文章窗口
        </el-button>
        <el-button type="success" size="large" @click="createSettingsWindow">
          <el-icon><i-ep-setting /></el-icon>
          设置窗口
        </el-button>
        <el-button type="warning" size="large" @click="createTransparentWindow">
          <el-icon><i-ep-view /></el-icon>
          透明窗口
        </el-button>
      </div>
    </div>

    <!-- 自定义窗口配置 -->
    <div class="demo-section">
      <div class="section-header">
        <el-icon><i-ep-setting /></el-icon>
        <h3>自定义窗口配置</h3>
      </div>
      <el-form :model="customConfig" label-width="120px" class="custom-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="窗口标识">
              <el-input v-model="customConfig.windowKey" placeholder="唯一标识" />
            </el-form-item>
            <el-form-item label="路由">
              <el-select v-model="customConfig.route" placeholder="选择路由">
                <el-option label="/user" value="/user" />
                <el-option label="/login" value="/login" />
                <el-option label="/mock-test" value="/mock-test" />
              </el-select>
            </el-form-item>
            <el-form-item label="窗口标题">
              <el-input v-model="customConfig.title" />
            </el-form-item>
            <el-form-item label="背景色">
              <el-color-picker v-model="customConfig.backgroundColor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宽度">
              <el-input-number v-model="customConfig.width" :min="300" :max="1920" />
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number v-model="customConfig.height" :min="200" :max="1080" />
            </el-form-item>
            <el-form-item label="最小宽度">
              <el-input-number v-model="customConfig.minWidth" :min="200" />
            </el-form-item>
            <el-form-item label="最小高度">
              <el-input-number v-model="customConfig.minHeight" :min="150" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="窗口选项">
              <el-checkbox v-model="customConfig.transparent">透明</el-checkbox>
              <el-checkbox v-model="customConfig.resizable">可调整大小</el-checkbox>
              <el-checkbox v-model="customConfig.alwaysOnTop">置顶</el-checkbox>
              <el-checkbox v-model="customConfig.frame">显示边框</el-checkbox>
              <el-checkbox v-model="customConfig.center">居中显示</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" size="large" @click="handleCreateCustomWindow">
              <el-icon><i-ep-plus /></el-icon>
              创建自定义窗口
            </el-button>
            <el-button type="default" size="large" @click="resetConfig">
              <el-icon><i-ep-refresh /></el-icon>
              重置配置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 窗口管理 -->
    <div class="demo-section">
      <div class="section-header">
        <el-icon><i-ep-operation /></el-icon>
        <h3>窗口管理</h3>
      </div>
      <div class="window-controls">
        <div class="control-group">
          <el-input v-model="windowKeyToManage" placeholder="输入窗口标识" class="window-input">
            <template #prepend>
              <el-icon><i-ep-key /></el-icon>
            </template>
          </el-input>
          <el-button type="info" size="large" @click="checkWindow">
            <el-icon><i-ep-search /></el-icon>
            检查窗口
          </el-button>
          <el-button type="danger" size="large" @click="closeWindow">
            <el-icon><i-ep-close /></el-icon>
            关闭窗口
          </el-button>
        </div>

        <div v-if="windowStatus" class="status-info">
          <el-tag :type="windowExists ? 'success' : 'danger'" size="large">
            <el-icon>
              <i-ep-check v-if="windowExists" />
              <i-ep-close v-else />
            </el-icon>
            {{ windowExists ? '窗口存在' : '窗口不存在' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  closeWindow as closeWindowUtil,
  createCustomWindow,
  hasWindow,
  type WindowConfig
} from '@utils/electronUtils'

// 定义组件名称
defineOptions({
  name: 'WindowManager'
})

// 自定义配置
const customConfig = reactive({
  windowKey: '',
  route: '/user',
  title: '自定义窗口',
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  backgroundColor: '#ffffff',
  transparent: false,
  resizable: true,
  alwaysOnTop: false,
  frame: true,
  center: true
})

// 窗口管理
const windowKeyToManage = ref('')
const windowStatus = ref(false)
const windowExists = ref(false)

// 创建文章窗口
const createArticleWindow = async () => {
  try {
    await createCustomWindow('user-window', {
      route: '/article',
      title: '文章列表',
      width: 900,
      height: 700,
      minWidth: 600,
      minHeight: 400,
      params: { from: 'window-manager' }
    })
    ElMessage.success('文章列表窗口已创建')
  } catch (error) {
    ElMessage.error('创建窗口失败')
  }
}

// 创建设置窗口
const createSettingsWindow = async () => {
  try {
    await createCustomWindow('login-window', {
      route: '/settings',
      title: '设置',
      width: 600,
      height: 500,
      opacity: 0.3,
      resizable: false,
      center: true,
      alwaysOnTop: true
    })
    ElMessage.success('设置窗口已创建')
  } catch (error) {
    ElMessage.error('创建窗口失败')
  }
}

// 创建透明窗口
const createTransparentWindow = async () => {
  try {
    await createCustomWindow('transparent-window', {
      route: '/mock-test',
      title: '透明窗口',
      width: 400,
      height: 300,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    })
    ElMessage.success('透明窗口已创建')
  } catch (error) {
    ElMessage.error('创建窗口失败')
  }
}

// 创建自定义窗口
const handleCreateCustomWindow = async () => {
  if (!customConfig.windowKey) {
    ElMessage.warning('请输入窗口标识')
    return
  }

  try {
    const config: WindowConfig = {
      route: customConfig.route,
      title: customConfig.title,
      width: customConfig.width,
      height: customConfig.height,
      minWidth: customConfig.minWidth,
      minHeight: customConfig.minHeight,
      backgroundColor: customConfig.backgroundColor,
      transparent: customConfig.transparent,
      resizable: customConfig.resizable,
      alwaysOnTop: customConfig.alwaysOnTop,
      frame: customConfig.frame,
      center: customConfig.center,
      params: { customConfig: true }
    }

    await createCustomWindow(customConfig.windowKey, config)
    ElMessage.success('自定义窗口已创建')
  } catch (error) {
    ElMessage.error('创建窗口失败')
  }
}

// 重置配置
const resetConfig = () => {
  Object.assign(customConfig, {
    windowKey: '',
    route: '/user',
    title: '自定义窗口',
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    backgroundColor: '#ffffff',
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    frame: true,
    center: true
  })
}

// 检查窗口
const checkWindow = async () => {
  if (!windowKeyToManage.value) {
    ElMessage.warning('请输入窗口标识')
    return
  }

  try {
    windowExists.value = await hasWindow(windowKeyToManage.value)
    windowStatus.value = true
  } catch (error) {
    ElMessage.error('检查窗口失败')
  }
}

// 关闭窗口
const closeWindow = async () => {
  if (!windowKeyToManage.value) {
    ElMessage.warning('请输入窗口标识')
    return
  }

  try {
    await closeWindowUtil(windowKeyToManage.value)
    ElMessage.success('窗口已关闭')
    windowStatus.value = false
  } catch (error) {
    ElMessage.error('关闭窗口失败')
  }
}
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;
$text-color: #303133;
$text-color-secondary: #606266;

.window-manager {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
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

.manager-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;

  .manager-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: $text-color;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    .title-icon {
      font-size: 1.8rem;
      color: $primary-color;
    }
  }

  .manager-subtitle {
    font-size: 1rem;
    color: $text-color-secondary;
    margin: 0;
    font-weight: 300;
  }
}

.demo-section {
  background: rgba(248, 249, 250, 0.8);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid rgba(220, 223, 230, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(248, 249, 250, 1);
    border-color: rgba(220, 223, 230, 0.5);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;

  .el-icon {
    font-size: 1.3rem;
    color: $primary-color;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: $text-color;
  }
}

// 快速操作按钮
.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

// 表单样式
.custom-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

// 窗口控制区域
.window-controls {
  .control-group {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
  }

  .window-input {
    min-width: 200px;
    flex: 1;
    max-width: 300px;
  }
}

.status-info {
  display: flex;
  justify-content: center;
  margin-top: 15px;

  .el-tag {
    padding: 8px 16px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .window-manager {
    padding: 20px 15px;
  }

  .manager-header {
    .manager-title {
      font-size: 1.5rem;
      flex-direction: column;
      gap: 8px;
    }
  }

  .quick-actions,
  .form-actions,
  .window-controls .control-group {
    flex-direction: column;
    align-items: stretch;
  }

  .window-controls .window-input {
    min-width: auto;
    max-width: none;
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
</style>
