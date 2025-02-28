/** 角色新增/编辑 表单数据*/
export type RoleModel = Pick<ResRole.Role, 'name' | 'desc'> & {
  id: Common.Nullable<ResRole.Role['id']>;
};
