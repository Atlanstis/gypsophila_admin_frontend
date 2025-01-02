import { ref, type Ref } from 'vue';
import { menuConfig } from '../api';

export function useMenuConfig(onCanWatch: () => void) {
  const permission: Ref<Partial<ResMenu.ConfigPermission>> = ref({});

  async function getMenuConfig() {
    const { error, data } = await menuConfig();
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
    getMenuConfig,
    onRefreshCanWatch,
  };
}
