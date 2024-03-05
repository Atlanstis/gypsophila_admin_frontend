import { request } from '@/service';

/** 转金-新增 */
export function mhxyAccountGoldTransferAdd(record: BusinessMhxy.AccountGoldTransferFormModal) {
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
