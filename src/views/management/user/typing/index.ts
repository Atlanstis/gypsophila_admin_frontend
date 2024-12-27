/** 用户-新增编辑 */
export type UserModel = Pick<ResUser.User, 'username' | 'nickname'> & {
  id: Common.Nullable<ResUser.User['id']>;
  password?: string;
  roleIds: number[];
};

export type UserDto = Omit<UserModel, 'password'> & {
  password?: Common.EncryptData | string;
};
