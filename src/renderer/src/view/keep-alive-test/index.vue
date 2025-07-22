<template>
  <div class="keep-alive-test">
    <h2>Keep-Alive 缓存测试</h2>

    <div class="test-info">
      <p><strong>组件名称:</strong> KeepAliveTest</p>
      <p>
        <strong>创建时间:</strong> <strong>{{ createdTime }}</strong>
      </p>
      <p>
        <strong>当前时间:</strong> <strong>{{ currentTime }}</strong>
      </p>
      <p>
        <strong>计数器:</strong> <strong>{{ counter }}</strong>
      </p>
    </div>

    <div class="controls">
      <el-button @click="increment">增加计数</el-button>
      <el-button @click="updateTime">更新时间</el-button>
      <el-button type="warning" @click="resetCounter">重置计数</el-button>
    </div>

    <div class="form-section">
      <h3>表单数据测试</h3>
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名:">
          <el-input v-model="form.username" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="form.email" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.note" type="textarea" :rows="3" placeholder="输入备注信息" />
        </el-form-item>
      </el-form>
    </div>

    <div class="lifecycle-logs">
      <h3>生命周期日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in lifecycleLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
        </div>
      </div>
    </div>

    <div class="instructions">
      <h3>测试说明</h3>
      <ul>
        <li>如果组件被缓存，切换路由后再回来，表单数据和计数器应该保持不变</li>
        <li>如果组件没有被缓存，切换路由后再回来，数据会重置</li>
        <li>观察生命周期日志，缓存的组件不会重复执行 onMounted</li>
        <li>当前组件名称: <code>KeepAliveTest</code></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名称，用于keep-alive缓存
defineOptions({
  name: 'KeepAliveTest'
})

import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

// 响应式数据
const counter = ref(0)
const currentTime = ref('')
const createdTime = ref('')
const lifecycleLogs = ref<Array<{ time: string; event: string }>>([])

// 表单数据
const form = ref({
  username: '',
  email: '',
  note: ''
})

// 添加生命周期日志
const addLog = (event: string) => {
  const time = new Date().toLocaleTimeString()
  lifecycleLogs.value.push({ time, event })
  console.log(`[KeepAliveTest] ${event} at ${time}`)
}

// 更新当前时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

// 增加计数
const increment = () => {
  counter.value++
}

// 重置计数器
const resetCounter = () => {
  counter.value = 0
}

// 生命周期钩子
onMounted(() => {
  createdTime.value = new Date().toLocaleTimeString()
  updateTime()
  addLog('onMounted - 组件挂载')

  // 定时更新时间
  const timer = setInterval(updateTime, 1000)

  onUnmounted(() => {
    clearInterval(timer)
    addLog('onUnmounted - 组件卸载')
  })
})

onActivated(() => {
  addLog('onActivated - 组件激活 (从缓存中恢复)')
})

onDeactivated(() => {
  addLog('onDeactivated - 组件失活 (进入缓存)')
})
</script>

<style scoped lang="scss">
.keep-alive-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;

  p {
    margin: 5px 0;

    strong {
      color: #409eff;
    }
  }
}

.controls {
  margin-bottom: 30px;

  .el-button {
    margin-right: 10px;
  }
}

.form-section {
  background: #fff;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 30px;
}

.lifecycle-logs {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;

  h3 {
    color: #e2e8f0;
    margin-top: 0;
  }
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
  font-size: 12px;

  .log-time {
    color: #68d391;
    margin-right: 10px;
    min-width: 80px;
  }

  .log-event {
    color: #e2e8f0;
  }
}

.instructions {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 15px;
  border-radius: 8px;

  h3 {
    color: #856404;
    margin-top: 0;
  }

  ul {
    color: #856404;
    margin: 10px 0;
  }

  code {
    background: #f8f9fa;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
}

h2 {
  color: #2d3748;
  margin-bottom: 20px;
}

h3 {
  color: #4a5568;
  margin-bottom: 15px;
}
</style>
