import { playStationRoutes } from './playstation';
import { workbenchRoutes } from './workbench';
import { managementRoutes } from './management';
import { settingRoutes } from './setting';
import { mhxyRoutes } from './mhxy';

export * from './constants';

export const routes: AuthRoute.Route[] = [
  ...workbenchRoutes,
  ...playStationRoutes,
  ...mhxyRoutes,
  ...managementRoutes,
  ...settingRoutes,
];
