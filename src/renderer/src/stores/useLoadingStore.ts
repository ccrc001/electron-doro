import { defineStore } from 'pinia'

// export const useLoadingStore = defineStore('loading', {
//   state: () => ({
//     loadingCount: 0,
//     routeLoading: false
//   }),
//   getters: {
//     isLoading: (state) => state.loadingCount > 0,
//     isRouteLoading: (state) => state.routeLoading
//   },
//   actions: {
//     show() {
//       this.loadingCount++
//     },
//     hide() {
//       if (this.loadingCount > 0) {
//         this.loadingCount--
//       }
//     },
//     showRouteLoading() {
//       this.routeLoading = true
//     },
//     hideRouteLoading() {
//       this.routeLoading = false
//     }
//   }
// })

export const useLoadingStore = defineStore('loading', () => {
  // State (使用 ref)
  const loadingCount = ref(0)
  const routeLoading = ref(false)

  // Getters (使用 computed)
  const isLoading = computed(() => loadingCount.value > 0)
  const isRouteLoading = computed(() => routeLoading.value)

  // Actions (普通函数)
  function show() {
    loadingCount.value++
  }

  function hide() {
    if (loadingCount.value > 0) {
      loadingCount.value--
    }
  }

  function showRouteLoading() {
    routeLoading.value = true
  }

  function hideRouteLoading() {
    routeLoading.value = false
  }

  // 返回所有需要暴露的状态、计算属性和方法
  return {
    loadingCount,
    routeLoading,
    isLoading,
    isRouteLoading,
    show,
    hide,
    showRouteLoading,
    hideRouteLoading
  }
})
