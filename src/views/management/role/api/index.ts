import { request } from '@/service';
import type { RoleModel } from '../typings';

/**
 * 角色-页面配置
 */
export function roleConfig() {
  return request.get<ResRole.Config>('/role/config');
}

/**
 * 角色列表
 * @param page - 页码
 * @param size - 数量
 */
export function roleList(page: number, size: number) {
  return request.post<ResCommon.TableData<ResRole.RoleListData>>('/role/list', { page, size });
}

/**
 * 新增角色
 * @param role 角色数据
 */
export function roleAdd(role: RoleModel) {
  return request.post('/role/add', role);
}

/**
 * 编辑角色
 * @param role 角色数据
 */
export function roleEdit(role: RoleModel) {
  return request.post('/role/edit', role);
}

/**
 * 删除角色
 * @param role 角色数据
 */
export function roleDelete(role: Pick<ResRole.Role, 'id'>) {
  return request.get('/role/delete', role);
}

/**
 * 获取可以分配的角色
 * @returns 角色列表
 */
export function roleAssignable() {
  return request.get<ResRole.Role[]>('/role/assignable');
}

/**
 * 获取该角色的菜单及权限
 * @param role 角色
 * @returns 可以角色的菜单及权限
 */
export function roleMenuPermission(role: Pick<ResRole.Role, 'id'>) {
  return request.post<ResRole.MenuPermission>('/role/menu/permission', role);
}

/**
 * 编辑该角色可以访问的菜单及权限
 * @param params 角色id 及 菜单
 */
export function roleMenuPermissionEdit(params: { id: number; mps: ResRole.MenuPermission['mps'] }) {
  return request.post('/role/menu/permission/edit', params);
}
