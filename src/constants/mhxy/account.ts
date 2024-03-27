/** 账号状态 */
export const enum MHXY_ACCOUNT_STATUS {
  /** 活跃中 */
  ACTIVE = 'active',
  /** 被封禁 */
  BANNED = 'banned',
}

export const MHXY_ACCOUNT_STATUS_OPT: {
  label: string;
  value: MHXY_ACCOUNT_STATUS;
}[] = [
  { label: '活跃中', value: MHXY_ACCOUNT_STATUS.ACTIVE },
  { label: '被封禁', value: MHXY_ACCOUNT_STATUS.BANNED },
];
