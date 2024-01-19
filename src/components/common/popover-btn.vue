<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button size="small" :type="type" ghost @click="onBtnClick">
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
import { ButtonIconEnum } from '@/enums';
import { type Type } from 'naive-ui/es/button/src/interface';

defineOptions({
  name: 'PopoverBtn',
});

type Props = {
  /** 悬浮显示信息 */
  msg: string;
  /** 显示 icon */
  icon?: ButtonIconEnum;
  type?: Type;
};

const { iconRender } = useIconRender();

const props = withDefaults(defineProps<Props>(), {
  msg: '',
  type: 'default',
});

const emit = defineEmits<{ (e: 'click'): void }>();

function onBtnClick() {
  emit('click');
}

const Icon = computed(() => iconRender({ icon: props.icon, fontSize: 18 }));
</script>

<style lang="scss" scoped></style>
