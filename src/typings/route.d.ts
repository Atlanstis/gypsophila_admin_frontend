declare namespace AuthRoute {
  type Route<T extends PageRoute.AllRouteName = PageRoute.AllRouteName> =
    T extends PageRoute.AllRouteName
      ? {
          /** 路由名称 */
          name: PageRoute.AllRouteName;
          /** 路径 */
          path: string;
          /** 重定向地址 */
          redirect?: string;
          /** 渲染组件 */
          component?: Common.Component;
          /** 子路由 */
          children?: Route[];
          /** 额外信息 */
          meta: RouteMeta;
        } & Omit<
          import('vue-router').RouteRecordRaw,
          'name' | 'path' | 'redirect' | 'component' | 'children' | 'meta'
        >
      : never;

  interface RouteMeta {
    /** 路由标题 */
    title: string;
    /** 作为单级路由的父级路由布局组件 */
    layout?: Common.Component;
    /** 图标 采用 @iconify */
    icon?: string;
    /** 图标 采用本地路径 @/assets/icons 下文件 */
    iconLocal?: string;
    /** 是否在菜单中隐藏 */
    hide?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
  }
}
