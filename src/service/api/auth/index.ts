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

/**
 * 获取已登录用户信息
 */
export function authInfo() {
  return request.get<ApiAuth.UserInfo>('/auth/info');
}

/**
 * 退出登录
 */
export function authLogout() {
  return request.get<null>('/auth/logout');
}
