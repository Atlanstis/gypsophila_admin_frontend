/** Admin 布局-菜单栏配置 */
export type AdminMenuOpt = {
  key: string;
  label: string;
  routeName: string;
  routePath: string;
  icon?: () => import('vue').VNodeChild;
  children?: AdminMenuOpt[];
};

/** Admin 布局-面包屑配置 */
export type AdminBreadcrumbOpt = {
  key: string;
  label: string;
  hasChildren?: boolean;
  icon?: () => import('vue').VNodeChild;
  options?: AdminBreadcrumbOpt[];
};

/** 后台页页签 Tab */
export type AdminTab = Pick<
  import('vue-router').RouteLocationNormalizedLoaded,
  'name' | 'fullPath' | 'meta'
>;
