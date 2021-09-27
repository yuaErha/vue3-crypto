import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: { name: 'Tools' } },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    redirect: { name: 'Sha' },
    component: () => import(/* webpackChunkName: "Tools" */ '@/views/Tools.vue'),
    children: [
      {
        path: 'sha',
        name: 'Sha',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/Sha.vue')
      },
      {
        path: 'md5',
        name: 'MD5',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/MD5.vue')
      },
      {
        path: 'base64',
        name: 'Base64',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/Base64.vue')
      },
      {
        path: 'aes',
        name: 'AES',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/Aes.vue')
      },
      {
        path: 'des',
        name: 'DES',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/Aes.vue')
      },
      {
        path: 'rsa',
        name: 'RSA',
        component: () => import(/* webpackChunkName: "Hash" */ '@/components/Rsa.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
