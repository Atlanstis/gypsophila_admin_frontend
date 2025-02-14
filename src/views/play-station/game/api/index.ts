import { request } from '@/service';

/** ps 游戏列表 */
export function psGameList(page: number, size: number) {
  return request.post<ResCommon.TableData<PlayStation.Game>>('/ps/game/list', { page, size });
}
