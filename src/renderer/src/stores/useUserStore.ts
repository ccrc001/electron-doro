import { defineStore } from 'pinia'
import { getUserInfo } from '@api/login'
import { ref } from 'vue'
import { cacheUtils } from '@utils/cacheUtils'
export const useUserStore = defineStore(
  'useUserStore',
  () => {
    const userInfo = ref({})
    const rolePerm = ref('')
    const permissions = ref('*:*:*')

    async function setToken(token: string): Promise<void> {
      cacheUtils.set('TOKEN', token)
    }

    async function getToken(): Promise<string> {
      return cacheUtils.get('TOKEN') || ''
    }

    async function removeToken(): Promise<void> {
      cacheUtils.remove('TOKEN')
    }

    async function getInfo(): Promise<void> {
      const res = await getUserInfo()
      // console.log(res)

      if (res.code == '200') {
        userInfo.value = res.data
        rolePerm.value = res.data.data.roles[0] || ''
      } else {
        userInfo.value = {}
      }
    }
    function getRolePerm(): string {
      return rolePerm.value
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
      getInfo,
      getRolePerm,
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
