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
              <SettingContent v-model:list="list" />
            </ScrollContainer>
          </NCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WorkbenchCard } from '@/typings';
import { useWorkbenchStore } from '@/stores';
import { SettingContent, DragItem } from '@/views/workbench/components';
import { ToolBar } from './components';
import { ref, onMounted } from 'vue';
defineOptions({
  name: 'WorkBenchSetting',
});

const cardSize = 'small';

const workbenchStore = useWorkbenchStore();

const list = ref<WorkbenchCard[]>([]);

onMounted(() => {
  list.value = workbenchStore.cardList.map((item) => ({ ...item }));
});
</script>

<style lang="scss" scoped></style>
