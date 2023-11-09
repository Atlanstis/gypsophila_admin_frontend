import { request } from '@/service';

/**
 * 登录
 * @param username - 用户名
 * @param password - 密码
 */
export function authLogin(username: string, password: string) {
  return request.post<{ token: string }>('/auth/login', { username, password });
}
