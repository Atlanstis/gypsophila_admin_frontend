import { computed, watch } from 'vue';
import { useBoolean } from './use-boolean';

export type ModalProps = {
  visible: boolean;
};

export type ModalEmits = {
  (e: 'update:visible', visible: boolean): void;
};
/**
 * 模态框的相关操作
 * @param props 组件 props
 * @param emits 组件 emits
 * @param visibleTrue 模态框打开时执行的操作
 * @param visibleFalse  模态框关闭时执行的操作
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
    /** 模态框显示状态 */
    modalVisible,
    /** 关闭模态框 */
    closeModal,
    /** 提交加载状态 */
    submitLoading,
    /** 显示提交加载状态 */
    showLoading,
    /** 关闭提交加载状态 */
    closeLoading,
  };
}
