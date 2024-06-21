<template>
  <div
    class="preview-item"
    :style="previewStyle"
    draggable="true"
    @dragstart="onDragstart"
    @dragend="onDragend"
    @mousedown.self="onMousedown"
  >
    <div class="preview-item__default">
      <NCard :bordered="false" class="h-full"></NCard>
      <IconLocalRightBottom class="absolute right-0 bottom-0 text-20px color-primary" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { IDragItem, IDragItemMove } from './types';
import { dragStore } from './hooks';

const emits = defineEmits<{
  (e: 'resize-start'): void;
  (e: 'resizing', size: { height: number; width: number }): void;
  (e: 'resize-end'): void;
}>();

const props = defineProps<{ data: IDragItem }>();
defineOptions({
  name: 'DropItem',
});

const moveing = ref(false);
const resizing = ref(false);

const previewStyle = computed(() => {
  return {
    'grid-area': `${props.data.y + 1} / ${props.data.x + 1} / ${
      props.data.y + props.data.row + 1
    }/ ${props.data.x + props.data.column + 1}`,
    ...(moveing.value
      ? {
          opacity: 0,
          // 将当前元素移出容器外,将元素占位空置出来
          transform: `translate(-999999999px, -9999999999px)`,
        }
      : {}),
    ...(resizing.value ? { opacity: 0.5 } : {}),
  };
});

function onDragstart(e: DragEvent) {
  const data: IDragItemMove = { ...props.data, offsetX: e.offsetX, offsetY: e.offsetY };
  dragStore.set(data);
  // 拖拽开始立刻设置 opacity: 0 会导致拖拽默认样式也会为 opacity: 0 , 需要延迟设置
  setTimeout(() => (moveing.value = true));
  unset(e.target as HTMLElement);
}

function onDragend() {
  moveing.value = false;
  dragStore.remove();
}

function mousemoveFunc(e: MouseEvent) {
  // console.log('mousemoveFunc');
  if (!e.target) return;
  // console.log(e.target);
  emits('resizing', {
    width: (e.target as HTMLElement).offsetWidth || 0,
    height: (e.target as HTMLElement).offsetHeight || 0,
  });
}

function mouseupFunc(e: MouseEvent) {
  const target = e.target as HTMLElement;
  unset(target);
  emits('resize-end');
  target.style.width = '100%';
  target.style.height = '100%';
  dragStore.remove();
}

function onMousedown(e: MouseEvent) {
  // console.log('onMousedown');
  // console.log(e.target);
  dragStore.set({ ...props.data });
  emits('resize-start');
  resizing.value = true;
  const target = e.target as HTMLElement;
  if (!target) return;
  target.addEventListener('mousemove', mousemoveFunc);
  target.addEventListener('mouseup', mouseupFunc);
}

const unset = (target: HTMLElement) => {
  resizing.value = false;
  if (!target) return;
  target.removeEventListener('mousemove', mousemoveFunc);
  target.removeEventListener('mouseup', mouseupFunc);
};
</script>

<style lang="scss" scoped>
.preview-item {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: all;
  opacity: 1;
  user-select: none;
  overflow: auto;
  resize: both;
  &::-webkit-resizer {
    background-color: transparent;
  }

  &__default {
    position: absolute;
    cursor: move;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: #fff;
    border: 2px solid rgb(var(--primary-color-hover));

    &:hover {
      border-color: rgb(var(--primary-color));
      transition: all 0.2s;
    }
  }
}
</style>
