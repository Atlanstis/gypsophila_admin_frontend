import { request } from '@/service';

/** 用户信息 */
export function psProfileInfo() {
  return request.get<Util.Nullable<ResPsProfile.Info>>('/ps/profile/info');
}

/** 绑定 PSN 账号 */
export function psProfileBind(psnId: PlayStation.Profile['psnId']) {
  return request.post('/ps/profile/bind', { psnId });
}

/** 游戏列表 */
export function psProfileGameList(page: number, size: number) {
  return request.post<ResPsProfile.GameList>('/ps/profile/game/list', {
    page,
    size,
  });
}

/** 获取 Psnine 上对应 PSN ID 的游戏列表数据 */
export function psProfilePsnineGameList(page: number) {
  return request.post<ResPsProfile.PsnineGameList>('/ps/profile/psnine/game/list', {
    page,
  });
}

/** 同步游戏 */
export function psProfilePsnineGameSync(id: number) {
  return request.post('/ps/profile/psnine/game/sync', {
    id,
  });
}
