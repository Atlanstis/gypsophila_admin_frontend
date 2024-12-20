import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import {
  handleAxiosError,
  handleBackendError,
  handleRefreshToken,
  handleResponseError,
  handleServiceResult,
} from './helper';
import { useAuthStore } from '@/stores';
import { RESPONSE_CODE } from './helper';

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

/**
 * 自定义 axios 实例
 */
export default class CustomAxiosInstance {
  /** axios 实例 */
  instance: AxiosInstance;
  isRefreshing: boolean;
  retryQueues: RefreshRequestQueue[];

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setInterceptor();
    this.isRefreshing = false;
    this.retryQueues = [];
  }

  /** 设置拦截器 */
  setInterceptor() {
    // 设置请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        if (config.headers) {
          const token = localStorage.get(LocalKeyEnum.Token) || '';
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null, null);
      },
    );
    // 设置响应拦截器
    this.instance.interceptors.response.use(
      (async (response) => {
        const { status, data, config } = response;
        if (status === 200) {
          const { code, data: innerData, msg } = data;
          if (RESPONSE_CODE.SUCCESS === code) {
            return handleServiceResult(null, innerData, msg);
          }
          // 尝试通过 refreshCode 刷新 token
          if (RESPONSE_CODE.RE_UNAUTHORIZED === code) {
            // 原始请求
            const originRequest = new Promise((resolve) => {
              this.retryQueues.push((refreshConfig: AxiosRequestConfig) => {
                config.headers.Authorization = refreshConfig.headers?.Authorization;
                resolve(this.instance.request(config));
              });
            });
            if (!this.isRefreshing) {
              this.isRefreshing = true;
              const refreshConfig = await handleRefreshToken(response.config);
              if (refreshConfig) {
                this.retryQueues.map((cb) => cb(refreshConfig));
              }
              this.retryQueues = [];
              this.isRefreshing = false;
            }
            return originRequest;
          }
          // 长时间未操作，返回登录页
          if (RESPONSE_CODE.UNAUTHORIZED === code) {
            const redirectUrl = window.location.pathname;
            const authStore = useAuthStore();
            authStore.resetAuthStore(redirectUrl);
          }
          const error = handleBackendError(data);
          return handleServiceResult(error, null, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null, null);
      }) as (response: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>,
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null, null);
      },
    );
  }
}
