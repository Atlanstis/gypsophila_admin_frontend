<template>
  <div
    class="icon-close"
    :style="{ color: isActive ? activeColor : defaultColor }"
    @mouseenter="setHoverTrue"
    @mouseleave="setHoverFalse"
  >
    <transition name="fade">
      <svg-close-circle v-if="isHover" key="hover" class="icon-close__svg" />
      <svg-close v-else key="unhover" class="icon-close__svg" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';
import SvgClose from './svg-close.vue';
import SvgCloseCircle from './svg-close-circle.vue';

defineOptions({ name: 'IconClose' });

interface Props {
  /** 激活状态 */
  isActive?: boolean;
  /** 默认颜色 */
  defaultColor?: string;
  /** 激活时的颜色 */
  activeColor?: string;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
  defaultColor: '#9ca3af',
  activeColor: '#1890ff',
});

const { bool: isHover, setTrue: setHoverTrue, setFalse: setHoverFalse } = useBoolean();
</script>
<style lang="scss" scoped>
.icon-close {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 14px;
  padding-left: 18px;
}
.icon-close__svg {
  position: absolute;
  width: 16px;
  height: 16px;
}
</style>
