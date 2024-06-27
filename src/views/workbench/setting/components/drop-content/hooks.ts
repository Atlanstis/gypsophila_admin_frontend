import { useElementSize } from '@vueuse/core';
import { computed, type Ref } from 'vue';

/**
 * 容器等分尺寸
 * @param {*} target 容器 HTML
 * @param {*} column 列数
 * @param {*} row 行数
 * @param {*} gap 间隔
 * @returns
 */
export const useBoxSize = (
  target: Ref<HTMLElement | undefined>,
  column: number,
  row: number,
  gap: number,
) => {
  const { width, height } = useElementSize(target);
  return computed(() => ({
    width: (width.value - (column - 1) * gap) / column,
    height: (height.value - (row - 1) * gap) / row,
  }));
};
