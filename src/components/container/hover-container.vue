<template>
  <div v-if="hasTooltip">
    <NPopover :placement="placement" trigger="hover">
      <template #trigger>
        <div class="h-full flex-center cursor-pointer hover:bg-#f6f6f6">
          <slot></slot>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </NPopover>
  </div>
  <div v-else class="flex-center cursor-pointer hover:bg-#f6f6f6">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { PopoverPlacement } from 'naive-ui';
import { computed } from 'vue';

defineOptions({
  name: 'HoverContainer',
});

interface Props {
  tooltip?: string;
  placement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  placement: 'bottom',
});

const hasTooltip = computed(() => Boolean(props.tooltip));
</script>

<style lang="scss" scoped></style>
