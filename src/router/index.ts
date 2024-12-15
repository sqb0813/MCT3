import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 需要登录的页面
  const requiresAuth = ['/ai-love/test', '/ai-love/history', '/ai-love/community']
  
  if (requiresAuth.includes(to.path) && !userStore.isLoggedIn) {
    next('/ai-love/login')
  } else {
    next()
  }
}) 