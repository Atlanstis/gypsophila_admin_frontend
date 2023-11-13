import type { RouteRecordRaw } from 'vue-router';

/**
 * 转换权限路由
 * @param routes 所有系统支持的路由
 * @param authArr 权限包含的路由名数组
 * @returns vue-router 支持的路由
 */
export function transformAuthRoute(routes: AuthRoute.Route[], authArr: PageRoute.AllRouteName[]) {
  const authMap: Record<string, boolean> = {};
  authArr.forEach((name) => {
    authMap[name] = true;
  });
  return filterAuthRoute(routes, authMap);
}

/**
 * 过滤权限路由
 */
function filterAuthRoute(routes: AuthRoute.Route[], map: Record<string, boolean>) {
  const authRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    if (map[route.name]) {
      const itemRoute = { ...route } as RouteRecordRaw;
      /** 替换布局组件 */
      if (hasLayout(route.meta.layout)) {
        if (hasComponent(route.component)) {
          const parentRoute: RouteRecordRaw = {
            path: `${itemRoute.path}-parent`,
            component: route.meta.layout,
            redirect: itemRoute.path,
            children: [itemRoute],
          };
          return authRoutes.push(parentRoute);
        } else {
          itemRoute.component = route.meta.layout;
        }
      }
      if (hasChildren(route.children)) {
        itemRoute.children = filterAuthRoute(route.children, map);
        itemRoute.redirect = itemRoute.children[0].path;
      }
      authRoutes.push(itemRoute);
    }
  });
  return authRoutes;
}

function hasComponent(component: Common.Component | undefined): component is Common.Component {
  return Boolean(component);
}

function hasLayout(layout: Common.Component | undefined): layout is Common.Component {
  return Boolean(layout);
}

function hasChildren(children: AuthRoute.Route[] | undefined): children is AuthRoute.Route[] {
  return Array.isArray(children) && children.length > 0;
}
