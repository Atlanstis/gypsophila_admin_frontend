<template>
  <div class="move-mask" :style="styles"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores';

defineOptions({
  name: 'MoveMask',
});

const props = defineProps<{
  /** 容器格子宽 */
  width: number;
  /** 容器格子高 */
  height: number;
  /** 格子间隔 */
  gap: number;
  /** 拖拽元素列数 */
  column: number;
  /** 拖拽元素行数 */
  row: number;
  /** 拖拽元素 x 坐标 */
  x: number;
  /** 拖拽元素 y 坐标 */
  y: number;
  /** 是否可放置 */
  canDrop: boolean;
}>();

const theme = useThemeStore();

const styles = computed(() => {
  const { gap, height, width, y, x, column, row } = props;
  const transformY = height * y + y * gap;
  const transformX = width * x + x * gap;
  return {
    width: `${width * column + (column - 1) * gap}px`,
    height: `${height * row + (row - 1) * gap}px`,
    transform: `translate(${transformX}px,${transformY}px)`,
    backgroundColor: props.canDrop ? theme.otherColor.info : theme.otherColor.error,
  };
});
</script>

<style lang="scss" scoped>
.move-mask {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  transition: all 0.2s;
  z-index: 2;
  opacity: 0.3;
  border-radius: 6px;
}
</style>
