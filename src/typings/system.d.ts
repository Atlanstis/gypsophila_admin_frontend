declare namespace Layout {
  /** 后台页菜单选项 */
  type AdminMenuOption = import('naive-ui').MenuOption & {
    key: string;
    label: string;
    routeName: string;
    routePath: string;
    icon?: () => import('vue').VNodeChild;
    children?: AdminMenuOption[];
  };

  /** 后台页页签 Tab */
  type AdminTab = Pick<
    import('vue-router').RouteLocationNormalizedLoaded,
    'name' | 'fullPath' | 'meta'
  > & {
    /** 滚动的位置 */
    scrollPosition: {
      left: number;
      top: number;
    };
  };

  type AdminBreadcrumbOption = {
    label: string;
    key: string;
    icon?: () => import('vue').VNodeChild;
  };

  type AdminBreadcrumb = {
    key: string;
    label: string;
    hasChildren?: boolean;
    icon?: () => import('vue').VNodeChild;
    options?: AdminBreadcrumbOption[];
  };
}

/** defineExpose 导出的类型 */
declare namespace Expose {
  /** BetterScroll 组件 Expose 类型 */
  interface BetterScroll {
    instance: import('@better-scroll/core').BScrollInstance;
  }
}
