import { useBoolean } from '@/hooks';

export function useTransferModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  return {
    /** 控制 modal 显示 */
    visible,
    /** 打开 modal */
    openModal,
  };
}
