<template>
  <svg style="width: 100%; height: 100%">
    <defs>
      <symbol id="geometry-left" viewBox="0 0 214 36">
        <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
      </symbol>
      <symbol id="geometry-right" viewBox="0 0 214 36">
        <use xlink:href="#geometry-left" />
      </symbol>
      <clipPath>
        <rect width="100%" height="100%" x="0" />
      </clipPath>
    </defs>
    <svg width="52%" height="100%">
      <use xlink:href="#geometry-left" width="214" height="36" :fill="fill" />
    </svg>
    <g transform="scale(-1, 1)">
      <svg width="52%" height="100%" x="-100%" y="0">
        <use xlink:href="#geometry-right" width="214" height="36" :fill="fill" />
      </svg>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mixColor } from '@/utils';

defineOptions({ name: 'SvgRadiusBg' });

interface Props {
  /** 激活状态 */
  isActive?: boolean;
  /** 鼠标悬浮状态 */
  isHover?: boolean;
  /** 主题颜色 */
  primaryColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isHover: false,
  primaryColor: '#646cff',
});

const fill = computed(() => {
  const bgColor = '#ffffff';
  const hoverBgColor = '#dee1e6';
  const mixRatio = 0.2;

  let color = bgColor;
  if (props.isHover) {
    color = hoverBgColor;
  }
  if (props.isActive) {
    const ratio = mixRatio;
    color = mixColor('#ffffff', props.primaryColor, ratio);
  }
  return color;
});
</script>
<style scoped></style>
