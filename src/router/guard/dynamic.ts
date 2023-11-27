import { useAuthStore, useRouteStore } from '@/stores';
import { RouteEnum } from '@/enums';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/**
 * 加载权限路由
 */
export async function createDynamicRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const auth = useAuthStore();
  const route = useRouteStore();

  const isLogin = auth.isLogin;

  if (!route.isInitAuthRoute) {
    // 未登录情况下直接回到登录页，登录成功后再加载权限路由
    if (!isLogin) {
      if (to.name === RouteEnum.Login) {
        next();
      } else {
        const redirect = to.fullPath;
        next({ name: RouteEnum.Login, query: { redirect } });
      }
      return false;
    }
    route.setRedirect(to.fullPath);
    // 加载权限路由
    await route.initAuthRoute();

    if (to.name === RouteEnum.NotFound) {
      // 动态路由没有加载导致被not-found路由捕获，等待权限路由加载好了，回到之前的路由
      // 若路由是从根路由重定向过来的，重新回到根路由
      const path = to.redirectedFrom?.name === RouteEnum.Root ? '/' : to.fullPath;
      next({ path, replace: true, query: to.query, hash: to.hash });
      return false;
    }
  }

  return true;
}