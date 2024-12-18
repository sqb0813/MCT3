import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ModuleLayout from '@/layouts/ModuleLayout.vue'
import AiLoveLayout from '@/layouts/AiLoveLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // 图片工具模块
  {
    path: '/image',
    component: ModuleLayout,
    children: [
      {
        path: '',
        name: 'ImageHome',
        component: () => import('@/views/image/ImageHome.vue')
      },
      {
        path: 'compress',
        name: 'ImageCompress', 
        component: () => import('@/views/image/ImageCompress.vue')
      },
      {
        path: 'convert',
        name: 'ImageConvert',
        component: () => import('@/views/image/Convert.vue')
      },
      {
        path: 'blackOrWhite',
        name: 'ImageBlackOrWhite',
        component: () => import('@/views/image/BlackOrWhite.vue')
      },
      {
        path: 'textCard',
        name: 'ImageTextCard',
        component: () => import('@/views/image/TextCard.vue')
      },
      {
        path: 'randomColor',
        name: 'ImageRandomColor',
        component: () => import('@/views/image/RandomColor.vue')
      }
    ]
  },
  // AI恋爱系统模块 
  {
    path: '/ai-love',
    component: AiLoveLayout,
    children: [
      {
        path: '',
        name: 'AiLoveHome',
        component: () => import('@/views/ai-love/index.vue')
      },
      {
        path: 'test',
        name: 'AiLoveTest',
        component: () => import('@/views/ai-love/test.vue')
      },
      {
        path: 'history',
        name: 'AiLoveHistory', 
        component: () => import('@/views/ai-love/history.vue')
      },
      {
        path: 'result',
        name: 'AiLoveResult',
        component: () => import('@/views/ai-love/result.vue')
      },
      {
        path: 'login',
        name: 'AiLoveLogin',
        component: () => import('@/views/ai-love/login.vue')
      },
      {
        path: 'register',
        name: 'AiLoveRegister', 
        component: () => import('@/views/ai-love/register.vue')
      },
      {
        path: 'community',
        name: 'AiLoveCommunity',
        component: () => import('@/views/ai-love/community.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 