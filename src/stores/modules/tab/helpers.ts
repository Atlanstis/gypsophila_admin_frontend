import type { RouteLocationNormalizedLoaded, RouteRecordNormalized } from 'vue-router';

/**
 * 获取该页签在多页签数据中的索引
 * @param tabs - 多页签数据
 * @param fullPath - 该页签的路径
 */
export function getIndexInTabs(tabs: Layout.AdminTab[], fullPath: string) {
  return tabs.findIndex((tab) => tab.fullPath === fullPath);
}

/**
 * 根据路由名称获取该页签在多页签数据中的索引
 * @param tabs - 多页签数据
 * @param routeName - 路由名称
 */
export function getIndexInTabsByRouteName(tabs: Layout.AdminTab[], routeName: string) {
  return tabs.findIndex((tab) => tab.name === routeName);
}

/**
 * 判断该页签是否在多页签数据中
 * @param tabs - 多页签数据
 * @param fullPath - 该页签的路径
 */
export function isInTabs(tabs: Layout.AdminTab[], fullPath: string) {
  return getIndexInTabs(tabs, fullPath) > -1;
}

/**
 * 根据 vue 路由获取 tab
 * @param route
 */
export function getTabByVueRoute(route: RouteRecordNormalized | RouteLocationNormalizedLoaded) {
  const fullPath = hasFullPath(route) ? route.fullPath : route.path;
  const tab: Layout.AdminTab = {
    name: route.name,
    fullPath,
    meta: route.meta,
    scrollPosition: {
      left: 0,
      top: 0,
    },
  };
  return tab;
}

/**
 * 判断路由是否有 fullPath 属性
 * @param route 路由
 */
function hasFullPath(
  route: RouteRecordNormalized | RouteLocationNormalizedLoaded,
): route is RouteLocationNormalizedLoaded {
  return Boolean((route as RouteLocationNormalizedLoaded).fullPath);
}
