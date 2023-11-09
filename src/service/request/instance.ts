import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { LocalKeyEnum, localStorage } from '@/utils';

/**
 * 自定义 axios 实例
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.setInterceptor();
  }

  /** 设置拦截器 */
  setInterceptor() {
    // 设置请求拦截器
    this.instance.interceptors.request.use((config) => {
      if (config.headers) {
        const token = localStorage.get(LocalKeyEnum.Token) || '';
        config.headers.Authorization = token;
      }
      return config;
    });
    // 设置响应拦截器
    this.instance.interceptors.response.use((response) => {
      const { status, data } = response;
      if (status === 200) {
        return data;
      }
    });
  }
}
