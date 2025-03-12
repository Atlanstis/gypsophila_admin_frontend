import { Enum_Route } from '@/constants';

/** 路由页面 */
export const Views: Record<string, Common.AsyncComponent> = {
  [Enum_Route.NotFound]: () => import('./__function__/not-found/index.vue'),
  [Enum_Route.Login]: () => import('./login/index.vue'),
  /** 工作台 */
  Workbench: () => import('./workbench/index.vue'),
  /** PlayStation 账号概览 */
  PlayStation_Profile: () => import('./play-station/profile/index.vue'),
  /** PlayStation 游戏概览 */
  PlayStation_Profile_Game: () => import('./play-station/profile-game/index.vue'),
  /** PlayStation 游戏列表 */
  PlayStation_Game: () => import('./play-station/game/index.vue'),
  /** PlayStation 游戏查找 */
  PlayStation_Game_Search: () => import('./play-station/game-search/index.vue'),
  /** 用户管理 */
  Management_User: () => import('./management/user/index.vue'),
  /** 角色管理 */
  Management_Role: () => import('./management/role/index.vue'),
  /** 菜单管理 */
  Management_Menu: () => import('./management/menu/index.vue'),
  /** 通用设置 */
  Setting_Common: () => import('./setting/common/index.vue'),
};
