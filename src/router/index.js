import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ModuleLayout from '../layouts/ModuleLayout.vue'

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
          component: ModuleLayout,
          children: [
            // {
            //   path: '',
            //   redirect: '/image/compress'
            // },
            // 图片压缩
            {
              path: 'compress',
              name: 'imageCompress',
              component: () => import('../views/image/Compress.vue')
            },
            // 图片格式转换
            {
              path: 'convert',
              name: 'imageConvert',
              component: () => import('../views/image/Convert.vue')
            },
            // 图片加水印
            {
              path: 'watermark',
              name: 'imageWatermark',
              component: () => import('../views/image/Watermark.vue')
            },
            // 图片模糊化
            {
              path: 'blur',
              name: 'imageBlur',
              component: () => import('../views/image/ImageBlur.vue')
            }
          ]
        }
      ]
    }
  ]
})

export default router 