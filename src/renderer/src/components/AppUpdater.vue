<template>
  <div class="app-updater">
    <!-- 更新状态显示 -->
    <el-dialog
      v-model="showUpdateDialog"
      title="应用更新"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="update-content">
        <div class="update-status">
          <el-icon class="update-icon" :class="updateIconClass">
            <component :is="updateIcon" />
          </el-icon>
          <p class="status-text">{{ updateStatus }}</p>
        </div>

        <!-- 下载进度 -->
        <div v-if="showProgress" class="progress-section">
          <el-progress
            :percentage="downloadProgress.percent"
            :status="progressStatus"
            :stroke-width="8"
          />
          <p class="progress-text">
            {{ formatBytes(downloadProgress.transferred) }} /
            {{ formatBytes(downloadProgress.total) }}
          </p>
        </div>

        <!-- 版本信息 -->
        <div v-if="currentVersion" class="version-info">
          <!-- 展示最新version -->
          <p>当前版本: {{ currentVersion.version }}</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="isDownloading" @click="closeDialog">
            {{ isDownloading ? '下载中...' : '关闭' }}
          </el-button>
          <el-button
            v-if="!isDownloading && !updateCompleted"
            type="primary"
            :loading="isChecking"
            @click="checkForUpdates"
          >
            {{ isChecking ? '检查中...' : '检查更新' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 更新按钮 -->
    <el-button type="primary" size="small" :loading="isChecking" @click="openUpdateDialog">
      <el-icon><Refresh /></el-icon>
      检查更新
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Download, Check, Warning } from '@element-plus/icons-vue'

// 响应式数据
const showUpdateDialog = ref(false)
const updateStatus = ref('准备检查更新...')
const isChecking = ref(false)
const isDownloading = ref(false)
const updateCompleted = ref(false)
const showProgress = ref(false)
const currentVersion = ref('')

const downloadProgress = ref({
  percent: 0,
  transferred: 0,
  total: 0
})

// 计算属性
const updateIcon = computed(() => {
  if (isDownloading.value) return Download
  if (updateCompleted.value) return Check
  if (updateStatus.value.includes('错误')) return Warning
  return Refresh
})

const updateIconClass = computed(() => {
  if (isDownloading.value) return 'downloading'
  if (updateCompleted.value) return 'completed'
  if (updateStatus.value.includes('错误')) return 'error'
  return 'checking'
})

const progressStatus = computed(() => {
  if (downloadProgress.value.percent === 100) return 'success'
  return undefined
})

// 方法
const openUpdateDialog = () => {
  showUpdateDialog.value = true
  getCurrentVersion()
}

const closeDialog = () => {
  if (!isDownloading.value) {
    showUpdateDialog.value = false
    resetState()
  }
}

const resetState = () => {
  updateStatus.value = '准备检查更新...'
  isChecking.value = false
  isDownloading.value = false
  updateCompleted.value = false
  showProgress.value = false
  downloadProgress.value = { percent: 0, transferred: 0, total: 0 }
}

const getCurrentVersion = async () => {
  try {
    currentVersion.value = await window.api.updater.getAppVersion()
    console.log(currentVersion.value)
    await checkForUpdates()
  } catch (error) {
    console.error('获取版本信息失败:', error)
  }
}

const checkForUpdates = async () => {
  isChecking.value = true
  updateStatus.value = '正在检查更新...'

  try {
    const result = await window.api.updater.checkForUpdates()
    if (result) {
      updateStatus.value = '检查更新完成'
    } else {
      updateStatus.value = '当前已是最新版本'
    }
  } catch (error) {
    updateStatus.value = '检查更新失败'
    ElMessage.error('检查更新失败')
    console.error('检查更新失败:', error)
  } finally {
    isChecking.value = false
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 监听更新状态
const handleUpdateStatus = (status: string) => {
  updateStatus.value = status

  if (status.includes('下载进度')) {
    isDownloading.value = true
    showProgress.value = true
  } else if (status.includes('下载完成')) {
    isDownloading.value = false
    updateCompleted.value = true
    ElMessage.success('更新下载完成！')
  } else if (status.includes('错误')) {
    isDownloading.value = false
    ElMessage.error('更新失败')
  }
}

const handleDownloadProgress = (progress: any) => {
  downloadProgress.value = {
    percent: Math.round(progress.percent),
    transferred: progress.transferred,
    total: progress.total
  }
}

// 生命周期
onMounted(() => {
  // 监听更新状态
  window.api.updater.onUpdateStatus(handleUpdateStatus)
  window.api.updater.onDownloadProgress(handleDownloadProgress)

  // 获取当前版本
  getCurrentVersion()
})

onUnmounted(() => {
  // 清理监听器
  window.api.updater.removeAllListeners()
})
</script>

<style scoped>
.app-updater {
  display: inline-block;
}

.update-content {
  text-align: center;
  padding: 20px 0;
}

.update-status {
  margin-bottom: 20px;
}

.update-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.update-icon.checking {
  color: #409eff;
}

.update-icon.downloading {
  color: #e6a23c;
  animation: spin 1s linear infinite;
}

.update-icon.completed {
  color: #67c23a;
}

.update-icon.error {
  color: #f56c6c;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  font-size: 16px;
  margin: 0;
  color: #606266;
}

.progress-section {
  margin: 20px 0;
}

.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.version-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.version-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.dialog-footer {
  text-align: right;
}
</style>
