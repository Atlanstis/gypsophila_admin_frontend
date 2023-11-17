import type { App } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createRouterGuard } from './guard';
import { constantRoutes } from './modules';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes] as RouteRecordRaw[],
});

/**
 * 安装 vue 路由
 * @param app vue 实例
 */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}

export * from './modules';
