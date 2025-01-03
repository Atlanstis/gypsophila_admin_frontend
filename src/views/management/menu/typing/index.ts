export type MenuModel = Pick<ResMenu.Menu, 'name' | 'key' | 'type' | 'order'> & {
  id: Common.Nullable<ResMenu.Menu['id']>;
  parentId: Common.Nullable<ResMenu.Menu['parentId']>;
};
