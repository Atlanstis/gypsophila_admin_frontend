import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';

/** 获取存储在本地的 token */
export function getToken() {
  return localStorage.get(LocalKeyEnum.Token) || '';
}
