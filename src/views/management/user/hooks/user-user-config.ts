import { ref, type Ref } from 'vue';
import { userConfig } from '../api';

export function useUserConfig(onCanWatch: () => void) {
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
  }

  async function onRefreshCanWatch() {
    if (permission.value.watch) {
      onCanWatch();
    }
  }
  return {
    permission,
    getUserConfig,
    onRefreshCanWatch,
  };
}
