import { RouteEnum } from '@/enums';
import { getRouteView } from '@/utils';

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
];
