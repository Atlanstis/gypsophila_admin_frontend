import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { createDynamicRouteGuard } from './dynamic';
import { useAuthStore } from '@/stores';
import { RouteNameEnum } from '@/views';
import { exeStrategyActions } from '@/utils';

/** 处理路由页面的权限 */
export async function createPermissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // 判断是否存在权限，存在则通过
  const permission = await createDynamicRouteGuard(to, from, next);
  if (!permission) return;

  const auth = useAuthStore();
  const isLogin = auth.isLogin;

  // 处理特定条件下的跳转
  const actions: Common.StrategyAction[] = [
    /** 已登录时前往登录页，跳转至首页 */
    [isLogin && to.name === RouteNameEnum.Login, () => next({ name: RouteNameEnum.Root })],
    /** 已登录，前往其他页面，放行 */
    [isLogin, () => next()],
  ];
  exeStrategyActions(actions);
}
