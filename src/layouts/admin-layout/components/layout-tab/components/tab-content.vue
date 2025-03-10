<template>
  <div ref="tabRef" class="flex h-full pr-18px items-end">
    <ChromeTab
      v-for="item of adminLayout.tabs"
      :key="item.fullPath"
      :isActive="adminLayout.activeTab === item.fullPath"
      :closable="adminLayout.tabs.length > 1"
      @click="adminLayout.handleClickTab(item.fullPath)"
      @close="adminLayout.removeTab(item.fullPath)"
    >
      <template #prefix>
        <svg-icon
          :icon="item.meta.icon"
          :iconLocal="item.meta.iconLocal"
          class="inline-block align-text-bottom text-16px"
        />
      </template>
      {{ item.meta.title }}
    </ChromeTab>
  </div>
</template>

<script lang="ts" setup>
import { useAdminLayoutStore } from '@/stores';
import ChromeTab from './chrome-tab/index.vue';
import { nextTick, ref, watch } from 'vue';

defineOptions({
  name: 'TabContent',
});

interface Emits {
  (e: 'scroll', clientX: number): void;
}

const emit = defineEmits<Emits>();

const adminLayout = useAdminLayoutStore();

const tabRef = ref<HTMLElement>();

/** 计算当前选择 tab 位置，并上报 */
async function calcActiveTabClientX() {
  await nextTick();
  if (tabRef.value && tabRef.value.children.length) {
    const activeTabElement = tabRef.value.children[adminLayout.activeTabIndex];
    if (!activeTabElement) return;
    const { x, width } = activeTabElement.getBoundingClientRect();
    const clientX = x + width / 2;
    setTimeout(() => {
      emit('scroll', clientX);
    }, 50);
  }
}

watch(
  () => adminLayout.activeTabIndex,
  () => {
    calcActiveTabClientX();
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped></style>
