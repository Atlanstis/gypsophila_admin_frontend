/** 字段长度限制 */
export type NumberLimit = [number, number];

export type Gaps = [columnGap: number, rowGap: number];

/** 布局配置 */
export interface SettingConfig {
  /** 列数 */
  columns: number;
  /** 行数 */
  rows: number;
  /** 单元格高度 */
  cellHeight: number;
  /** 间距 */
  gaps: Gaps;
  /** 字段限制 */
  limit: {
    rows: NumberLimit;
    columns: NumberLimit;
    cellHeight: NumberLimit;
    gaps: NumberLimit;
  };
}

/** 布局配置表单 */
export type SettingFormModel = Partial<
  Omit<SettingConfig, 'limit' | 'gaps'> & {
    columnGap: number;
    rowGap: number;
  }
>;
