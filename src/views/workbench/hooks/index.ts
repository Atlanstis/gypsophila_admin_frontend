import { computed, type Ref } from 'vue';
import { useWorkbenchStore } from '@/stores';
import { useElementSize } from '@vueuse/core';

export function useWorkbench(contentRef: Ref<HTMLElement | undefined>, type: 'render' | 'setting') {
  const workbenchStore = useWorkbenchStore();

  const { cardList } = workbenchStore;

  const { width: contentWidth } = useElementSize(contentRef);

  const cellSize = computed(() => {
    const {
      layoutConfig: {
        gaps: [columnGap],
        columns,
        cellHeight,
      },
    } = workbenchStore;
    return {
      width: (contentWidth.value - (columns - 1) * columnGap) / columns,
      height: cellHeight,
    };
  });

  const gridStyles = computed(() => {
    const {
      layoutConfig: {
        gaps: [columnGap, rowGap],
        columns,
        rows,
        cellHeight,
      },
      cardList,
    } = workbenchStore;

    const maxRow = Math.max(...cardList.map((item) => item.y + item.row));

    return {
      display: 'grid',
      'row-gap': `${rowGap}px`,
      'column-gap': `${columnGap}px`,
      'grid-template-columns': `repeat(${columns}, ${cellSize.value.width}px)`,
      'grid-template-rows': `repeat(${type === 'render' ? maxRow : rows}, ${cellHeight}px)`,
    };
  });
  return {
    cardList,
    cellSize,
    gridStyles,
  };
}
