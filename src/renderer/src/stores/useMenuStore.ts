import { defineStore } from 'pinia'
import { getMenu } from '@api/login'
import { ref } from 'vue'
import { Approutes } from '@router/routes'
export const useMenuStore = defineStore(
  'useMenuStore',
  () => {
    const menuMap = ref<Record<string, any>>({})
    const menuList = ref<any[]>([])
    const hasAddedRoutes = ref(false) // 添加标记，防止重复添加路由

    async function getMenuList(rolePerm: string): Promise<void> {
      let res = await getMenu(rolePerm)
      // console.log(res)
      // menuList.value = res.data.data

      if (res.code == '200') {
        const menuData = await normalizeMenu(res.data.data)
        // console.log(menuData)

        menuMap.value = Object.fromEntries(menuData.authMenuMap)
        menuList.value = menuData.router
      } else {
        menuMap.value = {}
        menuList.value = []
      }
    }

    // 设置路由已添加标记
    function setRoutesAdded(added: boolean): void {
      hasAddedRoutes.value = added
    }

    return {
      menuMap,
      menuList,
      hasAddedRoutes,
      getMenuList,
      setRoutesAdded
    }
  },
  {
    persist: {
      pick: ['menuMap', 'menuList']
    }
  }
)

function normalizeMenu(routes: any[]): {
  router: any[]
  authMenuMap: Map<string, any>
} {
  const authMap = new Map()
  const router = [...Approutes, ...routes]
  const authMenuMap = normalizeMenuItem(router, authMap)

  // 确保白名单路由也在权限映射中
  // const whiteListRoutes = [
  //   { path: '/', name: 'login' },
  //   { path: '/:pathMatch(.*)*', name: 'NotFound' }
  //   // { path: '/douyin', name: 'Douyin' }
  // ]

  // whiteListRoutes.forEach((route) => {
  //   authMap.set(route.path, route)
  // })

  return {
    router,
    authMenuMap
  }
}

function normalizeMenuItem(routes: any[], map: Map<string, any>): Map<string, any> {
  routes.forEach((item) => {
    if (item.children && item.children.length > 0) {
      normalizeMenuItem(item.children, map)
    } else {
      delete item.children
    }
    map.set(item.path, item)
  })
  return map
}
