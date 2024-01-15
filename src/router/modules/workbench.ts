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
];
