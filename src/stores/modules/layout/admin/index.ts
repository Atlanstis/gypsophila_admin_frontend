import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import type { AdminMenuOpt, AdminTab } from '@/types';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';
import { useRouterPush } from '@/composables';
import { useRouteStore } from '@/stores';
import {
  processAdminMenuOpts,
  getIndexInTabsByRouteName,
  getTabByVueRoute,
  isInTabs,
} from './utils';
import { nextTick } from 'vue';

type State = {
  /** 菜单栏配置 */
  menuConfigs: AdminMenuOpt[];
  /** 页签数据 */
  tabs: AdminTab[];
  /** 当前激活状态的页签(路由 fullPath) */
  activeTab: string;
  /** 后台页-侧边栏折叠状态 */
  siderCollapse: boolean;
  /** 后台页-重新加载-标识 */
  reloadFlag: boolean;
};

export const useAdminLayoutStore = defineStore('admin-layout-store', {
  state: (): State => ({
    menuConfigs: [],
    tabs: [],
    activeTab: '',
    siderCollapse: localStorage.get(LocalKeyEnum.AdminMenuCollapsed) || false,
    reloadFlag: true,
  }),

  getters: {
    /** 当前激活状态的页签索引 */
    activeTabIndex(state: State) {
      const { tabs, activeTab } = state;
      return tabs.findIndex((tab) => tab.fullPath === activeTab);
    },
  },

  actions: {
    /** 切换后台页-侧边栏折叠状态 */
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse;
      localStorage.set(LocalKeyEnum.AdminMenuCollapsed, this.siderCollapse);
    },

    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.reloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true;
        }, duration);
      } else {
        this.reloadFlag = true;
      }
    },

    async reloadRoute(name: string) {
      const routeStore = useRouteStore();
      const isCached = routeStore.keepAliveRouteNames.includes(name);
      if (isCached) {
        routeStore.removeKeepAliveRoute(name);
      }

      await this.reloadPage();

      if (isCached) {
        routeStore.addKeepAliveRoute(name);
      }
    },

    /** 初始化页签 */
    initTabs(currentRoute: RouteLocationNormalized) {
      const tabs: AdminTab[] = [];
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
      const routeStore = useRouteStore();

      // 刷新 keepAlive 状态
      const tabName = this.tabs.find((tab) => tab.fullPath === fullPath)?.name as string;
      if (tabName) {
        await routeStore.refreshKeepAliveState(tabName);
      }

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
