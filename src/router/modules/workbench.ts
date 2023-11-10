import type { RouteRecordRaw } from 'vue-router';
import { RouteNameEnum, Views } from '@/views';
import { Layouts } from '@/layouts';
import { LayoutEnum } from '@/layouts';

/** 工作台路由 */
export const workbenchRoutes: RouteRecordRaw[] = [
  {
    name: RouteNameEnum.Workbench,
    path: '/workbench',
    component: Layouts[LayoutEnum.Admin],
    meta: {
      title: '工作台',
      icon: 'icon-park-outline:workbench',
    },
    children: [
      {
        path: '/',
        component: Views[RouteNameEnum.Workbench],
      },
    ],
  },
];
