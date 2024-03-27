import { request } from '@/service';

/** 账号分组-列表 */
export function mhxyAccountGroupList(showItem: boolean) {
  return request.post<ApiMhxy.AccountGroup[]>('/mhxy/account/group/list', { showItem });
}

/** 账号分组-新增 */
export function mhxyAccountGroupAdd(group: BusinessMhxy.AccountGroupFormModel) {
  return request.post('/mhxy/account/group/add', group);
}

/** 账号分组-编辑 */
export function mhxyAccountGroupEdit(group: BusinessMhxy.AccountGroupFormModel) {
  return request.post('/mhxy/account/group/edit', group);
}

/** 账号分组-删除 */
export function mhxyAccountGroupDelete(id: ApiMhxy.AccountGroup['id']) {
  return request.post('/mhxy/account/group/delete', { id });
}
