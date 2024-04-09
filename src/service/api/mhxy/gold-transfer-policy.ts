import { request } from '@/service';

/** 转金策略-新增 */
export function mhxyGoldTransferPolicyAdd(record: BusinessMhxy.GoldTransferPolicyFormModel) {
  return request.post('/mhxy/gold-transfer/policy/add', record);
}

/** 转金策略-编辑 */
export function mhxyGoldTransferPolicyEdit(record: BusinessMhxy.GoldTransferPolicyFormModel) {
  return request.post('/mhxy/gold-transfer/policy/edit', record);
}

/** 转金策略-分页 */
export function mhxyGoldTransferPolicyList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiMhxy.GoldTransferPolicy[]>>(
    '/mhxy/gold-transfer/policy/list',
    { page, size },
  );
}

/** 转金策略-删除 */
export function mhxyGoldTransferPolicyDelete(id: ApiMhxy.GoldTransferPolicy['id']) {
  return request.post('/mhxy/gold-transfer/policy/delete', { id });
}
