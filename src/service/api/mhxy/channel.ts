import { request } from '@/service';

/** 途径-分页 */
export function mhxyChannelList() {
  return request.post<ApiMhxy.Channel[]>('/mhxy/channel/list', {});
}

/** 途径-新增 */
export function mhxyChannelAdd(category: BusinessMhxy.Channel) {
  return request.post('/mhxy/channel/add', category);
}

/** 途径-编辑 */
export function mhxyChannelEdit(category: BusinessMhxy.Channel) {
  return request.post('/mhxy/channel/edit', category);
}

/** 途径-删除 */
export function mhxyChannelDelete(id: ApiMhxy.Channel['id']) {
  return request.post('/mhxy/channel/delete', { id });
}
