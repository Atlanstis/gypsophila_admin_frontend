import { request } from '@/service';

export function mhxyAreaList() {
  return request.get<ApiMhxy.Area[]>('/mhxy/area/list', {});
}

export function mhxyAreaAdd(area: any) {
  return request.post('/mhxy/area/add', area);
}

export function mhxyAreaEdit(area: any) {
  return request.post('/mhxy/area/edit', area);
}

export function mhxyAreaDelete(id: ApiMhxy.Channel['id']) {
  return request.post('/mhxy/area/delete', { id });
}
