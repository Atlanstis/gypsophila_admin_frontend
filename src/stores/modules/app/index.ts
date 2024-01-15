import { defineStore } from 'pinia';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { nextTick } from 'vue';

interface AppState {
  /** 后台页-侧边栏折叠状态 */
  adminSiderCollapse: boolean;
  /** 后台页-重新加载-标识 */
  adminReloadFlag: boolean;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    adminSiderCollapse: localStorage.get(LocalKeyEnum.AdminMenuCollapsed) || false,
    adminReloadFlag: true,
  }),
  getters: {},
  actions: {
    /** 切换后台页-侧边栏折叠状态 */
    toggleAdminSiderCollapse() {
      this.adminSiderCollapse = !this.adminSiderCollapse;
      localStorage.set(LocalKeyEnum.AdminMenuCollapsed, this.adminSiderCollapse);
    },

    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.adminReloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.adminReloadFlag = true;
        }, duration);
      } else {
        this.adminReloadFlag = true;
      }
    },
  },
});
