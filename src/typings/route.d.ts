declare namespace AuthRoute {
  interface RouteMeta {
    /** 路由标题 */
    title: string;
    /** 动态路径 */
    dynamicPath?: string;
    /** 作为单级路由的父级路由布局组件 */
    layout?: LayoutComponentType;
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
