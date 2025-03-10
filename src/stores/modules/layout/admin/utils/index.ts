import { useIconRender } from '@/composables';
import type { AdminMenuOpt } from '@/types';

/**
 * 处理菜单信息
 * @param configs 路由配置
 */
export function processAdminMenuOpts(configs: ResMenu.MenuRouteConfig[]): AdminMenuOpt[] {
  return configs
    .map((config) => {
      if (config.meta.hideInMenu) {
        return null;
      }
      const { iconRender } = useIconRender();

      const menuOpt: AdminMenuOpt = {
        key: config.name,
        label: config.meta.title,
        routeName: config.name,
        routePath: config.path,
        icon: iconRender({ icon: config.meta.icon, iconLocal: config.meta.iconLocal }),
      };

      if (config.meta.type === 'menu') {
        let children: AdminMenuOpt[] = [];
        if (config.children?.length) {
          children = processAdminMenuOpts(config.children);
        }
        menuOpt.children = children;
      }

      return menuOpt;
    })
    .filter((opt): opt is AdminMenuOpt => !!opt);
}
