import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { createPermissionGuard } from './permission';
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
    // 设置页面标题
    useTitle(to.meta.title);
    // 关闭 loading bar
    window.$loadingBar?.finish();
  });
}
