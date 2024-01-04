import { request } from '@/service';

/** Psnine 游戏搜索 */
export function psnineGameSearch(keyword: string, page?: number) {
  return request.post<ApiCommon.TableData<Psnine.SearchGame[]>>('/psnine/game/search', {
    keyword,
    page: page || 1,
  });
}

/** Psnine 游戏详情 */
export function psnineGameDetail(id: number) {
  return request.post<Psnine.GameDetail>('/psnine/game/detail', {
    id,
  });
}

/** Psnine 游戏主题 */
export function psnineGameTopic(id: number) {
  return request.get<ApiCommon.TableData<Psnine.GameTopic[]>>('/psnine/game/topic', { id });
}

/** Psnine 游戏排名 */
export function psnineGameRank(id: number) {
  return request.post<ApiCommon.TableData<Psnine.GameRank[]>>('/psnine/game/rank', { id });
}
