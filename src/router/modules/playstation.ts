import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';
import { getRouteView } from '@/utils';

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
        name: RouteEnum.PlayStation_Profile,
        path: '/play-station/profile',
        component: getRouteView(RouteEnum.PlayStation_Profile),
        meta: {
          title: '账号概览',
          icon: 'icon-park-outline:game-ps',
          keepAlive: true,
        },
      },
      {
        name: RouteEnum.PlayStation_Profile_Game,
        path: '/play-station/profile/game/:id',
        component: getRouteView(RouteEnum.PlayStation_Profile_Game),
        meta: {
          title: '游戏概览',
          icon: 'icon-park-outline:game-ps',
          hide: true,
          activeMenu: RouteEnum.PlayStation_Profile,
        },
      },
      {
        name: RouteEnum.PlayStation_Game,
        path: '/play-station/game',
        component: getRouteView(RouteEnum.PlayStation_Game),
        meta: {
          title: 'PS 游戏',
          icon: 'basil:gamepad-outline',
        },
      },
      {
        name: RouteEnum.PlayStation_Game_Search,
        path: '/play-station/game/search',
        component: getRouteView(RouteEnum.PlayStation_Game_Search),
        meta: {
          title: '游戏查找',
          iconLocal: 'psnine',
          keepAlive: true,
        },
      },
    ],
  },
];
