<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button
        size="small"
        :type="type"
        :disabled="loading"
        ghost
        :bordered="bordered"
        @click="onBtnClick"
      >
        <template #icon>
          <Icon :class="loading ? 'animate-spin' : ''"></Icon>
        </template>
      </n-button>
    </template>
    <span>{{ loading ? loadingMsg : msg }}</span>
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
  /** 执行中显示信息 */
  loadingMsg?: string;
  /** 显示 icon */
  icon?: ButtonIconEnum;
  /** 按钮类型 */
  type?: Type;
  /** 执行中 */
  loading?: boolean;
  bordered?: boolean;
};

const { iconRender } = useIconRender();

const props = withDefaults(defineProps<Props>(), {
  msg: '',
  type: 'default',
  loading: false,
  bordered: false,
});

const emit = defineEmits<{ (e: 'click'): void }>();

function onBtnClick() {
  emit('click');
}

const Icon = computed(() => iconRender({ icon: props.icon, fontSize: 18 }));
</script>

<style lang="scss" scoped></style>
