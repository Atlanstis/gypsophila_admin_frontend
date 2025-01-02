export type MenuModel = Pick<ResMenu.Menu, 'name' | 'key' | 'type'> & {
  id: Common.Nullable<ResMenu.Menu['id']>;
  parentId: Common.Nullable<ResMenu.Menu['parentId']>;
};
