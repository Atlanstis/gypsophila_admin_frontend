<template>
  <template v-if="isRenderIconLocal">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, useAttrs } from 'vue';

defineOptions({
  name: 'SvgIcon',
});

interface Props {
  /** 图标名称 */
  icon?: string;
  /** 本地svg的文件名 */
  iconLocal?: string;
}

const props = defineProps<Props>();

const attrs = useAttrs();

const bindAttrs = computed(() => {
  return {
    class: (attrs.class as string) || '',
    style: (attrs.style as string) || '',
  };
});

const symbolId = computed(() => {
  const prefix = 'icon-local';
  const icon = props.iconLocal;
  return `#${prefix}-${icon}`;
});

/** 是否渲染本地 Icon */
const isRenderIconLocal = computed(() => Boolean(props.iconLocal));
</script>

<style lang="scss" scoped></style>
