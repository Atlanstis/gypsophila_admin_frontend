/** 金币收支记录，计算方式 */
export const enum MHXY_GOLD_RECORD_AMOUNT_TYPE {
  /** 按涉及金额 */
  BY_AMOUNT = 0,
  /** 按账号现有金币数 */
  BY_ACCOUNT_NOW_AMOUNT = 1,
}

export const MHXY_GOLD_RECORD_AMOUNT_TYPE_OPT: {
  label: string;
  value: MHXY_GOLD_RECORD_AMOUNT_TYPE;
}[] = [
  { label: '按账号现有金币数', value: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT },
  { label: '按涉及金额', value: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT },
];

/** 金币收支记录，收支类型 */
export const enum MHXY_GOLD_RECORD_TYPE {
  /** 支出 */
  EXPENDITURE = 'expenditure',
  /** 收入 */
  REVENUE = 'revenue',
}

export const MHXY_GOLD_RECORD_TYPE_OPT: {
  label: string;
  value: MHXY_GOLD_RECORD_TYPE;
}[] = [
  { label: '收入', value: MHXY_GOLD_RECORD_TYPE.REVENUE },
  { label: '支出', value: MHXY_GOLD_RECORD_TYPE.EXPENDITURE },
];

/** 金币收支记录，状态 */
export const enum MHXY_GOLD_RECORD_STATUS {
  /** 完成 */
  COMPLETE = 1,
  /** 进行中 */
  IN_PROGRESS = 0,
}

export const MHXY_GOLD_RECORD_STATUS_OPT: {
  label: string;
  value: MHXY_GOLD_RECORD_STATUS;
}[] = [
  { label: '完成', value: MHXY_GOLD_RECORD_STATUS.COMPLETE },
  { label: '进行中', value: MHXY_GOLD_RECORD_STATUS.IN_PROGRESS },
];

/** 收支记录处理操作 */
export const enum MHXY_GOLD_RECORD_COMPLETE_STATUS {
  /** 完成 */
  COMPLETE = 1,
  /** 撤销 */
  REVOKE = 0,
}

export const MHXY_GOLD_RECORD_COMPLETE_STATUS_OPT: {
  label: string;
  value: MHXY_GOLD_RECORD_COMPLETE_STATUS;
}[] = [
  { label: '完成', value: MHXY_GOLD_RECORD_COMPLETE_STATUS.COMPLETE },
  { label: '撤销', value: MHXY_GOLD_RECORD_COMPLETE_STATUS.REVOKE },
];
