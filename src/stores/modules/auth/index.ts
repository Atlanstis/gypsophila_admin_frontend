import { authLogin } from '@/service';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { defineStore } from 'pinia';
import { useRouteStore } from '@/stores';
import { clearAuthStorage, getToken } from './helper';
import { useRouterPush } from '@/composables';
import { nextTick } from 'vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

interface AuthState {
  /** 登录加载中 */
  loginLoading: boolean;
  /** 认证 token */
  token: string;
  userInfo?: ApiAuth.UserInfo;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    loginLoading: false,
    token: getToken(),
    userInfo: undefined,
  }),

  getters: {
    /** 是否登录 */
    isLogin(state): boolean {
      return !!state.token;
    },
  },

  actions: {
    /**
     * 重置认证信息
     * @param redirect 返回登录页时附加的跳转地址，空字符串代表不附带地址
     */
    resetAuthStore(redirect?: string) {
      const { toLogin } = useRouterPush(false);
      const { resetRouteStore } = useRouteStore();

      clearAuthStorage();
      this.$reset();

      toLogin(redirect);

      nextTick(() => {
        resetRouteStore();
      });
    },

    /**
     * 用户名密码登录
     * @param username - 用户名
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loginLoading = true;
      const { error, data } = await authLogin(username, password);
      if (!error) {
        await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
    },

    /**
     * 处理登录后成功或失败的逻辑
     * @param token 认证 token
     */
    async handleActionAfterLogin(data: ApiAuth.Token) {
      localStorage.set(LocalKeyEnum.Token, data.accessToken);
      localStorage.set(LocalKeyEnum.RefreshToken, data.refreshToken);
      this.token = data.accessToken;

      // 获取授权路由
      const route = useRouteStore();
      await route.initAuthRoute();

      const { toLoginRedirect } = useRouterPush(false);
      // 跳转登录后的地址
      toLoginRedirect();

      // 登录成功弹出提示
      if (route.isInitAuthRoute) {
        window.$message?.success('登录成功', { duration: DEFAULT_MESSAGE_DURATION });
      }
    },

    /** 设置用户信息 */
    setUserInfo(userInfo: ApiAuth.UserInfo) {
      this.userInfo = userInfo;
    },
  },
});
