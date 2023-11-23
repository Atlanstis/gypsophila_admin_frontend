import { Views } from '@/views';
import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';

/** 系统管理 路由 */
export const managementRoutes: AuthRoute.Route[] = [
  {
    name: RouteEnum.Management,
    path: '/management',
    meta: {
      title: '系统管理',
      icon: 'carbon:cloud-service-management',
      layout: Layouts[LayoutEnum.Admin],
    },
    children: [
      {
        name: RouteEnum.Management_User,
        path: '/management/user',
        component: Views[RouteEnum.Management_User],
        meta: {
          title: '用户管理',
          icon: 'ic:outline-manage-accounts',
        },
      },
    ],
  },
];
