import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';
import { getRouteView } from '@/utils';

export const settingRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.Setting,
    path: '/setting',
    meta: {
      title: '系统设置',
      icon: 'lets-icons:setting-alt-line',
      layout: Layouts[LayoutEnum.Admin],
    },
    children: [
      {
        name: RouteEnum.Schedule_Task,
        path: '/setting/schedule-task',
        component: getRouteView(RouteEnum.Schedule_Task),
        meta: {
          title: '定时任务',
          icon: 'akar-icons:schedule',
        },
      },
      {
        name: RouteEnum.Setting_Common,
        path: '/setting/common',
        component: getRouteView(RouteEnum.Setting_Common),
        meta: {
          title: '通用设置',
          icon: 'icon-park:setting-config',
        },
      },
    ],
  },
];
