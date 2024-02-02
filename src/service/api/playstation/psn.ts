import { request } from '@/service';

/** 获取 psn 个人信息 */
export function psnProfile() {
  return request.get<ApiPsn.Profile | null>('/psn/profile');
}

/** psnId 绑定 */
export function psnProfileBind(psnId: Pick<ApiPsn.Profile, 'psnId'>['psnId']) {
  return request.post('/psn/profile/bind', { psnId });
}

/** 获取可同步的游戏列表 */
export function psnSynchronizeableGame(page: number) {
  return request.post<ApiCommon.TableData<Psnine.SyncGame[]>>('/psn/game/synchronizeable', {
    page,
  });
}

/** 同步游戏 */
export function psnGameSync(gameId: number) {
  return request.post('/psn/game/sync', {
    gameId,
  });
}

/** 获取用户已同步的游戏列表 */
export function psnGameSynchronized(page: number) {
  return request.post<ApiCommon.TableData<ApiPsn.ProfileGame[]>>('/psn/game/synchronized', {
    page,
  });
}

/** 收藏/取消收藏 游戏 */
export function psnGameFavor(ppgId: string) {
  return request.post('/psn/game/favor', { ppgId });
}

/** 收藏游戏列表 */
export function psnGameFavorList() {
  return request.get<ApiPsn.ProfileGame[]>('/psn/game/favor/list');
}

/** 获取游戏列表 */
export function psnGameList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiPsn.Game[]>>('/psn/game/list', { page, size });
}

/** 获取用户的游戏信息 */
export function psnProfileGame(ppgId: string) {
  return request.post<ApiPsn.ProfileGame>('/psn/profile/game', { ppgId });
}
