<template>
  <div class="move-mask" :style="styles"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores';
import { type IGaps } from '../types';

defineOptions({
  name: 'MoveMask',
});

const props = defineProps<{
  /** 容器格子宽 */
  width: number;
  /** 容器格子高 */
  height: number;
  /** 格子间隔 */
  gaps: IGaps;
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
  const { gaps, height, width, y, x, column, row } = props;
  const transformY = height * y + y * gaps[1];
  const transformX = width * x + x * gaps[0];
  return {
    width: `${width * column + (column - 1) * gaps[0]}px`,
    height: `${height * row + (row - 1) * gaps[1]}px`,
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
