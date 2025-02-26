/**
 * 布局组件映射
 */
export const Layouts: Record<string, Common.Component> = {
  Admin: () => import('./admin-layout/index.vue'),
};
