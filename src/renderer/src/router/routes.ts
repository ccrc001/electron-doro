// import type { RouteRecordRaw } from 'vue-router'
// // import Layout from '../layouts/index.vue'
// export const Approutes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     name: 'home',
//     meta: {
//       icon: 'House',
//       label: 'router.home'
//     },
//     component: () => import('../view/home/index.vue')
//   },
//   {
//     path: '/login',
//     name: 'login',
//     meta: {
//       icon: 'search',
//       label: 'router.login'
//     },
//     component: () => import('../view/login/index.vue')
//   },
//   {
//     path: '/article',
//     name: 'article',
//     meta: {
//       icon: 'Postcard',
//       label: 'router.article'
//     },
//     component: () => import('../view/article/index.vue')
//   },
//   {
//     path: '/settings',
//     name: 'settings',
//     meta: {
//       icon: 'Setting',
//       label: 'router.settings'
//     },
//     component: () => import('../view/settings/index.vue')
//   },
//   {
//     path: '/demo',
//     name: 'debug',
//     meta: {
//       icon: 'ChromeFilled',
//       label: 'router.demo'
//     },
//     component: () => import('../view/demo/index.vue')
//   },
//   {
//     path: '/daily-food',
//     name: 'dailyFood',
//     meta: {
//       icon: 'Food',
//       label: 'router.dailyFood'
//     },
//     component: () => import('../view/daily-food/index.vue')
//   }
//   // {
//   //   path: '/mock-test',
//   //   name: 'mockTest',
//   //   meta: {
//   //     icon: 'Connection',
//   //     label: 'router.mock'
//   //   },
//   //   component: () => import('../view/mock-test/index.vue')
//   // }
//   // {
//   //   path: '/keep-alive-test',
//   //   name: 'keepAliveTest',
//   //   meta: {
//   //     icon: 'Tools',
//   //     label: 'Keep-Alive测试'
//   //   },
//   //   component: () => import('../view/keep-alive-test/index.vue')
//   // }
// ]

import type { RouteRecordRaw } from 'vue-router'
import Layout from '../layouts/index.vue'
export const Approutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: '/home',
    meta: {
      icon: 'House',
      label: 'router.home'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          icon: 'House',
          label: 'router.home'
        },
        component: () => import('../view/home/index.vue')
      },
      {
        path: '/login',
        name: 'login',
        meta: {
          icon: 'search',
          label: 'router.login'
        },
        component: () => import('../view/login/index.vue')
      },
      {
        path: '/article',
        name: 'article',
        meta: {
          icon: 'Postcard',
          label: 'router.article'
        },
        component: () => import('../view/article/index.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        meta: {
          icon: 'Setting',
          label: 'router.settings'
        },
        component: () => import('../view/settings/index.vue')
      },
      {
        path: '/demo',
        name: 'debug',
        meta: {
          icon: 'ChromeFilled',
          label: 'router.demo'
        },
        component: () => import('../view/demo/index.vue')
      },
      {
        path: '/daily-food',
        name: 'dailyFood',
        meta: {
          icon: 'Food',
          label: 'router.dailyFood'
        },
        component: () => import('../view/daily-food/index.vue')
      }
    ]
  },
  {
    path: '/douyin',
    name: 'Douyin',
    component: () => import('../view/douyin/index.vue'),
    meta: {
      title: 'douyin'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }

  // {
  //   path: '/mock-test',
  //   name: 'mockTest',
  //   meta: {
  //     icon: 'Connection',
  //     label: 'router.mock'
  //   },
  //   component: () => import('../view/mock-test/index.vue')
  // }
  // {
  //   path: '/keep-alive-test',
  //   name: 'keepAliveTest',
  //   meta: {
  //     icon: 'Tools',
  //     label: 'Keep-Alive测试'
  //   },
  //   component: () => import('../view/keep-alive-test/index.vue')
  // }
]
