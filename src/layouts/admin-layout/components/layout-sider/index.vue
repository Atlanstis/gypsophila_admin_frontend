<template>
  <div :class="['layout-sider', 'flex-col h-full bg-white']">
    <div class="h-56px flex-center flex-shrink-0">
      <icon-local-logo class="text-32px color-primary" />
    </div>
    <div class="flex-grow-1 overflow-hidden">
      <ScrollContainer>
        <NMenu
          :value="activeName"
          :options="menuConfigs"
          :collapsed="app.adminSiderCollapse"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :indent="18"
          :expanded-keys="expandedKeys"
          @update:expanded-keys="handleUpdateExpandedKeys"
          @update:value="handleUpdateMenu"
        ></NMenu>
      </ScrollContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAdminLayoutStore } from '@/stores';
import { useAppStore } from '@/stores';
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useRouterPush } from '@/composables';
import type { AdminMenuOpt } from '@/types';

defineOptions({
  name: 'AdminLayoutSider',
});

const adminLayoutStore = useAdminLayoutStore();
const { menuConfigs } = adminLayoutStore;

const app = useAppStore();
const route = useRoute();
const { routerPush } = useRouterPush();

/** 菜单当前选中项 */
const activeName = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.name) as string,
);
const expandedKeys = ref<string[]>([]);

/** 选中菜单的回调 */
function handleUpdateMenu(key: string) {
  routerPush({ name: key });
}

/** 更改菜单展开项 */
function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

/** 路由切换时，获取菜单展开项 */
function getExpandedKeysByActiveRoute() {
  // 递归查找激活菜单项的所有父级菜单
  function findActiveMenuParents(menus: AdminMenuOpt[], parentKeys: string[] = []): string[] {
    for (const menu of menus) {
      // 当前路径
      const currentKeys = [...parentKeys, menu.key];

      // 如果当前菜单就是激活菜单
      if (menu.key === activeName.value) {
        return currentKeys.slice(0, -1); // 返回所有父级菜单的key（不包括当前菜单）
      }

      // 如果有子菜单，递归查找
      if (menu.children && menu.children.length > 0) {
        const result = findActiveMenuParents(menu.children, currentKeys);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }

  return findActiveMenuParents(menuConfigs);
}

watch(
  () => route.name,
  () => {
    handleUpdateExpandedKeys(getExpandedKeysByActiveRoute());
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.layout-sider {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
</style>
