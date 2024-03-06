import { request } from '@/service';

/** 获取贸易种类数据 */
export function mhxyGoldTradeCategoryAll(isTransfer?: boolean) {
  const params: Record<string, any> = {};
  if (isTransfer !== undefined) {
    params.isTransfer = isTransfer;
  }
  return request.post<ApiMhxy.GoldTradeCategory[]>('/mhxy/gold-trade-category/all', params);
}

/** 获取贸易种类数据-分页 */
export function mhxyGoldTradeCategoryList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiMhxy.GoldTradeCategory[]>>(
    '/mhxy/gold-trade-category/list',
    { page, size },
  );
}

/** 贸易种类-新增 */
export function mhxyGoldTradeCategoryAdd(category: BusinessMhxy.GoldTradeCategory) {
  return request.post('/mhxy/gold-trade-category/add', category);
}

/** 贸易种类-编辑 */
export function mhxyGoldTradeCategoryEdit(category: BusinessMhxy.GoldTradeCategory) {
  return request.post('/mhxy/gold-trade-category/edit', category);
}

/** 贸易种类-删除 */
export function mhxyGoldTradeCategoryDelete(id: ApiMhxy.GoldTradeCategory['id']) {
  return request.post('/mhxy/gold-trade-category/delete', { id });
}
