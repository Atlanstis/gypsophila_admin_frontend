import { playStationRoutes } from './playstation';
import { workbenchRoutes } from './workbench';

export * from './constants';

export const routes: AuthRoute.Route[] = [...workbenchRoutes, ...playStationRoutes];
