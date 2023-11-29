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
 * 获取该角色可以访问的菜单
 * @param role 角色
 * @returns 可以访问的菜单
 */
export function roleMenu(role: Pick<ApiManagement.Role, 'id'>) {
  return request.post<string[]>('/role/menu', role);
}

/**
 * 编辑该角色可以访问的菜单
 * @param params 角色id 及 菜单
 */
export function roleMenuEdit(params: Pick<ApiManagement.Role, 'id'> & { menus: string[] }) {
  return request.post('/role/menu/edit', params);
}
/**
 * 获取除超级管理员外的角色
 * @returns 角色列表
 */
export function roleListAssignable() {
  return request.get<ApiManagement.Role[]>('/role/list/assignable');
}
