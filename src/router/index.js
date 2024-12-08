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
            {
              path: '',
              redirect: '/image/compress'
            },
            {
              path: 'compress',
              name: 'imageCompress',
              component: () => import('../views/image/Compress.vue')
            },
            // 其他图片工具路由
            // {
            //   path: 'convert',
            //   name: 'imageConvert',
            //   component: () => import('../views/image/Convert.vue')
            // }
          ]
        }
      ]
    }
  ]
})

export default router 