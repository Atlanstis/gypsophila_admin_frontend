import { request } from '@/service';

/** 获取金币收支记录 */
export function mhxyAccountGoldRecordList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiMhxy.AccountGoldRecord[]>>(
    '/mhxy/account/gold-record/list',
    {
      page,
      size,
    },
  );
}

/** 新增金币收支记录 */
export function mhxyAccountGoldRecordAdd(record: BusinessMhxy.GoldRecordFormModal) {
  return request.post('/mhxy/account/gold-record/add', record);
}

/** 获取单条收支记录信息 */
export function mhxyAccountGoldRecordInfo(id: ApiMhxy.AccountGoldRecord['id']) {
  return request.post<BusinessMhxy.GoldRecordCompleteInfo>('/mhxy/account/gold-record/info', {
    id,
  });
}

/** 处理未完成金币收支记录 */
export function mhxyAccountGoldRecordComplete(dto: BusinessMhxy.GoldRecordCompleteFormModal) {
  return request.post('/mhxy/account/gold-record/complete', dto);
}
