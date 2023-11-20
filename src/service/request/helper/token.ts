import type { AxiosRequestConfig } from 'axios';
import { localStorage } from '@/utils';
import { authRefresh } from '@/service';
import { LocalKeyEnum } from '@/enums';
import { useAuthStore } from '@/stores';
import { ResponseCode } from '@/typings';

/**
 * 刷新token
 * @param axiosConfig - token 失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore();
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
  // 重签失败
  // 当 code 为 Unauthorized 时，相应的操作在之前的拦截器中已处理，不在再次进行重置数据处理
  // 为其它时，则进行数据的重置
  if (error.code !== ResponseCode.Unauthorized) {
    resetAuthStore();
  }
  return null;
}
