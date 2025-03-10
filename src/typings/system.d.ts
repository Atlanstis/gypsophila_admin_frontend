declare namespace Layout {
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

/** defineExpose 导出的类型 */
declare namespace Expose {
  /** BetterScroll 组件 Expose 类型 */
  interface BetterScroll {
    instance: import('@better-scroll/core').BScrollInstance;
  }
}
