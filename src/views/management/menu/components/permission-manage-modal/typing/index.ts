export type MenuPermissionModel = Pick<
  ResMenu.MenuPermission,
  'alias' | 'key' | 'name' | 'order'
> & {
  id: Common.Nullable<ResMenu.MenuPermission['id']>;
};
