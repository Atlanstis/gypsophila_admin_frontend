declare namespace ApiScheduleTask {
  /** 定时任务 */
  interface ScheduleTask {
    id: number;
    /** 任务唯一标识 */
    key: string;
    /** 任务名称 */
    name: string;
    /** 任务描述 */
    description: string;
    /** 执行周期 */
    cycle: string;
    /** 状态 */
    status: 'inactive' | 'open' | 'inProgress' | 'close';
    /** 上次执行时间 */
    lastRunTime: Date;
  }

  /** 执行日志 */
  interface ScheduleTaskLog {
    id: number;
    /** 执行时间 */
    executionTime: Date;
    /** 耗时(秒) */
    consumingTime: number;
    /** 执行状态 */
    status: 'success' | 'fail';
    /** 执行结果 */
    result: string;
  }
}
