<script setup lang="ts">
import { onErrorCaptured } from 'vue'
// 捕获异步组件的错误
onErrorCaptured((error) => {
  console.error('Async component error:', error)
  return false // 阻止错误继续传播
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header>Header</el-header> -->
      <el-container style="flex: 1">
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <div class="router-view-wrapper">
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
              </div>
            </transition>
          </router-view>
        </el-main>
      </el-container>
      <!-- <el-footer> -->
      <AppDock />
      <!-- </el-footer> -->
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  position: relative;
  top: 0;
  width: 100%;
  height: 100%;
}

.router-view-wrapper {
  width: 100%;
  height: 100%;
}

::v-deep .el-main,
.el-header,
.el-footer {
  padding: 0px;
}
::v-deep .el-footer {
  height: 0;
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
