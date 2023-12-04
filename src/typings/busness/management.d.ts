declare namespace BusinessManagement {
  /** 用户-新增编辑 */
  type UserModel = Pick<ApiManagement.User, 'username' | 'nickname' | 'id'> & {
    /**密码 */
    password?: string;
    /**角色 Id */
    role: number | null;
  };

  /** 菜单-权限控制 */
  type RoleMenuPermission = Exclude<ApiManagement.Menu, 'children'> & {
    permissions: ApiManagement.Permission[];
    children: RoleMenuPermission[];
  };
}
