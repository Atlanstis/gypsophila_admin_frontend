import { ref, type Ref } from 'vue';
import { roleConfig } from '../api';
import { useBoolean } from '@/hooks';

export function useRoleConfig(onCanWatch: () => void) {
  const {
    // 是否正在加载权限
    bool: loadingPermission,
    // 权限加载完毕
    setFalse: setPermissionLoaded,
  } = useBoolean(true);

  const permission: Ref<Partial<ResRole.ConfigPermission>> = ref({});

  async function getRoleConfig() {
    const { error, data } = await roleConfig();
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
    getRoleConfig,
    onRefreshCanWatch,
  };
}
