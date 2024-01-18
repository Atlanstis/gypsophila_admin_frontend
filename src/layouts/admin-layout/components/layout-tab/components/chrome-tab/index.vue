<template>
  <div
    class="chrome-tab"
    :class="{ __hover: isHover, __active: isActive }"
    @mouseenter="setHoverTrue"
    @mouseleave="setHoverFalse"
  >
    <div class="chrome-tab__bg">
      <svg-radius-bg :is-active="isActive" :is-hover="isHover" :primary-color="theme.themeColor" />
    </div>
    <span class="chrome-tab__slot">
      <span :style="{ color: isActive ? theme.themeColor : '' }">
        <slot name="prefix" :style="{ color: isActive ? theme.themeColor : '' }"></slot>
      </span>
      <span :style="{ color: isActive ? theme.themeColor : '' }" class="m-l-6px">
        <slot></slot>
      </span>
    </span>
    <div v-if="closable" class="admin-tab__chrome-tab__icon">
      <icon-close :is-active="isActive" :active-color="theme.themeColor" @click="handleClose" />
    </div>
    <div class="chrome-tab__divider" :class="{ __hide: isHover || isActive }"></div>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';
import { useThemeStore } from '@/stores';
import { SvgRadiusBg, IconClose } from './components';

defineOptions({
  name: 'ChromeTab',
});

interface Props {
  /** 激活状态 */
  isActive?: boolean;
  /** 是否显示关闭图标 */
  closable?: boolean;
}

interface Emits {
  (e: 'close'): void;
}

withDefaults(defineProps<Props>(), {
  isActive: false,
  closable: true,
});

const emits = defineEmits<Emits>();

const theme = useThemeStore();

function handleClose(e: MouseEvent) {
  e.stopPropagation();
  emits('close');
}

const { bool: isHover, setTrue: setHoverTrue, setFalse: setHoverFalse } = useBoolean();
</script>

<style lang="scss" scoped>
.chrome-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding-left: 24px;
  padding-right: 24px;
  margin-right: -18px;
  cursor: pointer;
  &.__hover {
    z-index: 9;
  }
  &.__active {
    z-index: 10;
  }
}
.chrome-tab__bg {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.chrome-tab__slot {
  position: relative;
  z-index: 2;
  white-space: nowrap;
}
.chrome-tab__divider {
  position: absolute;
  right: 7.5px;
  z-index: 2;
  width: 1px;
  height: 16px;
  background-color: #919698;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  &.__hide {
    opacity: 0;
  }
}
</style>
