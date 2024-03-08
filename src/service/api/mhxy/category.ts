import { request } from '@/service';

/** 获取道具种类数据 */
export function mhxyPropCategoryAll(isTransfer?: boolean) {
  const params: Record<string, any> = {};
  if (isTransfer !== undefined) {
    params.isTransfer = isTransfer;
  }
  return request.post<ApiMhxy.PropCategory[]>('/mhxy/gold-prop-category/all', params);
}

/** 获取道具种类数据-分页 */
export function mhxyPropCategoryList() {
  return request.post<ApiMhxy.PropCategory[]>('/mhxy/prop-category/list', {});
}

/** 道具种类-新增 */
export function mhxyPropCategoryAdd(category: BusinessMhxy.PropCategory) {
  return request.post('/mhxy/prop-category/add', category);
}

/** 道具种类-编辑 */
export function mhxyPropCategoryEdit(category: BusinessMhxy.PropCategory) {
  return request.post('/mhxy/prop-category/edit', category);
}

/** 道具种类-删除 */
export function mhxyPropCategoryDelete(id: ApiMhxy.PropCategory['id']) {
  return request.post('/mhxy/prop-category/delete', { id });
}
