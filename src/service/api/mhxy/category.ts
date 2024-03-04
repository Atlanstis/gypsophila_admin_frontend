import { request } from '@/service';

/** 获取贸易种类数据 */
export function mhxyGoldTradeCategoryList() {
  return request.get<ApiMhxy.GoldTradeCategory[]>('/mhxy/gold-trade-category/list');
}
