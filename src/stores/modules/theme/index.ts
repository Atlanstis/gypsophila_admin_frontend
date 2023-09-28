import { defineStore } from 'pinia';
import { getNaiveThemeOverrides } from './helper';

interface ThereState {
  themeColor: string;
  otherColor: {
    info: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const useThemeStore = defineStore('theme-store', {
  state: (): ThereState => ({
    themeColor: '#646cff',
    otherColor: {
      info: '#0099ad',
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d',
    },
  }),
  getters: {
    /** naiveUI的主题配置 */
    naiveThemeOverrides(state) {
      const overrides = getNaiveThemeOverrides({ primary: state.themeColor, ...state.otherColor });
      return overrides;
    },
  },
});
