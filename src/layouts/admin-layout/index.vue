<template>
  <div class="relative h-full bg-#f6f9f8" :style="cssVars">
    <div class="flex-col h-full">
      <!-- 头部 -->
      <header :class="[style['layout-header'], 'flex-shrink-0', leftGapClass, commonClass]">
        <LayoutHeader />
      </header>
      <!-- 页签 -->
      <div :class="[style['layout-tab'], 'flex-shrink-0', leftGapClass, commonClass]">
        <LayoutTab />
      </div>
      <!-- 侧边栏 -->
      <aside
        :class="[
          'absolute top-0 left-0 h-full',
          appStore.adminSiderCollapse ? style['layout-sider_collapsed'] : style['layout-sider'],
          commonClass,
        ]"
      >
        <LayoutSider />
      </aside>
      <!-- 主体内容 -->
      <main :class="['flex-grow overflow-hidden', leftGapClass, commonClass]">
        <LayoutContent />
      </main>
      <!-- 底部 -->
      <footer :class="[style['layout-footer'], 'flex-shrink-0', leftGapClass, commonClass]">
        <LayoutFooter />
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayout',
});

import { computed, ref } from 'vue';
import { useAppStore } from '@/stores';
import style from './index.module.css';
import { LayoutHeader, LayoutTab, LayoutSider, LayoutContent, LayoutFooter } from './components';

const cssVars = {
  '--admin-header-height': '56px',
  '--admin-header-z-index': 97,
  '--admin-tab-height': '44px',
  '--admin-tab-z-index': 95,
  '--admin-sider-width': '220px',
  '--admin-sider-collapsed-width': '64px',
  '--admin-sider-z-index': 99,
  '--admin-footer-height': '48px',
  '--admin-footer-z-index': 95,
};

const appStore = useAppStore();

const leftGapClass = computed(() => {
  return appStore.adminSiderCollapse ? style['left-gap_collapsed'] : style['left-gap'];
});

const commonClass = ref('transition-all-300');
</script>

<style lang="scss" scoped></style>
