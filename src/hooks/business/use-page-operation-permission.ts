import { menuOperationPermission } from '@/service';
import { ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

/**
 * 页面的操作权限
 * @param route 当前页面的路由
 * @param cb 请求到权限后的回调方法
 * @returns
 */
export function usePageOperationPermission(route: RouteLocationNormalizedLoaded, cb?: () => void) {
  const operation = ref<System.OperationPermission>({});

  async function getOperationPermission() {
    const { error, data } = await menuOperationPermission(route.name as string);
    if (!error) {
      operation.value = data;
      cb && cb();
    }
  }

  return {
    /** 页面操作权限 */
    operation,
    /** 获取页面操作权限 */
    getOperationPermission,
  };
}
