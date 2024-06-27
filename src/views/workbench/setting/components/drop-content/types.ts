export type IDragItem = {
  id: number | string;
  x: number;
  y: number;
  column: number;
  row: number;
};

export type IDragItemMove = IDragItem & {
  offsetX?: number;
  offsetY?: number;
};

export type IMoveMask = IDragItem & { show: boolean };

export type IGaps = [columnGap: number, rowGap: number];
