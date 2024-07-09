import {
  type WorkbenchSetting,
  type SettingFormModel,
  type WorkbenchCard,
  EnumWorkbenchCard,
} from '@/typings';
import { defineStore } from 'pinia';

interface WorkbenchState {
  /** 工作台布局设置抽屉显示状态 */
  settingDrawerShow: boolean;
  /** 布局配置 */
  layoutConfig: WorkbenchSetting;
  cardList: WorkbenchCard[];
}

export const useWorkbenchStore = defineStore('workbench-store', {
  state: (): WorkbenchState => ({
    settingDrawerShow: false,
    layoutConfig: {
      columns: 12,
      rows: 8,
      cellHeight: 80,
      gaps: [12, 10],
      limit: {
        rows: [1, 99],
        columns: [1, 24],
        cellHeight: [40, 120],
        gaps: [0, 50],
      },
    },
    cardList: [{ id: 1, x: 0, y: 0, column: 4, row: 3, type: EnumWorkbenchCard.PlayStationTrophy }],
  }),

  actions: {
    /** 设置工作台布局设置抽屉显示 */
    setSettingDrawerShow(show: boolean) {
      this.settingDrawerShow = show;
    },

    /** 更新布局配置 */
    updateLayoutConfig(model: SettingFormModel) {
      const { columns, rows, cellHeight, columnGap, rowGap } = model;
      Object.assign(this.layoutConfig, { columns, rows, cellHeight, gaps: [columnGap, rowGap] });
      this.setSettingDrawerShow(false);
    },
  },
});
