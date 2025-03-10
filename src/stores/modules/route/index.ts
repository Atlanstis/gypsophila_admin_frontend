import { defineStore } from 'pinia';
import { router, ROOT_ROUTE } from '@/router';
import { RouteEnum } from '@/enums';
import type { RouteRecordRaw } from 'vue-router';
import { getConstantRouteName, generateRoutes } from './helper';
import { authInfo } from '@/service';
import { useAdminLayoutStore, useAppStore, useAuthStore } from '@/stores';
import { nextTick } from 'vue';

interface RouteState {
  /** 路由权限是否已初始化 */
  isInitAuthRoute: boolean;
  /** 缓存的路由名称 */
  keepAliveRouteNames: string[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isInitAuthRoute: false,
    keepAliveRouteNames: [],
  }),

  actions: {
    async initAuthRoute() {
      const { setUserInfo } = useAuthStore();
      const { data, error } = await authInfo();
      if (!error) {
        setUserInfo(data);
        // 生成权限路由
        const { menus } = data;
        const { routes, keepAliveRouteNames } = generateRoutes(menus);
        // 生成后台布局菜单
        const adminLayoutStore = useAdminLayoutStore();
        adminLayoutStore.generateMenuBarConfig(menus);
        // 设置 keepAlive 的路由
        this.keepAliveRouteNames = keepAliveRouteNames;
        // 添加动态路由
        routes.forEach((route) => {
          router.addRoute(route);
        });
        // 替换 Root 路由 path
        const rootPath = routes[0]?.path || '/login';
        this.handleUpdateRootRedirect(rootPath);

        this.isInitAuthRoute = true;
      } else {
        const authStore = useAuthStore();
        authStore.resetAuthStore();
      }
    },

    /**
     * 更新根路由重定向地址
     * @param rootPath 重定向地址
     */
    handleUpdateRootRedirect(rootPath: string) {
      const rootRoute: RouteRecordRaw = {
        path: ROOT_ROUTE.path,
        name: ROOT_ROUTE.name,
        redirect: rootPath,
      };
      router.removeRoute(RouteEnum.Root);
      router.addRoute(rootRoute);
    },

    /** 重置路由 */
    resetRouteStore() {
      this.$reset();
      this.resetRoutes();
    },

    /** 重置路由数据，保留固定路由 */
    resetRoutes() {
      const routes = router.getRoutes();
      const constantNameArr = getConstantRouteName();
      routes.forEach((route) => {
        const name = route.name;
        if (!name) return;
        const isConstant = constantNameArr.includes(name);
        if (!isConstant) {
          router.removeRoute(name);
        } else if (name === RouteEnum.Root) {
          // 将 Root 路由重新指定到登录页
          router.removeRoute(name);
          const rootRoute = ROOT_ROUTE;
          router.addRoute(rootRoute);
        }
      });
    },

    async reloadRoute(name: string) {
      const { reloadPage } = useAppStore();

      const isCached = this.keepAliveRouteNames.includes(name);
      if (isCached) {
        this.removeKeepAliveRoute(name);
      }

      await reloadPage();

      if (isCached) {
        this.addKeepAliveRoute(name);
      }
    },

    /** 从缓存路由中去除某个路由 */
    removeKeepAliveRoute(name: string) {
      const index = this.keepAliveRouteNames.indexOf(name);
      if (index > -1) {
        this.keepAliveRouteNames.splice(index, 1);
      }
    },

    /** 添加某个缓存路由 */
    addKeepAliveRoute(name: string) {
      const index = this.keepAliveRouteNames.indexOf(name);
      if (index === -1) {
        this.keepAliveRouteNames.push(name);
      }
    },

    /** 刷新 keepAlive 状态 */
    async refreshKeepAliveState(name: string) {
      const isCached = this.keepAliveRouteNames.includes(name);
      if (isCached) {
        this.removeKeepAliveRoute(name);
      }
      await nextTick();
      if (isCached) {
        this.addKeepAliveRoute(name);
      }
    },
  },
});
