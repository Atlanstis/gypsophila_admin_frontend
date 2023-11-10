import type { RouteRecordRaw } from 'vue-router';
import { RouteNameEnum, Views } from '@/views';

/** 根路由 */
export const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: RouteNameEnum.Root,
  redirect: '/login',
};

export const constantRoutes: RouteRecordRaw[] = [
  ROOT_ROUTE,
  {
    path: '/login',
    name: RouteNameEnum.Login,
    component: Views[RouteNameEnum.Login],
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNameEnum.NotFound,
    component: Views[RouteNameEnum.NotFound],
    meta: {
      title: '未匹配路径',
    },
  },
];
