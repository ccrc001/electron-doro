<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Approutes } from '@router/routes'
const router = useRouter()
const route = useRoute()

// 获取当前所有路由
const routes = Approutes

// dock 项配置
const dockItems = ref()

dockItems.value = routes.map((item) => ({
  id: item.name,
  icon: item.meta?.icon,
  label: item.meta?.label,
  path: item.path
}))

// 当前激活的项
const activeItem = computed(() => {
  return dockItems.value.find((item) => item.path === route.path)?.id || 'home'
})

// 处理点击事件
const handleClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="dock-container">
    <div class="dock">
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
  </div>
</template>

<style scoped lang="scss">
.dock-container {
  position: fixed;
  bottom: 10px;
  left: 50%;
  right: 0;
  // 居中
  transform: translate(-50%, 0%);
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  // background: rgba(28, 28, 28, 0.7);
  // backdrop-filter: blur(10px);
  // border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.dock {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  background: rgba(38, 38, 38, 0.8);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
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
</style>
