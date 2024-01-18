import { LayoutEnum, RouteEnum } from '@/enums';
import { Layouts } from '@/layouts';
import { getRouteView } from '@/utils';

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
        component: getRouteView(RouteEnum.Management_User),
        meta: {
          title: '用户管理',
          icon: 'ic:outline-manage-accounts',
        },
      },
      {
        name: RouteEnum.Management_Role,
        path: '/management/role',
        component: getRouteView(RouteEnum.Management_Role),
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
        },
      },
      {
        name: RouteEnum.Management_Menu,
        path: '/management/menu',
        component: getRouteView(RouteEnum.Management_Menu),
        meta: {
          title: '菜单管理',
          icon: 'material-symbols-light:route',
        },
      },
    ],
  },
];
