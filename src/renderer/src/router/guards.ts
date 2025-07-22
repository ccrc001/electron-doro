import { useUserStore } from '@stores/useUserStore'
import { useMenuStore } from '@stores/useMenuStore'

import { useLoadingStore } from '@stores/useLoadingStore'
// import { useRoute } from 'vue-router'

// const router = useRoute()
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 显示右上角螺旋加载提示
NProgress.configure({
  minimum: 0.08, // 最小进度(默认0.08)
  showSpinner: false, // 是否显示螺旋加载提示
  parent: '#app' // 设置父元素(默认body)
})
// import CONFIG from '@config/index'
// 全局前置导航守卫
export const beforeEach = (_to, _from, next): void => {
  NProgress.start() // 开始进度条
  // 在这里可以添加路由守卫逻辑
  // 比如检查用户是否登录，或者权限验证等
  //   判断是否需要登录
  const loadingStore = useLoadingStore()
  loadingStore.showRouteLoading()
  next()

  //   if (to.path === '/') {
  //     // 如果登录页则不需要登录
  //     next() // 继续导航

  //     return
  //   }

  //   if (!localStorage.getItem('TOKEN')) {
  //     // 如果需要认证但没有认证令牌，则重定向到登录页面

  //     next({ path: '/' })
  //     return
  //   }
  //   try {
  //     const store = useUserStore()
  //     const menuStore = useMenuStore()
  //     // 如果有认证令牌，则继续
  //     // 这里添加更复杂的逻辑，比如检查令牌是否有效等

  //     const permissions = store.getPermissions()
  //     // 最高权限放行
  //     if (permissions === CONFIG.PERMISSIONS) {
  //       next() // 继续导航
  //       return
  //     }

  //     // console.log(to.path)

  //     if (!(to.path in (menuStore.menuMap ?? {}))) {
  //       next({ path: '/' })
  //       return
  //     }

  //     // 如果没有权限，不能进入
  //     // if (!menuStore.menuMap.has(to.path)) {
  //     //   // 如果没有权限，则重定向到登录页面
  //     //   console.warn(`没有权限访问 ${to.path}，重定向到登录页`)
  //     //   // router.replace({ path: '/login' })
  //     //   next({ path: '/login' })
  //     //   return
  //     // }

  //     next() // 继续导航
  //   } catch (error) {
  //     console.error('认证令牌无效或过期', error)
  //     // 如果令牌无效或过期，则重定向到登录页
  //     next({ path: '/' })
  //     return
  //   }
}
// 全局后置导航守卫
export const afterEach = (to, from): void => {
  console.log(`Navigated from ${from.fullPath} to ${to.fullPath}`)
  NProgress.done() // 关闭进度条
  const loadingStore = useLoadingStore()
  loadingStore.hideRouteLoading()
  // 在这里可以添加路由跳转的逻辑
  // 比如记录页面访问日志

  // 判断用户权限

  // 放行
}
