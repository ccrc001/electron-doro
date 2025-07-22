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
      <el-header>Header</el-header>
      <el-container style="flex: 1">
        <el-main>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <transition name="fade" mode="out-in">
                <Suspense>
                  <!-- 主要内容 -->
                  <template #default>
                    <component :is="Component" />
                  </template>
                  <!-- 加载状态 -->
                  <template #fallback>
                    <Loading :visible="true" />
                  </template>
                </Suspense>
              </transition>
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  position: relative;
  top: 0;
  width: 100vh;
  height: 100vw;
}
// .container {
//   width: 100vh;
//   height: 100vw;

//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   transition: all 0.28s;
//   &.hidderContainer {
//     width: 100%;
//   }
// }
</style>
