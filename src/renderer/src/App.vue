<!-- <template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive :include="['Home']">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <Loading :visible="true" />
            </template>
          </Suspense>
        </keep-alive>
      </transition>
    </router-view>

    <AppDock />
    <Loading :visible="loadingStore.isLoading || loadingStore.isRouteLoading" />
  </div>
</template>

<script setup lang="ts">
import AppDock from './components/AppDock.vue'
import { useLoadingStore } from '@stores/useLoadingStore'
import { onErrorCaptured } from 'vue'

const loadingStore = useLoadingStore()

// 捕获异步组件的错误
onErrorCaptured((error) => {
  console.error('Async component error:', error)
  return false // 阻止错误继续传播
})
</script>

<style scoped lang="scss">
/* // 不显示滚动条 */
::-webkit-scrollbar {
  display: none;
}
.app-container {
  height: calc(100vh);
  width: 100vw;
  box-sizing: border-box;
  overflow-y: auto;
  // padding-bottom: 100px; /* 为 dock 栏留出空间 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> -->

<template>
  <div class="app-container">
    <!-- 缓存指定组件 -->
    <!-- <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive :include="['Home']">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <Loading :visible="true" />
            </template>
          </Suspense>
        </keep-alive>
      </transition>
    </router-view> -->

    <router-view></router-view>

    <!-- <AppDock /> -->
    <Loading :visible="loadingStore.isLoading || loadingStore.isRouteLoading" />
  </div>
</template>

<script setup lang="ts">
// import AppDock from './components/AppDock.vue'
import { useLoadingStore } from '@stores/useLoadingStore'
import { onErrorCaptured, onMounted } from 'vue'
// import { addDynamicRoutes } from './router'

const loadingStore = useLoadingStore()

// 捕获异步组件的错误
onErrorCaptured((error) => {
  console.error('Async component error:', error)
  return false // 阻止错误继续传播
})
onMounted(async () => {
  console.log('app mounted')
  // await addDynamicRoutes()
})
</script>

<style scoped lang="scss">
/* // 不显示滚动条 */
::-webkit-scrollbar {
  display: none;
}
.app-container {
  height: 100vh;
  width: 100vw;
  // box-sizing: border-box;
  overflow-y: auto;
  // padding-bottom: 100px; /* 为 dock 栏留出空间 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
