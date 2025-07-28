<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { Approutes } from '@router/routes'
import AppRouter from '@router/index'
import { RouteRecordRaw } from 'vue-router'
const router = useRouter()
const route = useRoute()
// 获取当前所有路由
const routes: readonly RouteRecordRaw[] = AppRouter.options.routes

// dock 项配置
const dockItems = ref()

const rootRoute = routes.find((item) => item.path === '/root')
dockItems.value =
  rootRoute?.children?.map((item) => ({
    id: item.name,
    icon: item.meta?.icon,
    label: item.meta?.label,
    path: item.path
  })) || []

// 当前激活的项
const activeItem = computed(() => {
  return dockItems.value.find((item) => item.path === route.path)?.id || 'home'
})

// 处理点击事件
const handleClick = (path: string): void => {
  router.push(path)
}

// Dock 隐藏/显示状态
const isHidden = ref(false)

// 切换 Dock 显示状态
const toggleDock = (): void => {
  isHidden.value = !isHidden.value
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent): void => {
  // Ctrl + D 或 Cmd + D 切换 Dock
  if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
    event.preventDefault()
    toggleDock()
  }
  // ESC 键显示 Dock
  if (event.key === 'Escape' && isHidden.value) {
    toggleDock()
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="dock-container" :class="{ 'dock-hidden': isHidden }">
    <div class="dock" :style="{ '--dock-items-count': dockItems.length }">
      <div
        v-for="item in dockItems"
        :key="item.id"
        class="dock-item"
        :class="{ active: activeItem === item.id }"
        @click="handleClick(item.path)"
      >
        <el-icon size="24">
          <component :is="item.icon" />
        </el-icon>
        <span class="dock-label">{{ $t(item.label) }}</span>
      </div>
    </div>

    <!-- 隐藏/显示按钮 -->
    <div
      class="dock-toggle"
      :title="isHidden ? '点击展开 Dock (Ctrl+D)' : '点击隐藏 Dock (Ctrl+D)'"
      @click="toggleDock"
    >
      <el-icon size="16">
        <i-ep-arrow-up v-if="!isHidden" />
        <i-ep-arrow-down v-else />
      </el-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dock-container {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0;
  z-index: 1000;
  pointer-events: none; /* 让容器本身不阻挡点击 */
  transition: all 0.3s ease;

  &.dock-hidden {
    transform: translate(-50%, calc(100% - 10px)); /* 保留切换按钮可见 */

    .dock {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
  }
}

.dock {
  display: flex;
  gap: 20px;
  padding: 12px 24px;
  background: rgba(38, 38, 38, 0.9);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  pointer-events: auto; /* 恢复 dock 本身的点击事件 */
  transition: all 0.3s ease;

  /* 根据 dock 项目数量动态设置宽度 */
  /* 计算公式: 项目数量 * (图标+文字+padding) + 间距 + 容器padding */
  width: calc(var(--dock-items-count, 6) * 56px + (var(--dock-items-count, 6) - 1) * 20px + 48px);
  min-width: fit-content;
  max-width: 90vw; /* 防止在小屏幕上过宽 */

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  }
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
}

.dock-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  color: #fff;
}

.dock-item.active {
  background: rgba(64, 158, 255, 0.25);
  color: #409eff;
}

.dock-label {
  font-size: 12px;
  margin-top: 2px;
  transition: color 0.3s ease;
}

/* 动画效果 */
.dock-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-item:hover .el-icon {
  transform: scale(1.2);
  color: #fff;
}

.dock-item .el-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-item.active .el-icon {
  color: #409eff;
}

/* 添加发光效果 */
.dock-item.active {
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.2);
}

/* 优化文字可读性 */
.dock-label {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 切换按钮样式 */
.dock-toggle {
  position: absolute;
  top: -10px;
  width: 40px;
  height: 24px;
  background: rgba(38, 38, 38, 0.9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(64, 158, 255, 0.9);
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
  }

  .el-icon {
    color: rgba(255, 255, 255, 0.9);
    transition: color 0.3s ease;
  }

  &:hover .el-icon {
    color: white;
  }
}

/* 隐藏状态下的切换按钮增强 */
.dock-container.dock-hidden .dock-toggle {
  background: rgba(64, 158, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 6px 20px rgba(64, 158, 255, 0.4),
    0 0 0 4px rgba(64, 158, 255, 0.1);
  animation: pulse 2s infinite;

  .el-icon {
    color: white;
  }
}

/* 脉冲动画提示用户可以点击 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}
</style>
