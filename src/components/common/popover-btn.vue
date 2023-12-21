<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button size="small" @click="onBtnClick">
        <template #icon>
          <Icon></Icon>
        </template>
      </n-button>
    </template>
    <span>{{ props.msg }}</span>
  </n-popover>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useIconRender } from '@/composables';

defineOptions({
  name: 'PopoverBtn',
});

type Props = {
  /** 悬浮显示信息 */
  msg: string;
  /** 显示 icon */
  icon: string;
};

const { iconRender } = useIconRender();

const props = withDefaults(defineProps<Props>(), {
  msg: '',
  icon: '',
});

const emit = defineEmits<{ (e: 'click'): void }>();

function onBtnClick() {
  emit('click');
}

const Icon = computed(() => iconRender({ icon: props.icon, fontSize: 18 }));
</script>

<style lang="scss" scoped></style>
