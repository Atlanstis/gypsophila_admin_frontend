import { request } from '@/service';

/**
 * 获取可以分配的角色
 * @returns 角色列表
 */
export function roleAssignable() {
  return request.get<ResRole.Role[]>('/role/assignable');
}
