import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: '/image',
          component: () => import('../layouts/ModuleLayout.vue'),
          children: [
            {
              path: 'compress',
              name: 'imageCompress',
              component: () => import('../views/image/Compress.vue')
            },
            {
              path: 'convert',
              name: 'imageConvert',
              component: () => import('../views/image/Convert.vue')
            },
            {
              path: 'watermark',
              name: 'imageWatermark',
              component: () => import('../views/image/Watermark.vue')
            },
            {
              path: 'blur',
              name: 'imageBlur',
              component: () => import('../views/image/ImageBlur.vue')
            },
            {
              path: 'grayScale',
              name: 'imageGrayScale',
              component: () => import('../views/image/ImageToGrayScale.vue')
            }
          ]
        },
        {
          path: '/love',
          children: [
            {
              path: '',
              name: 'love',
              component: () => import('../views/love/LoveHome.vue')
            },
            {
              path: 'test',
              name: 'loveTest',
              component: () => import('../views/love/LoveTest.vue')
            },
            {
              path: 'expert/:id',
              name: 'expertDetail',
              component: () => import('../views/love/ExpertDetail.vue')
            },
            {
              path: 'analysis',
              name: 'analysis',
              component: () => import('../views/love/Analysis.vue')
            },
            {
              path: 'advice',
              name: 'advice',
              component: () => import('../views/love/Advice.vue')
            }
          ]
        },
        {
          path: '/ai-love',
          component: () => import('../layouts/AiLoveLayout.vue'),
          children: [
            {
              path: '',
              name: 'aiLove',
              component: () => import('../views/ai-love/index.vue')
            },
            {
              path: 'test',
              name: 'aiLoveTest', 
              component: () => import('../views/ai-love/test.vue')
            },
            {
              path: 'result',
              name: 'aiLoveResult',
              component: () => import('../views/ai-love/result.vue')
            },
            {
              path: 'community',
              name: 'aiLoveCommunity',
              component: () => import('../views/ai-love/community.vue')
            },
            {
              path: 'history',
              name: 'aiLoveHistory',
              component: () => import('../views/ai-love/history.vue')
            }
          ]
        }
      ]
    }
  ]
})

export default router 