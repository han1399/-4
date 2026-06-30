import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Shop from '@/views/Shop.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shop',
      name: 'shop',
      component:Shop,
      meta: { requiresAuth: true }
    },
    {
      path: '/trade',
      name: 'trade',
      component: () => import('@/views/Trade.vue'),
      meta: { requiresAuth: true }
    },
    // 在 routes 数组中添加
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/Feedback.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/Game.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sudoku',
      name: 'sudoku',
      component: () => import('@/views/Sudoku.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫：检查是否需要登录
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router