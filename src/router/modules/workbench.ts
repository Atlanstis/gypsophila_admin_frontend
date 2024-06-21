import { Layouts } from '@/layouts';
import { RouteEnum, LayoutEnum } from '@/enums';
import { getRouteView } from '@/utils';

/** 工作台路由 */
export const workbenchRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.Workbench,
    path: '/workbench',
    component: getRouteView(RouteEnum.Workbench),
    meta: {
      title: '工作台',
      icon: 'icon-park-outline:workbench',
      layout: Layouts[LayoutEnum.Admin],
    },
  },
  {
    name: RouteEnum.WorkbenckSetting,
    path: '/workbench/setting',
    component: getRouteView(RouteEnum.WorkbenckSetting),
    meta: {
      title: '工作台设置',
      icon: 'icon-park-outline:workbench',
      hide: true,
      layout: Layouts[LayoutEnum.Admin],
      activeMenu: RouteEnum.Workbench,
    },
  },
];
