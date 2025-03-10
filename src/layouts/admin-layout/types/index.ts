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
