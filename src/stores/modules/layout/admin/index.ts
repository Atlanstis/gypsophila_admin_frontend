import { defineStore } from 'pinia';
import type { AdminMenuOpt } from '@/types';
import { processAdminMenuOpts } from './utils';

type State = {
  menuConfigs: AdminMenuOpt[];
};

export const useAdminLayoutStore = defineStore('admin-layout-store', {
  state: (): State => ({
    menuConfigs: [],
  }),

  actions: {
    /** 生成菜单栏配置 */
    generateMenuBarConfig(configs: ResMenu.MenuRouteConfig[]) {
      this.menuConfigs = processAdminMenuOpts(configs);
    },

    /** 重置状态 */
    resetState() {
      this.$reset();
    },
  },
});
