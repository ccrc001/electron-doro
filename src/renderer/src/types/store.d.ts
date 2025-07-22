declare module '@stores/useMenuStore' {
  import { StoreDefinition } from 'pinia'

  interface State {
    num: number
    a: number
  }

  interface getters {}

  interface actions {}

  // 添加 persist 选项的类型
  interface Options {
    persist: boolean
  }

  export const useMenuStore: StoreDefinition<'useMenuStore', MenuState, getters, actions> & Options
}

declare module '@stores/useUserStore' {
  import { StoreDefinition } from 'pinia'
  import { Ref } from 'vue'

  interface UserState {
    userInfo: Record<string, any>
    rolePerm: string
    permissions: string
  }

  interface Getters {
    // 如果有 getters，在这里定义
  }

  interface Actions {
    setToken(token: string): Promise<void>
    getToken(): Promise<string>
    removeToken(): Promise<void>
    getUserInfo(): Promise<void>
    getPermissions(): string
  }

  interface PersistOptions {
    persist: {
      key: string
      paths: string[]
      storage: Storage
    }
  }

  export const useUserStore: StoreDefinition<
    'useUserStore',
    {
      userInfo: Ref<Record<string, any>>
      rolePerm: Ref<string>
      permissions: Ref<string>
    },
    Getters,
    Actions
  > & PersistOptions
}

declare module '@stores/useLoadingStore' {
  import { StoreDefinition } from 'pinia'

  interface LoadingState {
    loadingCount: number
    routeLoading: boolean
  }
  export const useLoadingStore: StoreDefinition<'useLoadingStore', LoadingState, getters, actions> & Options
}

declare module '@stores/useAppStore'{
  import { StoreDefinition } from 'pinia'

  interface LoadingState {
    lang: string
    theme: string
  }
  export const useAppStore: StoreDefinition<'useAppStore', LoadingState, getters, actions> & Options
}