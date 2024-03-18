import { request } from '@/service';

/** 道具种类-数据 */
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
