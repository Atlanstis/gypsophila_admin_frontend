import { defineStore } from 'pinia';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { nextTick } from 'vue';
import { getWebsiteInfo } from '@/service';
import { useTitle } from '@vueuse/core';
import { router } from '@/router';

interface AppState {
  /** 后台页-侧边栏折叠状态 */
  adminSiderCollapse: boolean;
  /** 后台页-重新加载-标识 */
  adminReloadFlag: boolean;
  /** 网站信息 */
  websiteInfo: Partial<ApiSetting.Website>;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    adminSiderCollapse: localStorage.get(LocalKeyEnum.AdminMenuCollapsed) || false,
    adminReloadFlag: true,
    websiteInfo: {},
  }),
  getters: {},
  actions: {
    /** 切换后台页-侧边栏折叠状态 */
    toggleAdminSiderCollapse() {
      this.adminSiderCollapse = !this.adminSiderCollapse;
      localStorage.set(LocalKeyEnum.AdminMenuCollapsed, this.adminSiderCollapse);
    },

    /** 获取网站信息 */
    async getWebsiteInfo() {
      const { data, error } = await getWebsiteInfo();
      if (!error) {
        this.websiteInfo = data;
        const route = router.currentRoute.value;
        this.updateWebsiteTitle(route.meta.title);
      }
    },

    /** 更新浏览器标题 */
    updateWebsiteTitle(title: string) {
      title = title || '';
      const base = this.websiteInfo.name || '';
      const hasSeparator = Boolean(title) && Boolean(base);
      useTitle(`${title}${hasSeparator ? '-' : ''}${base}`);
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
