declare module '@router/routes' {
  import type { RouteRecordRaw } from 'vue-router'

  export const Approutes: RouteRecordRaw[]
}

declare module '@router/guards' {
  export const beforeEach
  export const afterEach
}
