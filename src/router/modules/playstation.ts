import type { RouteRecordRaw } from 'vue-router';
import { RouteNameEnum, Views } from '@/views';

/** PlayStation 路由 */
export const playStationRoutes: RouteRecordRaw[] = [
  {
    name: RouteNameEnum.PlayStation,
    path: '/play-station',
    component: Views[RouteNameEnum.PlayStation],
    meta: {
      title: 'PlayStation',
      iconLocal: 'playstation',
    },
    children: [
      {
        name: RouteNameEnum.PlayStation_Game,
        path: 'game',
        component: Views[RouteNameEnum.PlayStation_Game],
        meta: {
          title: 'PS 游戏',
          iconLocal: 'psgame',
        },
      },
      {
        name: RouteNameEnum.PlayStation_Trophy,
        path: '/trophy',
        component: Views[RouteNameEnum.PlayStation_Trophy],
        meta: {
          title: '奖杯信息',
          iconLocal: 'trophy',
          hide: true,
        },
      },
      {
        name: RouteNameEnum.PlayStation_Search,
        path: '/play-station/search',
        component: Views[RouteNameEnum.PlayStation_Search],
        meta: {
          title: '查找',
          iconLocal: 'psnine',
        },
      },
    ],
  },
];
