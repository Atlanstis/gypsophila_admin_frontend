import { request } from '@/service';

/**
 * 用户列表
 * @param page - 页码
 * @param size - 数量
 */
export function userList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiManagement.User[]>>('/user/list', { page, size });
}

/**
 * 新增用户
 * @param user 用户数据
 */
export function userAdd(user: BusinessManagement.UserModel) {
  return request.post<null>('/user/add', user);
}

/**
 * 编辑用户
 * @param user 用户数据
 */
export function userEdit(user: BusinessManagement.UserModel) {
  return request.post<null>('/user/edit', user);
}

/**
 * 删除用户
 * @param user 用户信息
 * @returns
 */
export function userDelete(user: Pick<BusinessManagement.UserModel, 'id'>) {
  return request.get<null>('/user/delete', user);
}
