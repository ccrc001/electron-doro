import { defineStore } from 'pinia'
import { getMenu } from '@api/login'
import { ref } from 'vue'

export const useMenuStore = defineStore('useMenuStore', () => {
  const menuMap = ref<Record<string, any>>({})
  const menuList = ref<any[]>([])

  async function getMenuList(rolePerm: string) {
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
}, {
  persist: {
    pick: ['menuMap', 'menuList']
  }
})

function normalizeMenu(routes) {
  const authMap = new Map()
  let roter = [
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

function normalizeMenuItem(routes, map) {
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
