import type { RouteComponent } from 'vue-router';
import { LayoutEnum, Layouts } from '@/layouts';

export enum RouteNameEnum {
  /** 根路由 */
  Root = 'Root',
  /** 登录页 */
  Login = 'Login',
  /** 未匹配路由 */
  NotFound = 'NotFound',
  /** 工作台 */
  Workbench = 'Workbench',
  /** PlayStation */
  PlayStation = 'PlayStation',
  /** PlayStation 游戏信息 */
  PlayStation_Game = 'PlayStation_Game',
  /** PlayStation 奖杯信息 */
  PlayStation_Trophy = 'PlayStation_Trophy',
  /** PlayStation 游戏查找 */
  PlayStation_Search = 'PlayStation_Search',
}

/** 路由页面 */
export const Views: Record<
  Exclude<keyof typeof RouteNameEnum, 'Root'>,
  RouteComponent | (() => Promise<{ default: RouteComponent }>)
> = {
  [RouteNameEnum.NotFound]: () => import('./__function__/not-found/index.vue'),
  [RouteNameEnum.Login]: () => import('./login/index.vue'),
  [RouteNameEnum.Workbench]: () => import('./workbench/index.vue'),
  [RouteNameEnum.PlayStation_Game]: () => import('./play-station/game/index.vue'),
  [RouteNameEnum.PlayStation_Trophy]: () => import('./play-station/trophy/index.vue'),
  [RouteNameEnum.PlayStation_Search]: () => import('./play-station/search/index.vue'),
  [RouteNameEnum.PlayStation]: Layouts[LayoutEnum.Admin],
};
