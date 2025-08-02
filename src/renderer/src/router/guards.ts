import { useUserStore } from '@stores/useUserStore'
import { useMenuStore } from '@stores/useMenuStore'
import { useLoadingStore } from '@stores/useLoadingStore'
import { cacheUtils } from '@renderer/utils/cacheUtils'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import CONFIG from '@config/index'
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
// 全局前置导航守卫
export const beforeEach = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  NProgress.start() // 开始进度条

  const loadingStore = useLoadingStore()
  loadingStore.showRouteLoading()

  // 白名单路由，不需要权限检查
  const whiteList = ['/', '/:pathMatch(.*)*', '/login']
  if (whiteList.includes(to.path) || to.name === 'NotFound' || to.name === 'Login') {
    console.log(`白名单路由 ${to.path} 直接放行`)
    next()
    return
  }

  // 检查是否有登录令牌
  if (!cacheUtils.get('TOKEN')) {
    // 没有令牌，重定向到登录页
    next({ path: '/' })
    return
  }

  try {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    // 如果有认证令牌，则继续
    // 这里添加更复杂的逻辑，比如检查令牌是否有效等

    const getRolePerm = userStore.rolePerm
    // 最高权限放行
    if (getRolePerm === CONFIG.PERMISSIONS) {
      next() // 继续导航
      return
    }

    // console.log('检查路由权限:', to.path)
    // console.log('menuMap:', menuStore.menuMap)
    // console.log('路由是否在权限列表中:', to.path in (menuStore.menuMap ?? {}))

    // 检查路由是否在权限列表中
    if (!(to.path in (menuStore.menuMap ?? {}))) {
      console.warn(`路由 ${to.path} 不在权限列表中，重定向到404页面`)
      next({ name: 'NotFound' })
      return
    }

    next() // 继续导航
  } catch (error) {
    console.error('认证令牌无效或过期', error)
    // 如果令牌无效或过期，则重定向到登录页
    next({ name: 'Login' })
    return
  }
}
// 全局后置导航守卫
export const afterEach = (to: RouteLocationNormalized, from: RouteLocationNormalized): void => {
  console.log(`Navigated from✅ ${from.fullPath} to ${to.fullPath}`)
  NProgress.done() // 关闭进度条
  const loadingStore = useLoadingStore()
  loadingStore.hideRouteLoading()
  // 在这里可以添加路由跳转的逻辑
  // 比如记录页面访问日志
  // 判断用户权限
  // 放行
}
