import { RouteEnum } from '@/enums';

/** 路由页面 */
export const Views: Record<PageRoute.HasPageRoute, Common.AsyncComponent> = {
  [RouteEnum.NotFound]: () => import('./__function__/not-found/index.vue'),
  [RouteEnum.Login]: () => import('./login/index.vue'),
  [RouteEnum.Workbench]: () => import('./workbench/index.vue'),
  [RouteEnum.PlayStation_Profile]: () => import('./play-station/profile/index.vue'),
  [RouteEnum.PlayStation_Profile_Game]: () => import('./play-station/profile-game/index.vue'),
  [RouteEnum.PlayStation_Game]: () => import('./play-station/game/index.vue'),
  [RouteEnum.PlayStation_Search]: () => import('./play-station/search/index.vue'),
  [RouteEnum.PlayStation_Analysis]: () => import('./play-station/analysis/index.vue'),
  [RouteEnum.MhxyAccount]: () => import('./mhxy/account/index.vue'),
  [RouteEnum.MhxyGoldRecord]: () => import('./mhxy/gold-record/index.vue'),
  [RouteEnum.MhxyGoldTransfer]: () => import('./mhxy/gold-transfer/index.vue'),
  [RouteEnum.Management_User]: () => import('./management/user/index.vue'),
  [RouteEnum.Management_Role]: () => import('./management/role/index.vue'),
  [RouteEnum.Management_Menu]: () => import('./management/menu/index.vue'),
  [RouteEnum.Setting_Common]: () => import('./setting/common/index.vue'),
};
