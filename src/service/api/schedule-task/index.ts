import { request } from '@/service';

/**
 * 定时任务-列表
 * @param page - 页码
 * @param size - 数量
 */
export function scheduleTaskList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiScheduleTask.ScheduleTask[]>>('/schedule-task/list', {
    page,
    size,
  });
}

/**
 * 定时任务-立即执行
 */
export function scheduleTaskExecute(key: ApiScheduleTask.ScheduleTask['key']) {
  return request.post('/schedule-task/execute', {
    key,
  });
}

/**
 * 定时任务-关闭
 */
export function scheduleTaskClose(key: ApiScheduleTask.ScheduleTask['key']) {
  return request.post('/schedule-task/close', {
    key,
  });
}

/**
 * 定时任务-开启
 */
export function scheduleTaskOpen(key: ApiScheduleTask.ScheduleTask['key']) {
  return request.post('/schedule-task/open', {
    key,
  });
}
