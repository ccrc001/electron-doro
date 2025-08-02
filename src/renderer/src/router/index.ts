import { createRouter, createWebHashHistory } from 'vue-router'
import { Approutes, BeforeRoute } from '@router/routes'
import { beforeEach, afterEach } from '@router/guards'
import { useMenuStore } from '@stores/useMenuStore'
const AppRouter = createRouter({
  history: createWebHashHistory(),
  routes: [...Approutes, ...BeforeRoute],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
AppRouter.beforeEach(beforeEach)
AppRouter.afterEach(afterEach)

// 动态添加路由的函数
// export async function addDynamicRoutes(): Promise<void> {
//   const routeStore = useMenuStore()
//   if (!routeStore.hasAddedRoutes) {
//     console.log('开始添加动态路由...')
//     console.log('菜单列表:', routeStore.menuList)

//     try {
//       // 这里可以是从API获取的动态路由
//       const dynamicRoutes = routeStore.menuList.map((route: any) => {
//         return {
//           path: route.path,
//           name: route.name,
//           component: () => import(`../view/${route.component}/index.vue`),
//           meta: {
//             icon: route.meta?.icon,
//             label: route.meta?.label,
//             title: route.meta?.title
//           }
//         }
//       })

//       console.log('准备添加的动态路由:', dynamicRoutes)

//       dynamicRoutes.forEach((route) => {
//         try {
//           AppRouter.addRoute(route)
//           console.log(`成功添加路由: ${route.name}`)
//         } catch (error) {
//           console.error(`添加路由 ${route.name} 失败:`, error)
//         }
//       })
//       AppRouter.addRoute({
//         path: '/:pathMatch(.*)*',
//         name: 'NotFound',
//         component: () => import('../components/NotFound.vue'),
//         meta: {
//           title: '页面未找到'
//         }
//       })
//       // 标记路由已添加
//       // routeStore.setRoutesAdded(true)

//       // 打印所有路由以验证
//       console.log('所有路由:', AppRouter.getRoutes())
//       console.log('动态路由添加完成')
//     } catch (error) {
//       console.error('添加动态路由时发生错误:', error)
//     }
//   } else {
//     console.log('动态路由已经添加过了，跳过')
//   }
// }

export default AppRouter
