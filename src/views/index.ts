import { RouteEnum } from '@/enums';

/** 路由页面 */
export const Views: Record<PageRoute.HasPageRoute, Common.Component> = {
  [RouteEnum.NotFound]: () => import('./__function__/not-found/index.vue'),
  [RouteEnum.Login]: () => import('./login/index.vue'),
  [RouteEnum.Workbench]: () => import('./workbench/index.vue'),
  [RouteEnum.PlayStation_Game]: () => import('./play-station/game/index.vue'),
  [RouteEnum.PlayStation_Trophy]: () => import('./play-station/trophy/index.vue'),
  [RouteEnum.PlayStation_Search]: () => import('./play-station/search/index.vue'),
};
