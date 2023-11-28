import { request } from '@/service';

/**
 * 角色列表
 * @param page - 页码
 * @param size - 数量
 */
export function roleList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiManagement.Role[]>>('/role/list', { page, size });
}

/**
 * 新增角色
 * @param role 角色数据
 */
export function roleAdd(role: Pick<ApiManagement.Role, 'name'>) {
  return request.post('/role/add', role);
}

/**
 * 编辑角色
 * @param role 角色数据
 */
export function roleEdit(role: Pick<ApiManagement.Role, 'name' | 'id'>) {
  return request.post('/role/edit', role);
}

/**
 * 删除角色
 * @param role 角色数据
 */
export function roleDelete(role: Pick<ApiManagement.Role, 'id'>) {
  return request.get('/role/delete', role);
}

/**
 * 获取除超级管理员外的角色
 * @returns 角色列表
 */
export function roleListAssignable() {
  return request.get<ApiManagement.Role[]>('/role/list/assignable');
}
