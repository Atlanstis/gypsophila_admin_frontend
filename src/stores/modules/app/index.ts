import { defineStore } from 'pinia';

interface AppState {
  /** 后台页-侧边栏折叠状态 */
  adminSiderCollapse: boolean;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    adminSiderCollapse: false,
  }),
  getters: {},
  actions: {
    /** 切换后台页-侧边栏折叠状态 */
    toggleAdminSiderCollapse() {
      this.adminSiderCollapse = !this.adminSiderCollapse;
    },
  },
});
