<template>
  <div class="container">
    <!-- 图标 -->
    <h3>SvgIcon 图标导入</h3>
    <SvgIcon name="fou-dazuo" :size="60" style="color: yellow" />
    <SvgIcon name="yujia" :size="60" style="color: pink" />
    <el-icon size="60" color="green">
      <i-ep-user />
    </el-icon>

    <!-- 导航 -->
    <h1 @click="handleLogin">Home ping</h1>
    <!-- <div class="nav-links">
      <router-link to="/login" class="nav-link">登录</router-link>
      <router-link to="/user" class="nav-link">用户管理</router-link>
    </div> -->

    <!-- 图片 -->
    <div class="img-box"></div>

    <!-- 进度条 -->
    <el-button type="warning" @click="handleProgress">{{
      showProcess ? '关闭process' : '显示process'
    }}</el-button>

    <!-- 新建窗口 -->
    <el-select v-model="windowPath" value-key="" placeholder="输入路由地址" clearable filterable>
      <el-option v-for="path in routerPaths" :key="path" :label="path" :value="path"> </el-option>
    </el-select>
    <el-button @click="openWindow">新建窗口</el-button>

    <h1>你好 全局样式</h1>

    <h3>pinia count:{{ appStore.count }}</h3>
    <el-button @click="appStore.increment">+</el-button>
    <el-button @click="appStore.decrement">-</el-button>
    浏览器输入唤醒应用<el-input
      disabled
      model-value="bcxlelectrondemo://joinRoom?roomCode=123"
    ></el-input>
    <el-button @click="getRoomCodeByUrl">获取url中传来的房间号 </el-button>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'Debug'
})

import { openNewWindow, getRoomCode } from '@utils/electronUtils'
import { useAppStore } from '@stores/useAppStore'
import { ElMessage } from 'element-plus'
const appStore = useAppStore()

const windowPath = ref('/')
const router = useRouter()
const routerPaths = ref<string[]>([])
// 取到所有的路径
routerPaths.value = router.getRoutes().map((item) => item.path)

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
    message: 'hello'
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
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  // width: 100vw;
  overflow-y: auto;
  padding: 10px 200px;
}
$img-url: '@assets/images/icon.png';
.img-box {
  width: 60px;
  height: 60px;
  // background: red;
  background-image: url($img-url);
  background-size: cover;
  background-position: center;
}

.nav-links {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #409eff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #ecf5ff;
}

h1 {
  color: $linkColor;
}
</style>
