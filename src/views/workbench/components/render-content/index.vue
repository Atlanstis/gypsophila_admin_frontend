<template>
  <div ref="contentRef" :style="gridStyles">
    <template v-for="item of cardList" :key="item.id">
      <ModuleRender v-if="item.type" :type="item.type" :style="cardLayoutStyles(item)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useWorkbench, ModuleRender } from '@/views/workbench';
import { type WorkbenchCard } from '@/typings';

defineOptions({
  name: 'RenderContent',
});

const contentRef = ref<HTMLElement>();

const { gridStyles, cardList } = useWorkbench(contentRef, 'render');

function cardLayoutStyles(card: WorkbenchCard) {
  return {
    'grid-area': `${card.y + 1} / ${card.x + 1} / ${card.y + card.row + 1}/ ${
      card.x + card.column + 1
    }`,
  };
}
</script>

<style lang="scss" scoped></style>
