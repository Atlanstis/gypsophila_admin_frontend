import { defineStore } from 'pinia';
import { systemInfo } from '@/service';
import { useTitle } from '@vueuse/core';
import { router } from '@/router';
import { useAuthStore } from '../auth';

interface AppState {
  /** 网站信息 */
  websiteInfo: ResSystem.WebsiteInfo;
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    websiteInfo: {
      websiteName: '',
      websiteRecordNumber: '',
      webisteShowRecordNumber: false,
    },
  }),
  getters: {},
  actions: {
    /** 获取系统信息 */
    async getSystemInfo() {
      const { data, error } = await systemInfo();
      if (!error) {
        const { websiteName, websiteRecordNumber, webisteShowRecordNumber, publicKey } = data;
        this.websiteInfo = { websiteName, websiteRecordNumber, webisteShowRecordNumber };
        const authStore = useAuthStore();
        authStore.setPublicKey(publicKey);
        const route = router.currentRoute.value;
        this.updateWebsiteTitle(route.meta.title);
      }
    },

    /** 更新浏览器标题 */
    updateWebsiteTitle(title: string) {
      title = title || '';
      const base = this.websiteInfo.websiteName || '';
      const hasSeparator = Boolean(title) && Boolean(base);
      useTitle(`${title}${hasSeparator ? '-' : ''}${base}`);
    },
  },
});
