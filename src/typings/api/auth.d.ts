declare namespace ApiAuth {
  /** 授权信息 */
  interface Token {
    accessToken: string;
    refreshToken: string;
  }

  /** 用户信息 */
  interface UserInfo {
    /** 用户 Id */
    id: string;
    /** 用户名 */
    username: string;
    /** 头像 */
    avatar?: string;
    /** 昵称 */
    nickname: string;
    /** 角色列表 */
    roles: number[];
    /** 菜单 */
    menus: PageRoute.AllRouteName[];
  }
}
