export const enum MenuTypeEnum {
  'menu' = 'menu',
  'page' = 'page',
}

export const MenuTypeLabel: Record<MenuTypeEnum, string> = {
  [MenuTypeEnum.menu]: '菜单',
  [MenuTypeEnum.page]: '页面',
};

export const MenuTypeOpts: { label: string; value: string }[] = Object.entries(MenuTypeLabel).map(
  ([value, label]) => ({
    label,
    value,
  }),
);
