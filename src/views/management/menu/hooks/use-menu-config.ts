import { ref, type Ref } from 'vue';
import { menuConfig } from '../api';
import { useBoolean } from '@/hooks';

export function useMenuConfig(onCanWatch: () => void) {
  const {
    // 是否正在加载权限
    bool: loadingPermission,
    // 权限加载完毕
    setFalse: setPermissionLoaded,
  } = useBoolean(true);

  const permission: Ref<Partial<ResMenu.ConfigPermission>> = ref({});

  async function getMenuConfig() {
    const { error, data } = await menuConfig();
    if (!error) {
      permission.value = data.permission;
      onRefreshCanWatch();
    }
    setPermissionLoaded();
  }

  async function onRefreshCanWatch() {
    if (permission.value.watch) {
      onCanWatch();
    }
  }
  return {
    loadingPermission,
    permission,
    getMenuConfig,
    onRefreshCanWatch,
  };
}
