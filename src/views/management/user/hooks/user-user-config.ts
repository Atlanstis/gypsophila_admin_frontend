import { ref, type Ref } from 'vue';
import { userConfig } from '../api';
import { useBoolean } from '@/hooks';

export function useUserConfig(onCanWatch: () => void) {
  const {
    // 是否正在加载权限
    bool: loadingPermission,
    // 权限加载完毕
    setFalse: setPermissionLoaded,
  } = useBoolean(true);

  const permission: Ref<ResUser.ConfigPermission> = ref({
    add: false,
    delete: false,
    edit: false,
    watch: false,
  });

  async function getUserConfig() {
    const { error, data } = await userConfig();
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
    getUserConfig,
    onRefreshCanWatch,
  };
}
