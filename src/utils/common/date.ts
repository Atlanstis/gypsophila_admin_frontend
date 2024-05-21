import dayjs from 'dayjs';

const YYYY_MM_DD = 'YYYY-MM-DD';

/** 将 ms 转换成日期格式 */
export function transformMsToDateStr(ms: number) {
  return dayjs(ms).format(YYYY_MM_DD);
}
