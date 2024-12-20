import type { AxiosRequestConfig } from 'axios';
import { localStorage } from '@/utils';
import { authRefresh } from '@/service';
import { LocalKeyEnum } from '@/enums';

/**
 * 刷新token
 * @param axiosConfig - token 失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const refreshToken = localStorage.get(LocalKeyEnum.RefreshToken) || '';
  const { data, error } = await authRefresh(refreshToken);
  // 重签成功，将缓存的请求再次发送
  if (!error) {
    localStorage.set(LocalKeyEnum.Token, data.accessToken);
    localStorage.set(LocalKeyEnum.RefreshToken, data.refreshToken);

    if (axiosConfig.headers) {
      axiosConfig.headers.Authorization = data.accessToken;
    }
    return axiosConfig;
  }
  return null;
}
