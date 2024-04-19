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

/** 转金策略应用-新增 */
export function mhxyGoldTransferPolicyApplyAdd(
  record: BusinessMhxy.GoldTransferPolicyApplyFormModel,
) {
  return request.post('/mhxy/gold-transfer/policy/apply/add', record);
}

/** 转金策略应用-编辑 */
export function mhxyGoldTransferPolicyApplyEdit(
  record: BusinessMhxy.GoldTransferPolicyApplyFormModel,
) {
  return request.post('/mhxy/gold-transfer/policy/apply/edit', record);
}

/** 转金策略应用-列表 */
export function mhxyGoldTransferPolicyApplyList(
  page: number,
  size: number,
  policyId: ApiMhxy.GoldTransferPolicy['id'],
) {
  return request.post<ApiCommon.TableData<ApiMhxy.GoldTransferPolicyApply[]>>(
    '/mhxy/gold-transfer/policy/apply/list',
    { page, size, policyId },
  );
}

/** 转金策略应用-删除 */
export function mhxyGoldTransferPolicyApplyDelete(id: ApiMhxy.GoldTransferPolicyApply['id']) {
  return request.post('/mhxy/gold-transfer/policy/apply/delete', { id });
}
