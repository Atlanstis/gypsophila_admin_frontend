import { constantRoutes } from '@/router';
import { getRouteView } from '@/utils';
import { Layouts } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 获取固定路由路由名
 * @returns 路由名
 */
export function getConstantRouteName() {
  return constantRoutes.map((route) => route.name);
}

/** 生成路由信息 */
export function generateRoutes(config: ResMenu.MenuRouteConfig[]) {
  const routes: RouteRecordRaw[] = [];
  const keepAliveRouteNames: string[] = [];

  // 递归查找第一个页面类型的路由
  function findFirstPageRoute(configs: ResMenu.MenuRouteConfig[]): string | undefined {
    // 先查找当前级别
    const firstPage = configs.find((item) => item.meta.type === 'page');
    if (firstPage) {
      return firstPage.path;
    }

    // 递归查找子菜单
    for (const item of configs) {
      if (item.children?.length) {
        const childPagePath = findFirstPageRoute(item.children);
        if (childPagePath) {
          return childPagePath;
        }
      }
    }

    return undefined;
  }

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
            // 查找第一个页面类型的路由（包括多级子菜单）
            const firstPagePath = findFirstPageRoute(config.children);
            if (firstPagePath) {
              route.redirect = firstPagePath;
            }

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

  // 生成路由配置
  routes.push(...processRoutes(config));

  return {
    routes,
    keepAliveRouteNames,
  };
}
