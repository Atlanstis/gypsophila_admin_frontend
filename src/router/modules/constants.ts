import { RouteEnum } from '@/enums';
import { getRouteView } from '@/utils';
import type { RouteRecordRaw } from 'vue-router';

/** 根路由 */
export const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: RouteEnum.Root,
  redirect: '/login',
  meta: {
    title: '根路由',
  },
} as RouteRecordRaw;

export const constantRoutes: RouteRecordRaw[] = [
  ROOT_ROUTE,
  {
    path: '/login',
    name: RouteEnum.Login,
    component: getRouteView(RouteEnum.Login),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteEnum.NotFound,
    component: getRouteView(RouteEnum.NotFound),
    meta: {
      title: '404',
    },
  },
] as RouteRecordRaw[];
