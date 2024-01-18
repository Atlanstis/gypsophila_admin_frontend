/** 本地存储相关 */
declare namespace StorageSpace {
  /** 本地存储的键值类型 */
  interface Local {
    /** 认证 token */
    token: string;
    /** 刷新 token */
    refreshToken: string;
    /** admin 菜单折叠状态 */
    adminMenuCollapsed: boolean;
    /** 登录页-记住我 */
    loginRememberMe: boolean;
    /** 登录页-登录信息 */
    loginInfo: {
      username: string;
      password: string;
    };
  }

  /** 存储数据格式 */
  interface Data<T> {
    value: T;
    expire: number | null;
  }
}
