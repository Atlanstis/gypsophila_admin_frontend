import { Enum_Route } from '@/constants';
import { getRouteView } from '@/utils';
import type { RouteRecordRaw } from 'vue-router';

/** 根路由 */
export const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: Enum_Route.Root,
  redirect: '/login',
  meta: {
    title: '根路由',
  },
} as RouteRecordRaw;

export const constantRoutes: RouteRecordRaw[] = [
  ROOT_ROUTE,
  {
    path: '/login',
    name: Enum_Route.Login,
    component: getRouteView(Enum_Route.Login),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: Enum_Route.NotFound,
    component: getRouteView(Enum_Route.NotFound),
    meta: {
      title: '404',
    },
  },
] as RouteRecordRaw[];
