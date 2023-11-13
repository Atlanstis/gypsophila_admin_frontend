import { Views } from '@/views';
import { Layouts } from '@/layouts';
import { RouteEnum, LayoutEnum } from '@/enums';

/** 工作台路由 */
export const workbenchRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.Workbench,
    path: '/workbench',
    component: Views[RouteEnum.Workbench],
    meta: {
      title: '工作台',
      icon: 'icon-park-outline:workbench',
      layout: Layouts[LayoutEnum.Admin],
    },
  },
];
