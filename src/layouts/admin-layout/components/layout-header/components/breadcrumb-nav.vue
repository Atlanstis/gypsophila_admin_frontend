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
import { useAdminLayoutStore } from '@/stores';
import { NBreadcrumbItem } from 'naive-ui';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { AdminBreadcrumbOpt, AdminMenuOpt } from '@/types';

defineOptions({
  name: 'BreadcrumbNav',
});

const route = useRoute();
const adminLayoutStore = useAdminLayoutStore();
const { routerPush } = useRouterPush();

const breadcrumbs = computed<AdminBreadcrumbOpt[]>(() => {
  const { menuConfigs } = adminLayoutStore;
  const { name: routeName } = route;
  if (!routeName) return [];

  // 存储面包屑路径
  const breadcrumbList: AdminMenuOpt[] = [];

  // 递归查找当前路由对应的菜单项及其所有父级菜单
  const findRouteMenuPath = (menus: AdminMenuOpt[], parents: AdminMenuOpt[] = []): boolean => {
    for (const menu of menus) {
      // 如果找到当前路由
      if (menu.routeName === routeName) {
        // 添加所有父级菜单和当前菜单
        breadcrumbList.push(...parents, menu);
        return true;
      }

      // 如果有子菜单，递归查找
      if (menu.children && menu.children.length) {
        const found = findRouteMenuPath(menu.children, [...parents, menu]);
        if (found) return true;
      }
    }
    return false;
  };

  findRouteMenuPath(menuConfigs);

  // 转换为面包屑所需的格式
  return breadcrumbList.map((menu) => {
    const hasChildren = menu.children && menu.children.length > 0;
    return {
      key: menu.routeName,
      label: menu.label,
      icon: menu.icon,
      hasChildren,
      options: hasChildren
        ? menu.children!.map((child) => ({
            key: child.routeName,
            label: child.label,
          }))
        : [],
    };
  });
});

function onMenuSelect(key: string) {
  routerPush({ name: key });
}
</script>

<style lang="scss" scoped></style>
