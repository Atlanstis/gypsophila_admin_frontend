<template>
  <div ref="DropContentRef" class="drop-content">
    <div
      class="drop-content__drop-container"
      :style="gridStyles"
      @dragenter="onDragenter"
      @dragover="onDragover"
      @dragleave="onDragleave"
      @drop="onDrop"
    >
      <template v-for="x in rows">
        <div class="bg-column" v-for="y in columns" :key="`${x}-${y}`"></div>
      </template>
    </div>
    <div class="drop-content__preview" :style="gridStyles">
      <PreviewItem
        v-for="item in list"
        :key="item.id"
        :data="item"
        :style="{
          pointerEvents: mask.show && item.id !== mask.id ? 'none' : 'auto',
        }"
        @resize-start="onResizeStart"
        @resizing="onResizeing"
        @resize-end="onResizeEnd"
      >
      </PreviewItem>
      <MoveMask
        v-show="mask.show"
        v-bind="mask"
        :width="boxSize.width"
        :height="boxSize.height"
        :gaps="props.gaps"
        :canDrop="canDrop"
      >
      </MoveMask>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { isOverlap, type ICoordinate, dragStore } from './utils';
import type { IDragItem, IGaps, IMoveMask } from './types';
import { PreviewItem, MoveMask } from './components';
import { useElementSize } from '@vueuse/core';

defineOptions({
  name: 'DropContent',
});

const props = withDefaults(
  defineProps<{
    columns?: number;
    rows?: number;
    gaps?: IGaps;
    height?: number;
    list: IDragItem[];
  }>(),
  {
    columns: 12,
    rows: 8,
    gaps: () => [8, 8],
    height: 80,
    list: () => [],
  },
);

export type Emits = {
  (e: 'update:list', list: IDragItem[]): void;
};

const emit = defineEmits<Emits>();

const mask = reactive<IMoveMask>({
  show: false,
  id: '',
  x: 0,
  y: 0,
  column: 0,
  row: 0,
});

const gridStyles = computed(() => {
  const [columnGap, rowGap] = props.gaps;
  return {
    display: 'grid',
    'row-gap': `${rowGap}px`,
    'column-gap': `${columnGap}px`,
    'grid-template-columns': `repeat(${props.columns}, ${boxSize.value.width}px)`,
    'grid-template-rows': `repeat(${props.rows}, ${boxSize.value.height}px)`,
  };
});

/** 模块是否可放置 */
const canDrop = computed(() => {
  const dragCoordinate: ICoordinate = [mask.x, mask.y, mask.x + mask.column, mask.y + mask.row];
  const coordinates = props.list
    .filter((item) => item.id !== mask.id)
    .map((item) => {
      const coordinate: ICoordinate = [item.x, item.y, item.x + item.column, item.y + item.row];
      return coordinate;
    });
  return !coordinates.some((coordinate) => {
    return isOverlap(dragCoordinate, coordinate);
  });
});

const DropContentRef = ref<HTMLElement>();
const { width: contentWidth } = useElementSize(DropContentRef);

const boxSize = computed(() => {
  return {
    width: (contentWidth.value - (props.columns - 1) * props.gaps[0]) / props.columns,
    height: props.height,
  };
});

/** 拖拽进入布局 */
function onDragenter(e: DragEvent) {
  e.preventDefault();
  const dragData = dragStore.get();
  if (dragData) {
    mask.column = dragData.column;
    mask.row = dragData.row;
    mask.x = getX(e.offsetX) - getX(dragData.offsetX ?? 0);
    mask.y = getY(e.offsetY) - getY(dragData.offsetY ?? 0);
    mask.id = dragData.id;
    mask.show = true;
  }
}

/** 拖拽进行中 */
function onDragover(e: DragEvent) {
  e.preventDefault();
  const dragData = dragStore.get();
  if (dragData) {
    const x = getX(e.offsetX) - getX(dragData.offsetX ?? 0);
    const y = getY(e.offsetY) - getY(dragData.offsetY ?? 0);
    mask.x = x < 0 ? 0 : x + mask.column > props.columns ? props.columns - mask.column : x;
    mask.y = y < 0 ? 0 : y + mask.row > props.rows ? props.rows - mask.row : y;
  }
}

/** 拖拽离开布局 */
function onDragleave(e: DragEvent) {
  e.preventDefault();
  mask.show = false;
  mask.id = '';
}

/** 拖拽放置组件 */
function onDrop(e: DragEvent) {
  e.preventDefault();
  mask.show = false;
  const dragData = dragStore.get();
  if (!canDrop.value) return;
  if (dragData && dragData.id) {
    const item = props.list.find((item) => item.id === dragData.id);
    if (item) {
      item.x = mask.x;
      item.y = mask.y;
    } else {
      const { id, x, y, column, row } = mask;
      emit('update:list', [
        ...props.list,
        {
          id,
          x,
          y,
          column,
          row,
        },
      ]);
    }
  }
}

/** 调整大小开始 */
function onResizeStart() {
  const dragData = dragStore.get();
  if (dragData) {
    mask.column = dragData.column;
    mask.row = dragData.row;
    mask.x = dragData.x;
    mask.y = dragData.y;
    mask.id = dragData.id;
    mask.show = true;
  }
}

/** 调正大小时 */
function onResizeing(size: { width: number; height: number }) {
  mask.column = getColumn(size.width);
  mask.row = getRow(size.height);
}

/** 调整大小结束 */
const onResizeEnd = async () => {
  mask.show = false;
  const dragData = dragStore.get();
  if (!canDrop.value) return;
  if (dragData && dragData.id) {
    const item = props.list.find((item) => item.id === dragData.id);
    if (item) {
      item.column = mask.column;
      item.row = mask.row;
    }
  }
};

/** 计算 x 坐标 */
const getX = (num: number) => Math.floor(num / (boxSize.value.width + props.gaps[0]));
/** 计算 y 坐标 */
const getY = (num: number) => Math.floor(num / (boxSize.value.height + props.gaps[1]));

const ceil = (num: number, min: number = 0.2) =>
  num > 1 && num % 1 > min ? Math.ceil(num) : parseInt(num.toString());

/** 计算列数 */
const getColumn = (num: number) => Math.max(1, ceil(num / (boxSize.value.width + props.gaps[0])));
/** 计算行数 */
const getRow = (num: number) => Math.max(1, ceil(num / (boxSize.value.height + props.gaps[1])));
</script>

<style lang="scss" scoped>
.drop-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  overflow-y: auto;

  &__preview,
  &__drop-container {
    .bg-column {
      border: 1px dashed #ccc;
      border-radius: 6px;
      pointer-events: none;
    }
  }

  &__preview {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
  }
}
</style>
