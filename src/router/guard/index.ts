import type { Router } from 'vue-router';
import { createPermissionGuard } from './permission';
/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    await createPermissionGuard(to, from, next);
  });

  // router.afterEach((to, from) => {});
}
