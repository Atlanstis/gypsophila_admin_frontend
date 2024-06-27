import type { IDragItemMove } from './types';

export type ICoordinate = [x1: number, x2: number, x3: number, x4: number];

/**
 * 判断是否重合
 * @param rect1 长方形坐标1
 * @param rect2 长方形坐标2
 */
export function isOverlap(rect1: ICoordinate, rect2: ICoordinate) {
  // 解构长方形坐标
  const [x1_1, y1_1, x1_2, y1_2] = rect1;
  const [x2_1, y2_1, x2_2, y2_2] = rect2;

  // 检查 x 轴和 y 轴是否有交集
  const xOverlap = Math.max(x1_1, x2_1) < Math.min(x1_2, x2_2);
  const yOverlap = Math.max(y1_1, y2_1) < Math.min(y1_2, y2_2);

  // 如果 x 轴和 y 轴都有交集，则长方形重合
  return xOverlap && yOverlap;
}

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
