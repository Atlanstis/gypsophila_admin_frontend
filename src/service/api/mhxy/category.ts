import { request } from '@/service';

/** 获取贸易种类数据 */
export function mhxyGoldTradeCategoryList(isTransfer?: boolean) {
  const params: Record<string, any> = {};
  if (isTransfer !== undefined) {
    params.isTransfer = isTransfer;
  }
  return request.post<ApiMhxy.GoldTradeCategory[]>('/mhxy/gold-trade-category/list', params);
}
