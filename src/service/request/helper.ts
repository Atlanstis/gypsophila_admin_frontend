import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { exeStrategyActions, localStorage } from '@/utils';
import { authRefresh } from '../api';
import { LocalKeyEnum } from '@/enums';
import { useAuthStore } from '@/stores';
import { ResponseCode } from '@/typings';
import {
  DEFAULT_REQUEST_ERROR_CODE,
  DEFAULT_REQUEST_ERROR_MSG,
  ERROR_STATUS,
  NETWORK_ERROR_CODE,
  NETWORK_ERROR_MSG,
  REQUEST_TIMEOUT_CODE,
  REQUEST_TIMEOUT_MSG,
} from './config';

type ErrorStatus = keyof typeof ERROR_STATUS;

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

/** 统一失败和成功的请求结果的数据类型 */
export async function handleServiceResult<T = any>(
  error: Service.RequestError | null,
  data: any,
  msg: string | null,
) {
  if (error) {
    const fail: Service.FailedResult = {
      error,
      data: null,
    };
    return fail;
  }
  const success: Service.SuccessResult<T> = {
    error: null,
    data,
    msg: msg as string,
  };
  return success;
}

/**
 * 处理后端返回的错误(业务错误)
 * @param data - 后端接口的响应数据
 */
export function handleBackendError(data: Record<string, any>) {
  const error: Service.RequestError = {
    type: 'backend',
    code: data.code,
    msg: data.msg,
  };

  // showErrorMsg(error);
  console.log(error);
  return error;
}

/**
 * 处理请求成功后的错误
 * @param response - 请求的响应
 */
export function handleResponseError(response: AxiosResponse) {
  const error: Service.RequestError = {
    type: 'axios',
    code: DEFAULT_REQUEST_ERROR_CODE,
    msg: DEFAULT_REQUEST_ERROR_MSG,
  };

  if (!window.navigator.onLine) {
    // 网路错误
    Object.assign(error, { code: NETWORK_ERROR_CODE, msg: NETWORK_ERROR_MSG });
  } else {
    // 请求成功的状态码非200的错误
    const errorCode: ErrorStatus = response.status as ErrorStatus;
    const msg = ERROR_STATUS[errorCode] || DEFAULT_REQUEST_ERROR_MSG;
    Object.assign(error, { type: 'http', code: errorCode, msg });
  }

  // showErrorMsg(error);
  console.log(error);
  return error;
}

/**
 * 处理axios请求失败的错误
 * @param axiosError - 错误
 */
export function handleAxiosError(axiosError: AxiosError) {
  const error: Service.RequestError = {
    type: 'axios',
    code: DEFAULT_REQUEST_ERROR_CODE,
    msg: DEFAULT_REQUEST_ERROR_MSG,
  };

  const actions: Common.StrategyAction[] = [
    [
      // 网路错误
      !window.navigator.onLine || axiosError.message === 'Network Error',
      () => {
        Object.assign(error, { code: NETWORK_ERROR_CODE, msg: NETWORK_ERROR_MSG });
      },
    ],
    [
      // 超时错误
      axiosError.code === REQUEST_TIMEOUT_CODE && axiosError.message.includes('timeout'),
      () => {
        Object.assign(error, { code: REQUEST_TIMEOUT_CODE, msg: REQUEST_TIMEOUT_MSG });
      },
    ],
    [
      // 请求不成功的错误
      Boolean(axiosError.response),
      () => {
        const errorCode: ErrorStatus = (axiosError.response?.status as ErrorStatus) || 'DEFAULT';
        const msg = ERROR_STATUS[errorCode];
        Object.assign(error, { code: errorCode, msg });
      },
    ],
  ];

  exeStrategyActions(actions);

  // showErrorMsg(error);
  console.log(error);

  return error;
}
