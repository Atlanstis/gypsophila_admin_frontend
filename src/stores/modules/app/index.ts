import { defineStore } from 'pinia';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';

interface AppState {
  /** 后台页-侧边栏折叠状态 */
  adminSiderCollapse: boolean;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    adminSiderCollapse: localStorage.get(LocalKeyEnum.AdminMenuCollapsed) || false,
  }),
  getters: {},
  actions: {
    /** 切换后台页-侧边栏折叠状态 */
    toggleAdminSiderCollapse() {
      this.adminSiderCollapse = !this.adminSiderCollapse;
      localStorage.set(LocalKeyEnum.AdminMenuCollapsed, this.adminSiderCollapse);
    },
  },
});
