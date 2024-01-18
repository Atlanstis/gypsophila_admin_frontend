<template>
  <div :class="['layout-tab', 'h-full bg-white flex-y-center pl-16px']">
    <div ref="bsWrapper" class="flex-1-hidden h-full">
      <BetterScroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: true }">
        <TabContent @scroll="onContentScroll" />
      </BetterScroll>
    </div>
    <ReloadBtn />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ReloadBtn, TabContent } from './components';
import { useTabStore } from '@/stores';
import { onMounted, ref, watch } from 'vue';
import { useElementBounding } from '@vueuse/core';

defineOptions({
  name: 'AdminLayoutTab',
});

const route = useRoute();
const tab = useTabStore();

const bsWrapper = ref<HTMLElement>();
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);
const bsScroll = ref<Expose.BetterScroll>();

/** tab 切换后，将 tab 滚动到适合位置 */
function onContentScroll(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  if (bsScroll.value) {
    const { maxScrollX, x: leftX } = bsScroll.value.instance;
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    bsScroll.value?.instance.scrollBy(update, 0, 300);
  }
}

/** 初始化页签数据 */
function initTabs() {
  tab.initTabs(route);
}

watch(
  () => route.fullPath,
  () => {
    tab.addTab(route);
    tab.setActiveTab(route.fullPath);
  },
);

onMounted(() => {
  initTabs();
});
</script>

<style lang="scss" scoped>
.layout-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
