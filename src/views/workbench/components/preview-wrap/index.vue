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
      <ModuleRender v-if="data.type" :type="data.type" class="h-full z-0" />
      <IconCarbonCloseFilled
        class="icon absolute top-4px right-4px text-20px cursor-pointer"
        @click="onDelete"
      ></IconCarbonCloseFilled>
      <IconLocalRightBottom class="icon absolute right-0 bottom-0 text-20px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { WorkbenchCardMove, WorkbenchCard } from '@/typings';
import { dragStore, ModuleRender } from '@/views/workbench';

const emits = defineEmits<{
  (e: 'resize-start'): void;
  (e: 'resizing', size: { height: number; width: number }): void;
  (e: 'resize-end'): void;
  (e: 'delete', id: WorkbenchCard['id']): void;
}>();

const props = defineProps<{ data: WorkbenchCard }>();
defineOptions({
  name: 'PreviewWrap',
});

const moveing = ref(false);
const resizing = ref(false);
const activeResizeEle = ref<HTMLElement>();

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

/** 删除 */
function onDelete() {
  emits('delete', props.data.id);
}

/** 开始拖拽 */
function onDragstart(e: DragEvent) {
  const data: WorkbenchCardMove = { ...props.data, offsetX: e.offsetX, offsetY: e.offsetY };
  dragStore.set(data);
  // 拖拽开始立刻设置 opacity: 0 会导致拖拽默认样式也会为 opacity: 0 , 需要延迟设置
  setTimeout(() => (moveing.value = true));
  unset(e.target as HTMLElement);
}

/** 拖拽结束 */
function onDragend() {
  moveing.value = false;
  dragStore.remove();
}

/**  调整大小中 */
function mousemoveFunc(e: MouseEvent) {
  if (!e.target) return;
  emits('resizing', {
    width: (e.target as HTMLElement).offsetWidth || 0,
    height: (e.target as HTMLElement).offsetHeight || 0,
  });
}

/** 监听全局，鼠标释放时，重置布局 */
function onWindowMouseup() {
  const ele = activeResizeEle.value;
  if (ele) {
    onResizeEnd(ele);
    activeResizeEle.value = undefined;
    window.removeEventListener('mouseup', onWindowMouseup);
  }
}

/** 调整大小时，离开调整区域 */
function mouseleaveFunc(e: MouseEvent) {
  activeResizeEle.value = e.target as HTMLElement;
  window.addEventListener('mouseup', onWindowMouseup);
}

/** 离开目标区域后，游重新进入目标区域 */
function mouseenterFunc() {
  activeResizeEle.value = undefined;
  window.removeEventListener('mouseup', onWindowMouseup);
}

/** 释放鼠标，重置布局 */
function mouseupFunc(e: MouseEvent) {
  onResizeEnd(e.target as HTMLElement);
}

/** 大小调整结束 */
function onResizeEnd(target: HTMLElement) {
  unset(target);
  emits('resize-end');
  target.style.width = '100%';
  target.style.height = '100%';
  dragStore.remove();
}

/** 开始调整大小 */
function onMousedown(e: MouseEvent) {
  dragStore.set({ ...props.data });
  emits('resize-start');
  resizing.value = true;
  const target = e.target as HTMLElement;
  if (!target) return;
  target.addEventListener('mousemove', mousemoveFunc);
  target.addEventListener('mouseleave', mouseleaveFunc);
  target.addEventListener('mouseenter', mouseenterFunc);
  target.addEventListener('mouseup', mouseupFunc);
}

/** 解除调整大小相关事件 */
const unset = (target: HTMLElement) => {
  resizing.value = false;
  if (!target) return;
  target.removeEventListener('mousemove', mousemoveFunc);
  target.removeEventListener('mouseleave', mouseleaveFunc);
  target.addEventListener('mouseenter', mouseenterFunc);
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
    transition: all 0.2s;

    .icon {
      color: rgb(var(--primary-color-hover));
      &:hover {
        color: rgb(var(--primary-color));
      }
    }

    &:hover {
      border-color: rgb(var(--primary-color));
    }
  }
}
</style>
