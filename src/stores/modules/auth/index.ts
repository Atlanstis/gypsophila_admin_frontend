import { authLogin } from '@/service';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { defineStore } from 'pinia';
import { useRouteStore } from '@/stores';
import { getToken } from './helper';
import { useRouterPush } from '@/composables';

interface AuthState {
  /** 登录加载中 */
  loginLoading: boolean;
  /** 认证 token */
  token: string;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    loginLoading: false,
    token: getToken(),
  }),

  getters: {
    /** 是否登录 */
    isLogin(): boolean {
      return !!this.token;
    },
  },

  actions: {
    /**
     * 用户名密码登录
     * @param username - 用户名
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loginLoading = true;
      const { data } = await authLogin(username, password);
      if (data) {
        await this.handleActionAfterLogin(data.token);
      }
      this.loginLoading = false;
    },

    /**
     * 处理登录后成功或失败的逻辑
     * @param token 认证 token
     */
    async handleActionAfterLogin(token: string) {
      localStorage.set(LocalKeyEnum.Token, token);
      this.token = token;

      // 获取授权路由
      const route = useRouteStore();
      await route.initAuthRoute();

      const { toLoginRedirect } = useRouterPush(false);
      // 跳转登录后的地址
      toLoginRedirect();
    },
  },
});
