<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const countdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

// 返回首页
const goHome = (): void => {
  router.push('/')
}

// 返回上一页
const goBack = (): void => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

// 自动倒计时跳转
const startCountdown = (): void => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      goHome()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = (): void => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startCountdown()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="not-found-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div v-for="i in 6" :key="i" class="floating-icon">
        <el-icon :size="20 + Math.random() * 30">
          <component :is="['House', 'Document', 'Setting', 'Star', 'Bell', 'Search'][i - 1]" />
        </el-icon>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content-wrapper">
      <!-- 404 数字 -->
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit middle">0</span>
        <span class="digit">4</span>
      </div>

      <!-- 错误信息 -->
      <div class="error-info">
        <h1 class="error-title">
          <el-icon class="title-icon"><i-ep-warning /></el-icon>
          页面走丢了
        </h1>
        <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
        <p class="error-suggestion">请检查网址是否正确，或者返回首页继续浏览</p>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          @click="goHome"
          @mouseenter="stopCountdown"
          @mouseleave="startCountdown"
        >
          <el-icon><i-ep-house /></el-icon>
          返回首页
        </el-button>
        <el-button
          size="large"
          @click="goBack"
          @mouseenter="stopCountdown"
          @mouseleave="startCountdown"
        >
          <el-icon><i-ep-back /></el-icon>
          返回上页
        </el-button>
      </div>

      <!-- 自动跳转提示 -->
      <div v-if="countdown > 0" class="auto-redirect">
        <el-icon class="countdown-icon"><i-ep-timer /></el-icon>
        <span>{{ countdown }} 秒后自动返回首页</span>
        <el-button type="text" size="small" class="cancel-redirect" @click="stopCountdown">
          取消
        </el-button>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="footer-decoration">
      <div class="wave"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--background-color, #fff) 0%,
    rgba(254, 88, 127, 0.05) 100%
  );
  overflow: hidden;
}

// 背景装饰
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .floating-icon {
    position: absolute;
    color: var(--el-color-primary, #fe587f);
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;

    &:nth-child(1) {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    &:nth-child(2) {
      top: 20%;
      right: 15%;
      animation-delay: 1s;
    }
    &:nth-child(3) {
      top: 60%;
      left: 5%;
      animation-delay: 2s;
    }
    &:nth-child(4) {
      bottom: 20%;
      right: 10%;
      animation-delay: 3s;
    }
    &:nth-child(5) {
      top: 40%;
      left: 80%;
      animation-delay: 4s;
    }
    &:nth-child(6) {
      bottom: 40%;
      left: 20%;
      animation-delay: 5s;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 主要内容
.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

// 404 数字
.error-code {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  .digit {
    font-size: 8rem;
    font-weight: 900;
    background: linear-gradient(135deg, var(--el-color-primary, #fe587f), #4e6ef2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: bounce 2s ease-in-out infinite;

    &.middle {
      animation-delay: 0.2s;
      transform: scale(1.1);
    }

    &:last-child {
      animation-delay: 0.4s;
    }
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

// 错误信息
.error-info {
  margin-bottom: 3rem;

  .error-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--el-text-color, #232332);
    margin-bottom: 1rem;

    .title-icon {
      color: var(--el-color-warning, #e6a23c);
    }
  }

  .error-description {
    font-size: 1.2rem;
    color: var(--el-text-color, #232332);
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .error-suggestion {
    font-size: 1rem;
    color: var(--el-text-color, #232332);
    opacity: 0.6;
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  .el-button {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}

// 自动跳转提示
.auto-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(var(--el-color-primary-rgb, 254, 88, 127), 0.1);
  border: 1px solid rgba(var(--el-color-primary-rgb, 254, 88, 127), 0.2);
  border-radius: 8px;
  color: var(--el-color-primary, #fe587f);
  font-size: 0.9rem;

  .countdown-icon {
    animation: spin 2s linear infinite;
  }

  .cancel-redirect {
    margin-left: 0.5rem;
    color: var(--el-color-primary, #fe587f);

    &:hover {
      background: rgba(var(--el-color-primary-rgb, 254, 88, 127), 0.1);
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 底部装饰
.footer-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1;

  .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(var(--el-color-primary-rgb, 254, 88, 127), 0.1),
      rgba(78, 110, 242, 0.1)
    );
    clip-path: polygon(0 50%, 100% 80%, 100% 100%, 0% 100%);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .error-code .digit {
    font-size: 5rem;
  }

  .error-info .error-title {
    font-size: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;

    .el-button {
      width: 200px;
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .not-found-container {
    background: linear-gradient(
      135deg,
      var(--background-color, #363b40) 0%,
      rgba(78, 110, 242, 0.05) 100%
    );
  }
}
</style>
