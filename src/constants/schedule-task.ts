/** 定时任务状态 */
export const enum SCHEDULE_TASK_STATUS {
  /** 未生效 */
  INACTIVE = 'inactive',
  /** 已开启 */
  OPEN = 'open',
  /** 执行中 */
  IN_PROGRESS = 'inProgress',
  /** 已关闭 */
  CLOSE = 'close',
}

/** 定时任务状态选项 */
export const SCHEDULE_TASK_STATUS_OPT: { label: string; value: SCHEDULE_TASK_STATUS }[] = [
  { label: '未生效', value: SCHEDULE_TASK_STATUS.INACTIVE },
  { label: '已开启', value: SCHEDULE_TASK_STATUS.OPEN },
  { label: '执行中', value: SCHEDULE_TASK_STATUS.IN_PROGRESS },
  { label: '已关闭', value: SCHEDULE_TASK_STATUS.CLOSE },
];
