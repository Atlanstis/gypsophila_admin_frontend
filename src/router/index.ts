import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/layouts/admin-layout/index.vue'),
      children: [
        {
          path: '/',
          component: () => import('@/views/test/index.vue'),
        },
      ],
    },
  ],
});

export default router;

/**
 * 安装 vue 路由
 * @param app createApp() 实例
 */
export async function setupRouter(app: App) {
  app.use(router);
  await router.isReady();
}
