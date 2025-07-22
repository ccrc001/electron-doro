import { createRouter, createWebHashHistory } from 'vue-router'
import { Approutes } from '@router/routes'
import { beforeEach, afterEach } from '@router/guards'

const AppRouter = createRouter({
  history: createWebHashHistory(),
  routes: Approutes,
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
export default AppRouter
