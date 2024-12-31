/** 角色新增/编辑 表单数据*/
export type RoleModel = Pick<ResRole.Role, 'name' | 'desc'> & {
  id: Common.Nullable<ResRole.Role['id']>;
};

/** 权限设置数据 */
export type RoleMenuPermission = Exclude<ResMenu.Menu, 'children'> & {
  permissions: ResMenu.MenuPermission[];
  children: RoleMenuPermission[];
};

export type MenuPermissions = { menuId: number; permissionIds: number[] }[];
