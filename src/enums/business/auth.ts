/**
 * 角色枚举，用于业务代码中判断
 */
export const enum BusinessRoleEnum {
  SuperAdmin = 1,
}

/**
 * 角色，是否内置
 */
export const enum RoleIsDefaultEnum {
  /** 内置角色 */
  YES = 1,
  /** 非内置角色 */
  NO = 0,
}
