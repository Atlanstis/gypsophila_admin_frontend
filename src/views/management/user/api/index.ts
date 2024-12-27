import { request } from '@/service';
import type { UserDto } from '../typing';

/**
 * 用户-页面配置
 */
export function userConfig() {
  return request.get<ResUser.Config>('/user/config');
}

/**
 * 用户列表
 * @param page - 页码
 * @param size - 数量
 */
export function userList(page: number, size: number) {
  return request.post<ResCommon.TableData<ResUser.UserListData>>('/user/list', { page, size });
}

/**
 * 新增用户
 * @param user 用户数据
 */
export function userAdd(user: UserDto) {
  return request.post('/user/add', user);
}

/**
 * 编辑用户
 * @param user 用户数据
 */
export function userEdit(user: UserDto) {
  return request.post('/user/edit', user);
}

/**
 * 删除用户
 * @param user 用户信息
 */
export function userDelete(id: UserDto['id']) {
  return request.get('/user/delete', { id });
}
