import { request } from '@/service';

/**
 * 登录
 * @param username - 用户名
 * @param password - 密码
 */
export function authLogin(username: string, password: string) {
  return request.post<ApiAuth.Token>('/auth/login', { username, password });
}

/**
 * 通过 refreshToken 刷新认证信息
 * @param refreshToken - token
 */
export function authRefresh(refreshToken: string) {
  return request.post<ApiAuth.Token>('/auth/refresh', { refreshToken });
}
