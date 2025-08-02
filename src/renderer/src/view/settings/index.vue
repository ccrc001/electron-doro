<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Settings'
})

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@stores/useAppStore'
import { cacheUtils } from '@utils/cacheUtils'
import themeUtils, { themeModeMap } from '@utils/themeUtils'
import AppUpdater from '@components/AppUpdater.vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@stores/useMenuStore'
const menuStore = useMenuStore()
// Vue Composition API 钩子必须在顶层调用
const { locale } = useI18n()
const appStore = useAppStore()

const router = useRouter()
// console.log(appStore)

const settings = ref({
  theme: appStore.theme,
  notifications: true,
  autoUpdate: true,
  language: appStore.lang
})

const languageOptions = [
  { label: '简体中文', value: 'zh-cn' },
  { label: 'English', value: 'en' }
]

const handleNotification = (value): void => {
  console.log(value)
  // 警告
  ElMessage.warning('暂未开发')
}

const handleAutoUpdate = (value): void => {
  console.log(value)
  ElMessage.warning('暂未开发')
}

const confirmEvent = (): void => {
  window.electron.ipcRenderer.invoke('clear-storage-data')
  ElMessage.warning('暂未开发')
}

const handleLogin = (): void => {
  menuStore.menuList = []
  menuStore.setRoutesAdded(false)
  // 刷新页面

  router.push('/')
}

const handleSave = (): void => {
  // 这里可以添加保存设置的逻辑
  // console.log(settings.value)
  locale.value = settings.value.language
  // 设置缓存的值
  cacheUtils.set('lang', settings.value.language)
  // 通知多窗口更新
  window.electron.ipcRenderer.invoke('lang:change', settings.value.language)
  // 更新主题
  themeUtils.themeChange(settings.value.theme)

  ElMessage.success('已保存')
}
</script>

<template>
  <div class="settings-container">
    <h2>系统设置</h2>

    <el-form label-width="120px" class="settings-form">
      <el-form-item label="主题模式">
        <el-radio-group v-model="settings.theme">
          <el-radio-button
            v-for="option in themeModeMap.entries()"
            :key="option[0]"
            :label="option[0]"
            :value="option[0]"
          >
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="系统语言">
        <el-select v-model="settings.language" class="language-select">
          <el-option
            v-for="option in languageOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="通知提醒">
        <el-switch v-model="settings.notifications" @change="handleNotification" />
      </el-form-item>

      <el-form-item label="自动更新">
        <el-switch v-model="settings.autoUpdate" @change="handleAutoUpdate" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </el-form-item>

      <el-form-item label="应用更新">
        <AppUpdater />
      </el-form-item>

      <el-form-item label="清除缓存">
        <el-popconfirm
          class="box-item"
          title="该操作不可逆，是否继续？"
          placement="right"
          @confirm="confirmEvent"
        >
          <template #reference>
            <el-button type="primary" size="small"> 清理 </el-button>
          </template>
        </el-popconfirm>
      </el-form-item>

      <el-form-item label="退出登录">
        <el-button type="primary" size="small" @click="handleLogin"> 退出 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
}

.settings-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.language-select {
  width: 200px;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}
</style>
