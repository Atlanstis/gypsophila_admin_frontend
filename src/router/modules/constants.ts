import { Views } from '@/views';
import { RouteEnum } from '@/enums';

/** 根路由 */
export const ROOT_ROUTE: AuthRoute.Route = {
  path: '/',
  name: RouteEnum.Root,
  redirect: '/login',
  meta: {
    title: '根路由',
  },
};

export const constantRoutes: AuthRoute.Route[] = [
  ROOT_ROUTE,
  {
    path: '/login',
    name: RouteEnum.Login,
    component: Views[RouteEnum.Login],
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteEnum.NotFound,
    component: Views[RouteEnum.NotFound],
    meta: {
      title: '未匹配路径',
    },
  },
];
