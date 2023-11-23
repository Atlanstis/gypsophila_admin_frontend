import { playStationRoutes } from './playstation';
import { workbenchRoutes } from './workbench';
import { managementRoutes } from './management';

export * from './constants';

export const routes: AuthRoute.Route[] = [
  ...workbenchRoutes,
  ...playStationRoutes,
  ...managementRoutes,
];
