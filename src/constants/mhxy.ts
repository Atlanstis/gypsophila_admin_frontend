/** 珍品转金完成状态选项 */
export const GoldTransferFinishStatsOpt: {
  label: string;
  value: BusinessMhxy.GoldTransferFinishStatus;
}[] = [
  { label: '成功', value: 'success' },
  { label: '失败-发起方金币被锁', value: 'fail-from-lock' },
];
