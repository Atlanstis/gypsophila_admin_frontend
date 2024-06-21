import { useElementSize } from '@vueuse/core';
import { computed, type Ref } from 'vue';
import type { IDragItemMove } from './types';

class DragStore {
  private moveItem: null | IDragItemMove = null;

  get() {
    return this.moveItem;
  }

  set(item: IDragItemMove | null) {
    this.moveItem = item;
  }

  remove() {
    this.set(null);
  }
}

export const dragStore = new DragStore();

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
