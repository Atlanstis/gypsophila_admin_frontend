import { request } from '@/service';
import type { Notice } from '@/typings';

/**
 * 系统顶部通知列表
 */
export function ApiNoticePolymeric() {
  return request.get<Notice[]>('/notice/polymeric');
}
