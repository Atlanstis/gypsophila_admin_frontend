/** 字段长度限制 */
export type NumberLimit = [number, number];

/** 间距[列间距, 行间距] */
export type Gaps = [columnGap: number, rowGap: number];

/** 工作台布局设置 */
export interface WorkbenchSetting {
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
  Omit<WorkbenchSetting, 'limit' | 'gaps'> & {
    columnGap: number;
    rowGap: number;
  }
>;

export interface WorkbenchCard {
  id: number;
  x: number;
  y: number;
  column: number;
  row: number;
  type?: EnumWorkbenchCard;
}

export interface WorkbenchCardMove extends WorkbenchCard {
  offsetX?: number;
  offsetY?: number;
}

export interface WorkbenchCardMask extends WorkbenchCard {
  show: boolean;
}

export enum EnumWorkbenchCard {
  PlayStationTrophy = 'PlayStationTrophy',
}
