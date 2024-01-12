import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { getIndexInTabsByRouteName, getTabByVueRoute, isInTabs } from './helpers';
import { useRouterPush } from '@/composables';

interface TabState {
  /** 页签数据 */
  tabs: Layout.AdminTab[];
  /** 当前激活状态的页签(路由 fullPath) */
  activeTab: string;
}

export const useTabStore = defineStore('tab-store', {
  state: (): TabState => ({
    tabs: [],
    activeTab: '',
  }),

  getters: {
    /** 当前激活状态的页签索引 */
    activeTabIndex(state: TabState) {
      const { tabs, activeTab } = state;
      return tabs.findIndex((tab) => tab.fullPath === activeTab);
    },
  },

  actions: {
    /** 初始化页签 */
    initTabs(currentRoute: RouteLocationNormalized) {
      const tabs: Layout.AdminTab[] = [];
      const tab = getTabByVueRoute(currentRoute);
      tabs.push(tab);
      this.tabs = tabs;
      this.setActiveTab(currentRoute.fullPath);
    },

    /**
     * 添加多页签
     * @param route - 路由
     */
    addTab(route: RouteLocationNormalized) {
      const tab = getTabByVueRoute(route);
      if (isInTabs(this.tabs, tab.fullPath)) return;

      const index = getIndexInTabsByRouteName(this.tabs, route.name as string);
      if (index === -1) {
        this.tabs.push(tab);
        return;
      }

      const { multiTab = false } = route.meta;
      if (!multiTab) {
        this.tabs.splice(index, 1, tab);
        return;
      }

      this.tabs.push(tab);
    },

    /**
     * 点击 tab
     * @param fullPath - 路由fullPath
     */
    async handleClickTab(fullPath: string) {
      const { routerPush } = useRouterPush(false);

      const isActive = this.activeTab === fullPath;
      if (!isActive) {
        const navigationFailure = await routerPush(fullPath);
        if (!navigationFailure) this.setActiveTab(fullPath);
      }
    },

    /**
     * 删除页签
     * @param fullPath - 路由fullPath
     */
    async removeTab(fullPath: string) {
      const { routerPush } = useRouterPush(false);

      const isActive = this.activeTab === fullPath;
      const updateTabs = this.tabs.filter((tab) => tab.fullPath !== fullPath);
      if (!isActive) {
        this.tabs = updateTabs;
      }
      if (isActive && updateTabs.length) {
        const activePath = updateTabs[updateTabs.length - 1].fullPath;
        const navigationFailure = await routerPush(activePath);
        if (!navigationFailure) {
          this.tabs = updateTabs;
          this.setActiveTab(activePath);
        }
      }
    },

    /**
     * 设置当前路由对应的页签为激活状态
     * @param fullPath - 路由 fullPath
     */
    setActiveTab(fullPath: string) {
      this.activeTab = fullPath;
    },
  },
});
