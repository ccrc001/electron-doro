import { defineStore } from 'pinia'
import { getMenu } from '@api/login'
import { ref } from 'vue'

export const useMenuStore = defineStore(
  'useMenuStore',
  () => {
    const menuMap = ref({})
    const menuList = ref([])

    async function getMenuList(rolePerm: string): Promise<void> {
      let res = await getMenu(rolePerm)
      if (res.code == '200') {
        const menuData = await normalizeMenu(res.data)

        menuMap.value = Object.fromEntries(menuData.authMenuMap)
        menuList.value = menuData.roter
      } else {
        menuMap.value = {}
        menuList.value = []
      }
    }

    return {
      menuMap,
      menuList,
      getMenuList
    }
  },
  {
    persist: {
      pick: ['menuMap', 'menuList']
    }
  }
)

function normalizeMenu(routes): {
  roter: any[]
  authMenuMap: any
} {
  const authMap = new Map()
  const roter = [
    {
      path: '/',
      name: '首页'
    },
    ...routes
  ]
  const authMenuMap = normalizeMenuItem(roter, authMap)
  return {
    roter,
    authMenuMap
  }
}

function normalizeMenuItem(routes, map): any {
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
