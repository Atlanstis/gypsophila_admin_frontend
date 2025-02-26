import { constantRoutes } from '@/router';
import { getRouteView } from '@/utils';
import { Layouts } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';
import { useIconRender } from '@/composables';

/**
 * 获取固定路由路由名
 * @returns 路由名
 */
export function getConstantRouteName() {
  return constantRoutes.map((route) => route.name);
}

export function generateRoutes(config: ResMenu.MenuRouteConfig[]) {
  const routes: RouteRecordRaw[] = [];
  const adminMenus: any[] = [];
  const keepAliveRouteNames: string[] = [];

  // 处理路由配置
  function processRoutes(configs: ResMenu.MenuRouteConfig[]) {
    return configs
      .map((config) => {
        // 获取组件
        let component;
        if (config.component) {
          component = getRouteView(config.component);
          if (!component) {
            console.error(`未查询到 ${config.component} 对应的视图组件`);
            return null;
          }
        }

        // 获取布局组件
        let layout;
        if (config.meta.layout) {
          layout = Layouts[config.meta.layout];
          if (!layout) {
            console.error(`未查询到 ${config.meta.layout} 对应的布局组件`);
            return null;
          }
        }

        // 处理缓存路由
        if (config.meta.keepAlive && config.name) {
          keepAliveRouteNames.push(config.name);
        }

        let route: RouteRecordRaw = {
          name: config.name,
          path: config.path,
          meta: { ...config.meta },
          component,
        } as RouteRecordRaw;

        // 处理组件配置
        if (config.meta.type === 'page') {
          if (layout) {
            route = {
              name: `${config.name}-Parent`,
              path: `${config.path}-parent`,
              component: layout,
              redirect: route.path,
              children: [route],
            };
          }
          return route;
        }

        // 处理菜单类型的路由
        if (config.children?.length) {
          const childRoutes = processRoutes(config.children);
          if (childRoutes.length) {
            if (layout) {
              route.component = layout;
              route.children = childRoutes.filter(Boolean);
            } else {
              route.children = childRoutes.filter(Boolean);
            }
          }
        }

        return route;
      })
      .filter((route): route is RouteRecordRaw => !!route);
  }

  // 处理菜单配置
  function processMenuOpts(configs: ResMenu.MenuRouteConfig[]) {
    return configs
      .map((config) => {
        if (config.meta.hideInMenu) {
          return null;
        }
        const { iconRender } = useIconRender();

        const menuOpt: Layout.AdminMenuOption = {
          key: config.name,
          label: config.meta.title,
          routeName: config.name,
          routePath: config.path,
          icon: iconRender({ icon: config.meta.icon, iconLocal: config.meta.iconLocal }),
        };

        if (config.children?.length) {
          const children = processMenuOpts(config.children);
          if (children.length) {
            menuOpt.children = children.filter(Boolean);
          }
        }

        return menuOpt;
      })
      .filter((opt): opt is Layout.AdminMenuOption => !!opt);
  }

  // 生成路由配置
  routes.push(...processRoutes(config));
  // 生成菜单配置
  adminMenus.push(...processMenuOpts(config));

  return {
    routes,
    adminMenus,
    keepAliveRouteNames,
  };
}
