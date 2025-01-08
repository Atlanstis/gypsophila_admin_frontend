import { request } from '@/service';

/** 获取系统信息 */
export function systemInfo() {
  return request.get<ResSystem.Info>('/system/info');
}

export * from '@/views/setting/common/api';
