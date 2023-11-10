import type { RouteRecordRaw } from 'vue-router';
import { playStationRoutes } from './playstation';
import { workbenchRoutes } from './workbench';

export * from './constants';

export const routes: RouteRecordRaw[] = [...workbenchRoutes, ...playStationRoutes];
