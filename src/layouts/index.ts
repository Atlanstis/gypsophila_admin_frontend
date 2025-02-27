/**
 * 布局组件映射
 */
export const Layouts: Record<string, Common.Component> = {
  Admin: () => import('./admin-layout/index.vue'),
};

/** 布局-选项 */
export const Const_LayoutOpts = Object.keys(Layouts).map((key) => ({
  label: key,
  value: key,
}));
