<template>
  <div class="flex">
    <div class="w-260px">
      <NCard :size="cardSize" class="h-full" content-style="height: 100%;">
        <ScrollContainer>
          <DragItem />
        </ScrollContainer>
      </NCard>
    </div>
    <div class="flex-1-hidden m-l-12px">
      <div class="h-full flex-col">
        <div class="m-b-10px">
          <NCard :size="cardSize">
            <ToolBar />
          </NCard>
        </div>
        <div class="flex-1-hidden">
          <NCard :size="cardSize" class="h-full" content-style="height: 100%;">
            <ScrollContainer>
              <DropContent v-model:list="list" v-bind="dropConfig" />
            </ScrollContainer>
          </NCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useWorkbenchStore } from '@/stores';
import { DragItem, DropContent, ToolBar, type IDragItem } from './components';

defineOptions({
  name: 'WorkBenchSetting',
});

const cardSize = 'small';

const workbenchStore = useWorkbenchStore();

const dropConfig = computed(() => {
  const {
    layoutConfig: { columns, rows, gaps, cellHeight },
  } = workbenchStore;
  return {
    columns,
    rows,
    gaps,
    height: cellHeight,
  };
});

const list = ref<IDragItem[]>([]);
</script>

<style lang="scss" scoped></style>
