<template>
  <NBreadcrumb class="px-12px">
    <template v-for="breadcrumb of breadcrumbs" :key="breadcrumb.key">
      <NBreadcrumbItem>
        <NDropdown
          v-if="breadcrumb.hasChildren"
          :options="breadcrumb.options"
          @select="onMenuSelect"
        >
          <div class="trigger">
            <component
              v-if="breadcrumb.icon"
              :is="breadcrumb.icon"
              class="inline-block align-text-bottom mr-4px text-16px"
            />
            <span>
              {{ breadcrumb.label }}
            </span>
          </div>
        </NDropdown>
        <template v-else>
          <component
            v-if="breadcrumb.icon"
            :is="breadcrumb.icon"
            class="inline-block align-text-bottom mr-4px text-16px"
          />
          <span>
            {{ breadcrumb.label }}
          </span>
        </template>
      </NBreadcrumbItem>
    </template>
  </NBreadcrumb>
</template>

<script lang="ts" setup>
import { useRouterPush } from '@/composables';
import { useRouteStore } from '@/stores';
import { NBreadcrumbItem } from 'naive-ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'BreadcrumbNav',
});

const route = useRoute();
const routeStore = useRouteStore();
const { routerPush } = useRouterPush();

const breadcrumbs = computed(() => {
  const topMenu = getTopMenu(
    route.name as string,
    routeStore.adminMenus as Layout.AdminMenuOption[],
  );
  if (topMenu) {
    const breadcrumbs: Layout.AdminBreadcrumb[] = [];
    const hasChildren = Boolean(topMenu.children && topMenu.children.length);
    const children = topMenu.children as Layout.AdminMenuOption[];
    const topBreadcrumb: Layout.AdminBreadcrumb = {
      label: topMenu.label,
      key: topMenu.key,
      icon: topMenu.icon,
      hasChildren,
    };
    breadcrumbs.push(topBreadcrumb);
    if (hasChildren) {
      const activeMenu = children.find((item) => item.key === route.name);
      const otherMenus = children.filter((item) => item.key !== route.name);
      topBreadcrumb.options = otherMenus.map((item) => ({
        label: item.label,
        key: item.key,
        icon: item.icon,
      }));
      if (activeMenu) {
        const childBreadcrumb: Layout.AdminBreadcrumb = {
          label: activeMenu.label,
          key: activeMenu.key,
          icon: activeMenu.icon,
        };
        breadcrumbs.push(childBreadcrumb);
      }
    }

    return breadcrumbs;
  }
  return [];
});

function onMenuSelect(key: string) {
  routerPush({ name: key });
}

/**
 * 获取顶级菜单
 * @param routeName 当前路由名
 * @param menus 菜单
 */
function getTopMenu(
  routeName: string,
  menus: Layout.AdminMenuOption[],
): Layout.AdminMenuOption | undefined {
  return menus.find((item) => {
    if (item.routeName === routeName) return true;
    if (Array.isArray(item.children)) {
      return getTopMenu(routeName, item.children);
    }
    return false;
  });
}
</script>

<style lang="scss" scoped></style>
