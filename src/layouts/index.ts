import type { RouteComponent } from 'vue-router';

/** 布局枚举 */
export enum LayoutEnum {
  /** Admin 布局 */
  Admin = 'Admin',
}

export const Layouts: Record<
  LayoutEnum,
  RouteComponent | (() => Promise<{ default: RouteComponent }>)
> = {
  [LayoutEnum.Admin]: () => import('./admin-layout/index.vue'),
};
