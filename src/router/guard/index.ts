import type { Router } from 'vue-router';
import { createPermissionGuard } from './permission';
import { useAppStore } from '@/stores';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 开启 loading bar
    window.$loadingBar?.start();
    // 处理页面跳转逻辑
    await createPermissionGuard(to, from, next);
  });

  router.afterEach((to) => {
    const appStore = useAppStore();
    // 设置页面标题
    appStore.updateWebsiteTitle(to.meta.title);
    // 关闭 loading bar
    window.$loadingBar?.finish();
  });
}
