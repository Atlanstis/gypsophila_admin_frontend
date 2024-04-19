/** 转金状态 */
export const enum MHXY_GOLD_TRANSFER_STATUS {
  /** 进行中 */
  PROGRESS = 'progress',
  /** 转金成功 */
  SUCCESS = 'success',
  /** 转金失败，转出账号金币被锁 */
  FAIL_FROM_LOCK = 'fail_from_lock',
}
/** 转金状态-对应文字*/
export const MHXY_GOLD_TRANSFER_STATUS_TEXT: Record<MHXY_GOLD_TRANSFER_STATUS, string> = {
  [MHXY_GOLD_TRANSFER_STATUS.PROGRESS]: '进行中',
  [MHXY_GOLD_TRANSFER_STATUS.SUCCESS]: '转金成功',
  [MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK]: '转金失败，转出账号金币被锁',
};

/** 转金-操作选项 */
export const MHXY_GOLD_TRANSFER_STATUS_OPT: { label: string; value: MHXY_GOLD_TRANSFER_STATUS }[] =
  [
    {
      label: MHXY_GOLD_TRANSFER_STATUS_TEXT[MHXY_GOLD_TRANSFER_STATUS.SUCCESS],
      value: MHXY_GOLD_TRANSFER_STATUS.SUCCESS,
    },
    {
      label: MHXY_GOLD_TRANSFER_STATUS_TEXT[MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK],
      value: MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK,
    },
  ];

/** 转金策略应用状态 */
export const enum ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS {
  /** 开启 */
  OPEN = 'open',
  /** 关闭 */
  CLOSE = 'close',
}
