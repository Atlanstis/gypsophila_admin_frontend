import { request } from '@/service';

/** 转金-新增 */
export function mhxyAccountGoldTransferAdd(record: BusinessMhxy.GoldTransferFormModal) {
  return request.post('/mhxy/account/gold-transfer/add', record);
}

/** 转金-列表 */
export function mhxyAccountGoldTransferList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiMhxy.AccountGoldTransfer[]>>(
    '/mhxy/account/gold-transfer/list',
    {
      page,
      size,
    },
  );
}

/** 转金-单条信息 */
export function mhxyAccountGoldTransferInfo(id: ApiMhxy.AccountGoldTransfer['id']) {
  return request.post<ApiMhxy.AccountGoldTransferGem>('/mhxy/account/gold-transfer/info', {
    id,
  });
}

/** 转金-完成 */
export function mhxyAccountGoldTransferFinish(dto: BusinessMhxy.GoldTransferFinishFormModal) {
  return request.post<ApiMhxy.AccountGoldTransfer>('/mhxy/account/gold-transfer/finish', dto);
}
