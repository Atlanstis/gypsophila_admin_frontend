import { Views } from '@/views';
import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';

/** PlayStation 路由 */
export const playStationRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.PlayStation,
    path: '/play-station',
    meta: {
      title: 'PlayStation',
      iconLocal: 'playstation',
      layout: Layouts[LayoutEnum.Admin],
    },
    children: [
      {
        name: RouteEnum.PlayStation_Game,
        path: '/play-station/game',
        component: Views[RouteEnum.PlayStation_Game],
        meta: {
          title: 'PS 游戏',
          iconLocal: 'psgame',
        },
      },
      {
        name: RouteEnum.PlayStation_Trophy,
        path: '/play-station/trophy',
        component: Views[RouteEnum.PlayStation_Trophy],
        meta: {
          title: '奖杯信息',
          iconLocal: 'trophy',
          hide: true,
        },
      },
      {
        name: RouteEnum.PlayStation_Search,
        path: '/play-station/search',
        component: Views[RouteEnum.PlayStation_Search],
        meta: {
          title: '查找',
          iconLocal: 'psnine',
        },
      },
    ],
  },
];
