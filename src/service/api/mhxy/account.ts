import { request } from '@/service';

/** 获取角色数据 */
export function mhxyAccountRole() {
  return request.get<ApiMhxy.AccountRole[]>('/mhxy/account/role');
}

/** 获取门派数据 */
export function mhxyAccountSect() {
  return request.get<ApiMhxy.AccountSect[]>('/mhxy/account/sect');
}

/** 获取账号数据 */
export function mhxyAccountList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiMhxy.Account[]>>('/mhxy/account/list', { page, size });
}

/** 获取所有账号数据 */
export function mhxyAccountAll() {
  return request.post<ApiMhxy.Account[]>('/mhxy/account/all');
}

/** 新增账号数据 */
export function mhxyAccountAdd(dto: Partial<BusinessMhxy.AccountFormModel>) {
  return request.post('/mhxy/account/add', dto);
}

/** 编辑账号数据 */
export function mhxyAccountEdit(dto: Partial<BusinessMhxy.AccountFormModel>) {
  return request.post('/mhxy/account/edit', dto);
}

/** 删除账号数据 */
export function mhxyAccountDelete(id: ApiMhxy.Account['id']) {
  return request.post('/mhxy/account/delete', { id });
}
