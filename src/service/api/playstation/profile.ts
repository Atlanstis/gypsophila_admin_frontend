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
  return request.post<ApiCommon.TableData<Psnine.SyncGame[]>>('/psn/synchronizeable/game', {
    page,
  });
}
