import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';

/** 获取存储在本地的 token */
export function getToken() {
  return localStorage.get(LocalKeyEnum.Token) || '';
}

/** 去除用户相关的本地缓存 */
export function clearAuthStorage() {
  localStorage.remove(LocalKeyEnum.Token);
  localStorage.remove(LocalKeyEnum.RefreshToken);
}
