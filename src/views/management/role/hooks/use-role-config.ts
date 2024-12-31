import { ref, type Ref } from 'vue';
import { roleConfig } from '../api';

export function useRoleConfig(onCanWatch: () => void) {
  const permission: Ref<Partial<ResRole.ConfigPermission>> = ref({});

  async function getRoleConfig() {
    const { error, data } = await roleConfig();
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
    getRoleConfig,
    onRefreshCanWatch,
  };
}
