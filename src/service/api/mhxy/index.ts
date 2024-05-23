export * from './account';
export * from './category';
export * from './account-gold-record';
export * from './account-gold-transfer';
export * from './channel';
export * from './account-group';
export * from './gold-transfer-policy';

import { request } from '@/service';

/** 计算除去交易税后的价格 */
export function mhxyAmountCalc(amount: number) {
  return request.post<number>('/mhxy/amount/calc', { amount });
}
