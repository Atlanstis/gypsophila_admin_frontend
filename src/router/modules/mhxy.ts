import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';
import { getRouteView } from '@/utils';

/** 梦幻西游路由 */
export const mhxyRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.Mhxy,
    path: '/mhxy',
    meta: {
      title: '梦幻西游',
      iconLocal: 'mhxy',
      layout: Layouts[LayoutEnum.Admin],
    },
    children: [
      {
        name: RouteEnum.MhxyAccount,
        path: '/mhxy/account',
        component: getRouteView(RouteEnum.MhxyAccount),
        meta: {
          title: '账号一览',
          icon: 'line-md:account',
        },
      },
      {
        name: RouteEnum.MhxyGoldRecord,
        path: '/mhxy/gold-record',
        component: getRouteView(RouteEnum.MhxyGoldRecord),
        meta: {
          title: '金币收支记录',
          icon: 'icon-park-outline:list-middle',
        },
      },
    ],
  },
];
