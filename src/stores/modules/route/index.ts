import { defineStore } from 'pinia';
import { routes, router, ROOT_ROUTE } from '@/router';
import { RouteEnum } from '@/enums';
import type { RouteRecordRaw } from 'vue-router';
import { transformAuthRoute } from './helper';

interface RouteState {
  /** 路由权限是否已初始化 */
  isInitAuthRoute: boolean;
  // adminMenus: AdminLayout.MenuOption[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isInitAuthRoute: false,
    // adminMenus: [],
  }),

  actions: {
    async initAuthRoute() {
      await this.handleAuthRoute();
    },

    /**
     * 处理权限路由
     * @param routes - 权限路由
     */
    async handleAuthRoute() {
      // TODO 将授权路由改为接口获取
      const authMenu: PageRoute.AllRouteName[] = ['Workbench', 'PlayStation', 'PlayStation_Search'];
      const authRoutes = await transformAuthRoute(routes, authMenu);

      // 添加动态路由
      authRoutes.forEach((route) => {
        router.addRoute(route);
      });
      // TODO rootPath 从接口获取
      const rootPath = '/workbench';
      this.handleUpdateRootRedirect(rootPath);

      this.isInitAuthRoute = true;
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
  },
});
