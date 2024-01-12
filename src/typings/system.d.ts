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
}

declare namespace System {
  /** 页面操作权限 */
  type OperationPermission = {
    /** 是否可以新增 */
    canAdd?: boolean;
    /** 是否可以编辑 */
    canEdit?: boolean;
    /** 是否可以删除 */
    canDelete?: boolean;
    /** 是否可以查看列表 */
    canList?: boolean;
    /** 角色管理，菜单管理中权限的分配 */
    canAllocation?: boolean;
  };
}

/** defineExpose 导出的类型 */
declare namespace Expose {
  /** BetterScroll 组件 Expose 类型 */
  interface BetterScroll {
    instance: import('@better-scroll/core').BScrollInstance;
  }
}
