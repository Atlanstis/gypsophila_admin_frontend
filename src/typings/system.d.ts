declare namespace Layout {
  /** 后台页菜单选项 */
  type AdminMenuOption = import('naive-ui').MenuOption & {
    key: string;
    label: string;
    routeName: string;
    routePath: string;
    icon?: () => import('vue').VNodeChild;
    children?: AdminMenuOption[];
  };
}
