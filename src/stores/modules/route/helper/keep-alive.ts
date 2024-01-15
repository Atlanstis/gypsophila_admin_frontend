import type { RouteRecordRaw } from 'vue-router';

/**
 * 获取需要 keepAlive 的路由名
 * @param routes 授权路由
 * @returns 路由数组
 */
export function getKeepAliveRouteNames(routes: RouteRecordRaw[]) {
  const keepAliveNames: string[] = [];
  routes.forEach((route) => {
    if (hasChildren(route.children)) {
      route.children.forEach((childRoute) => {
        if (isKeepAlive(childRoute)) {
          keepAliveNames.push(childRoute.name as string);
        }
      });
    }
  });
  return keepAliveNames;
}

/**
 * 路由是否 keepAlive
 * @param route
 */
function isKeepAlive(route: RouteRecordRaw) {
  return Boolean(route?.meta?.keepAlive);
}

function hasChildren(children: RouteRecordRaw[] | undefined): children is RouteRecordRaw[] {
  return Array.isArray(children) && children.length > 0;
}
