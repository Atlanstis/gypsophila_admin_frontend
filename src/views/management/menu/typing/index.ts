export type MenuModel = Pick<
  ResMenu.Menu,
  | 'name'
  | 'key'
  | 'type'
  | 'order'
  | 'icon'
  | 'iconLocal'
  | 'path'
  | 'layout'
  | 'keepAlive'
  | 'hideInMenu'
  | 'activeMenu'
> & {
  id: Common.Nullable<ResMenu.Menu['id']>;
  parentId: Common.Nullable<ResMenu.Menu['parentId']>;
};
