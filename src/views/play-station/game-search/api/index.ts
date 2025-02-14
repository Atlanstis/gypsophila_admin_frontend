import { request } from '@/service';

/** Psnine 游戏搜索 */
export function psnineGameSearch(title: string, page?: number) {
  return request.post<ResPsnine.GameSearch>('/psnine/game/search', {
    title,
    page: page || 1,
  });
}
