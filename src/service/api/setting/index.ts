import { request } from '@/service';

/** 获取网站信息 */
export function getWebsiteInfo() {
  return request.get<ApiSetting.Website>('/setting/website/info');
}

/** 更新网站信息 */
export function updateWebsiteInfo(info: ApiSetting.Website) {
  return request.post('/setting/website/update', info);
}

/** 通用配置-获取权限下的配置 */
export function settingCommonTabs() {
  return request.get<string[]>('/setting/common/tabs');
}
