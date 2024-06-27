<template>
  <div class="drag-item">
    <div class="drag-item__el" draggable="true" @dragstart="onDragstart" @dragend="onDragend">
      <slot></slot>
    </div>
    <div class="drag-item__title">测试</div>
  </div>
</template>

<script setup lang="ts">
import type { IDragItem } from '../types';
import { dragStore } from '../utils';

const data: IDragItem = {
  id: 4,
  x: 0,
  y: 0,
  column: 2,
  row: 1,
};

const onDragstart = () => {
  dragStore.set({ ...data });
};
const onDragend = () => dragStore.remove();
</script>

<style lang="scss" scoped>
.drag-item {
  width: 100px;
  height: 88px;
  display: flex;
  flex-direction: column;
  cursor: move;

  &__el {
    width: 100px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #dddddd;
  }

  &__title {
    text-align: center;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #555555;
    line-height: 14px;
    margin-top: 14px;
  }
}
</style>
