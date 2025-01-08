import { request } from '@/service';

/** 更新网站信息 */
export function updateWebsiteInfo(info: ResSystem.WebsiteInfo) {
  return request.post('/setting/website/update', info);
}

/** 通用配置-获取权限下的配置 */
export function settingCommonTabs() {
  return request.get<ResSetting.CommonTab[]>('/setting/common/tabs');
}
