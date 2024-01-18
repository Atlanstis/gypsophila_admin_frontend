import { defineStore } from 'pinia';
import { getNaiveThemeOverrides } from './helper';

interface ThemeState {
  themeColor: string;
  otherColor: {
    info: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const useThemeStore = defineStore('theme-store', {
  state: (): ThemeState => ({
    themeColor: '#646cff',
    otherColor: {
      info: '#646cff',
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
