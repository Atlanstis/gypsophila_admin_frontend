declare namespace BusinessManagement {
  /** 菜单-权限控制 */
  type RoleMenuPermission = Exclude<ApiManagement.Menu, 'children'> & {
    permissions: ApiManagement.Permission[];
    children: RoleMenuPermission[];
  };

  /** 菜单-新增编辑 */
  type MenuFormModal = Omit<ApiManagement.Menu, 'children' | 'parent'> & {
    parentId: ApiManagement.Menu['id'] | null;
  };
}
