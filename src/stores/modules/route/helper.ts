import type { RouteRecordRaw } from 'vue-router';
import { useIconRender } from '@/composables';

/**
 * 转换权限路由
 * @param routes 所有系统支持的路由
 * @param authArr 权限包含的路由名数组
 * @returns vue-router 支持的路由
 */
export function transformAuthRoute(routes: AuthRoute.Route[], authArr: PageRoute.AllRouteName[]) {
  const authMap = getAuthMap(authArr);
  return filterAuthRoute(routes, authMap);
}

/**
 * 将权限路由转换成菜单
 * @param routes 所有系统支持的路由
 * @param authArr 权限包含的路由名数组
 * @returns 后台页菜单
 */
export function transformAuthRouteToMenus(
  routes: AuthRoute.Route[],
  authArr: PageRoute.AllRouteName[],
) {
  const authMap = getAuthMap(authArr);
  return filterAuthRouteToMenus(routes, authMap);
}

/**
 * 过滤权限路由并转换成菜单
 */
function filterAuthRouteToMenus(routes: AuthRoute.Route[], authMap: Record<string, boolean>) {
  const menus: Layout.AdminMenuOption[] = [];
  routes.forEach((route) => {
    if (authMap[route.name]) {
      const { iconRender } = useIconRender();
      const menu: Layout.AdminMenuOption = {
        key: route.name,
        label: route.meta.title,
        routeName: route.name,
        routePath: route.path,
        icon: iconRender({ icon: route.meta.icon, iconLocal: route.meta.iconLocal }),
      };
      if (hasChildren(route.children)) {
        menu.children = filterAuthRouteToMenus(route.children, authMap);
      }
      menus.push(menu);
    }
  });
  return menus;
}

/**
 * 过滤权限路由
 */
function filterAuthRoute(routes: AuthRoute.Route[], authMap: Record<string, boolean>) {
  const authRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    if (authMap[route.name]) {
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
        itemRoute.children = filterAuthRoute(route.children, authMap);
        itemRoute.redirect = itemRoute.children[0].path;
      }
      authRoutes.push(itemRoute);
    }
  });
  return authRoutes;
}

/**
 * 将权限数组转换成 map 格式的对象
 * @param authArr
 * @returns
 */
function getAuthMap(authArr: PageRoute.AllRouteName[]) {
  const authMap: Record<string, boolean> = {};
  authArr.forEach((name) => {
    authMap[name] = true;
  });
  return authMap;
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
