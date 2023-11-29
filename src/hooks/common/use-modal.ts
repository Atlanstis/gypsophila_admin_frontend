import { computed, watch } from 'vue';
import { useBoolean } from './use-boolean';

export type ModalProps = {
  visible: boolean;
};

export type ModalEmits = {
  (e: 'update:visible', visible: boolean): void;
};
/**
 *
 * @param props 组件 props
 * @param emits 组件 emits
 * @param visibleTrue modal 打开时执行的操作
 * @param visibleFalse modal 关闭时执行的操作
 */
export function useModal(
  props: ModalProps,
  emits: ModalEmits,
  visibleTrue?: () => void,
  visibleFalse?: () => void,
) {
  const { bool: submitLoading, setTrue: showLoading, setFalse: closeLoading } = useBoolean(false);

  const modalVisible = computed({
    get() {
      return props.visible;
    },

    set(visible) {
      emits('update:visible', visible);
    },
  });

  function closeModal() {
    modalVisible.value = false;
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        visibleTrue && visibleTrue();
      } else {
        visibleFalse && visibleFalse();
      }
    },
  );

  return {
    modalVisible,
    closeModal,
    submitLoading,
    showLoading,
    closeLoading,
  };
}
