import { defineStore } from 'pinia'
import { getInfo } from '@api/login'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'useUserStore',
  () => {
    const userInfo = ref({})
    const rolePerm = ref('')
    const permissions = ref('*:*:*')

    async function setToken(token: string): Promise<void> {
      localStorage.setItem('TOKEN', token)
    }

    async function getToken(): Promise<string> {
      return localStorage.getItem('TOKEN') || ''
    }

    async function removeToken(): Promise<void> {
      localStorage.removeItem('TOKEN')
    }

    async function getUserInfo(): Promise<void> {
      const res = await getInfo()
      if (res.code == '200') {
        userInfo.value = res.data
        rolePerm.value = res.data.roles[0].rolePerm || ''
      } else {
        userInfo.value = {}
      }
    }

    function getPermissions(): string {
      return permissions.value
    }

    return {
      userInfo,
      rolePerm,
      permissions,
      setToken,
      getToken,
      removeToken,
      getUserInfo,
      getPermissions
    }
  },
  {
    persist: {
      key: 'useUserStore',
      pick: ['userInfo', 'rolePerm', 'permissions'],
      storage: localStorage // 使用localStorage | sessionStorage 进行持久化存储
    }
  }
)
