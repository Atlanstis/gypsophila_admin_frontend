import { playStationRoutes } from './playstation';
import { workbenchRoutes } from './workbench';
import { managementRoutes } from './management';
import { settingRoutes } from './setting';

export * from './constants';

export const routes: AuthRoute.Route[] = [
  ...workbenchRoutes,
  ...playStationRoutes,
  ...managementRoutes,
  ...settingRoutes,
];
