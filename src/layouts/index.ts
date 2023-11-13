import { LayoutEnum } from '@/enums';

/**
 * 布局组件映射
 */
export const Layouts: Record<LayoutEnum, Common.Component> = {
  [LayoutEnum.Admin]: () => import('./admin-layout/index.vue'),
};
