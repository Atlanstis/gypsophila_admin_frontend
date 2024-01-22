import { request } from '@/service';

/** 获取 psn 个人信息 */
export function psnProfile() {
  return request.get<ApiPsn.Profile | null>('/psn/profile');
}

/** psnId 绑定 */
export function psnProfileBind(psnId: Pick<ApiPsn.Profile, 'psnId'>['psnId']) {
  return request.post('/psn/profile/bind', { psnId });
}
