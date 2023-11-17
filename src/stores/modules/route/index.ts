import { defineStore } from 'pinia';
import { routes, router, ROOT_ROUTE } from '@/router';
import { RouteEnum } from '@/enums';
import type { RouteRecordRaw } from 'vue-router';
import { transformAuthRoute, transformAuthRouteToMenus, getConstantRouteName } from './helper';

interface RouteState {
  /** 路由权限是否已初始化 */
  isInitAuthRoute: boolean;
  /**后台页菜单 */
  adminMenus: Layout.AdminMenuOption[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isInitAuthRoute: false,
    adminMenus: [],
  }),

  actions: {
    async initAuthRoute() {
      // TODO 将授权路由改为接口获取
      const authMenu: PageRoute.AllRouteName[] = [
        'Workbench',
        'PlayStation',
        'PlayStation_Game',
        'PlayStation_Trophy',
        'PlayStation_Search',
      ];
      const authRoutes = await transformAuthRoute(routes, authMenu);

      // 生成后台菜单
      (this.adminMenus as Layout.AdminMenuOption[]) = transformAuthRouteToMenus(routes, authMenu);

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

    /** 重置 AuthRoute */
    resetRouteStore() {
      this.$reset();
      this.resetRoutes();
    },

    /** 重置路由数据，保留固定路由 */
    resetRoutes() {
      const routes = router.getRoutes();
      const constantNameArr = getConstantRouteName();
      routes.forEach((route) => {
        const name = route.name as PageRoute.AllRouteName;
        const isConstant = constantNameArr.includes(name);
        if (isConstant) {
          router.removeRoute(name);
          if (name === RouteEnum.Root) {
            const rootRoute = ROOT_ROUTE as RouteRecordRaw;
            router.addRoute(rootRoute);
          }
        }
      });
    },
  },
});
