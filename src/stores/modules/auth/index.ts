import { authLogin } from '@/service';
import { hybridEncrypt, localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { defineStore } from 'pinia';
import { useRouteStore } from '@/stores';
import { clearAuthStorage, getToken } from './helper';
import { useRouterPush } from '@/composables';
import { nextTick } from 'vue';

interface AuthState {
  /** 登录加载中 */
  loginLoading: boolean;
  /** 认证 token */
  token: string;
  userInfo?: ResAuth.User;
  /** 加密-publicKey */
  publicKey: string;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    loginLoading: false,
    token: getToken(),
    userInfo: undefined,
    publicKey: '',
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
      const routeStore = useRouteStore();

      clearAuthStorage();
      this.$reset();

      toLogin(redirect);

      nextTick(() => {
        routeStore.resetRouteStore();
      });
    },

    /**
     * 用户名密码登录
     * @param username - 用户名
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loginLoading = true;
      const passwordEncrypted = await this.encrypt(password);
      const { error, data, msg } = await authLogin(username, passwordEncrypted);
      if (!error) {
        window.$message?.success(msg);
        await this.handleActionAfterLogin(data.accessToken, data.refreshToken);
      }
      this.loginLoading = false;
    },

    /**
     * 混合加密
     * @param str 需加密数据
     */
    async encrypt(str: string) {
      return await hybridEncrypt(str, this.publicKey);
    },

    /**
     * 处理登录后成功或失败的逻辑
     * @param token 认证 token
     */
    async handleActionAfterLogin(accessToken: string, refreshToken: string) {
      localStorage.set(LocalKeyEnum.Token, accessToken);
      localStorage.set(LocalKeyEnum.RefreshToken, refreshToken);
      this.token = accessToken;

      // 获取授权路由
      const route = useRouteStore();
      await route.initAuthRoute();

      const { toLoginRedirect } = useRouterPush(false);
      // 跳转登录后的地址
      toLoginRedirect();
    },

    /** 设置用户信息 */
    setUserInfo(userInfo: ResAuth.User) {
      this.userInfo = userInfo;
    },

    /** 设置 publicKey */
    setPublicKey(publicKey: string) {
      this.publicKey = publicKey;
    },
  },
});
