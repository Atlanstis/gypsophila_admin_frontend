import { request } from '@/service';

/** Psnine 游戏搜索 */
export function psnineGameSearch(keyword: string, page?: number) {
  return request.post<ApiCommon.TableData<Psnine.SearchPsGame[]>>('/psnine/game/search', {
    keyword,
    page: page || 1,
  });
}
