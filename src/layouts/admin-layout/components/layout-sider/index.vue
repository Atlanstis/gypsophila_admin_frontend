<template>
  <div :class="['layout-sider', 'flex-col h-full bg-white']">
    <div class="h-56px flex-center flex-shrink-0">
      <icon-local-logo class="text-32px color-primary" />
    </div>
    <div class="flex-grow-1 overflow-hidden">
      <ScrollContainer>
        <NMenu
          :value="activeName"
          :options="adminMenus"
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
import { useRouteStore } from '@/stores';
import { useAppStore } from '@/stores';
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { useRouterPush } from '@/composables';

defineOptions({
  name: 'AdminLayoutSider',
});

const { adminMenus } = useRouteStore();

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
  const routeName = key as PageRoute.AllRouteName;
  routerPush({ name: routeName });
}

/** 更改菜单展开项 */
function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

/** 路由切换时，获取菜单展开项 */
function getExpandedKeysByActiveRoute() {
  const keys: string[] = [];
  for (let i = 0; i < adminMenus.length; i++) {
    const menu = adminMenus[i];
    if (menu.children && menu.children.length > 0) {
      const item = menu.children.find((item) => item.key === activeName.value);
      if (item) {
        keys.push(menu.key);
        break;
      }
    } else {
      if (menu.key === activeName.value) {
        keys.push(menu.key);
        break;
      }
    }
  }
  return keys;
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
