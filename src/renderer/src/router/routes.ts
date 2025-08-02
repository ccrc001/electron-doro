import type { RouteRecordRaw } from 'vue-router'
import Layout from '../layouts/index.vue'
export const Approutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    meta: {
      icon: 'search',
      label: 'router.login'
    },
    component: () => import('../view/login/index.vue')
  },
  {
    path: '/root',
    name: 'Root',
    component: Layout,
    redirect: '/home',
    meta: {
      icon: 'House',
      label: 'router.home'
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: {
          icon: 'House',
          label: 'router.home'
        },
        component: () => import('../view/home/index.vue')
      },
      {
        path: '/article',
        name: 'Article',
        meta: {
          icon: 'Postcard',
          label: 'router.article'
        },
        component: () => import('../view/article/index.vue')
      },
      {
        path: '/settings',
        name: 'Settings',
        meta: {
          icon: 'Setting',
          label: 'router.settings'
        },
        component: () => import('../view/settings/index.vue')
      },
      {
        path: '/demo',
        name: 'Debug',
        meta: {
          icon: 'ChromeFilled',
          label: 'router.demo'
        },
        component: () => import('../view/demo/index.vue')
      },
      {
        path: '/daily-food',
        name: 'DailyFood',
        meta: {
          icon: 'Food',
          label: 'router.dailyFood'
        },
        component: () => import('../view/daily-food/index.vue')
      }
    ]
  }
]
export const BeforeRoute: RouteRecordRaw[] = [
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
]
