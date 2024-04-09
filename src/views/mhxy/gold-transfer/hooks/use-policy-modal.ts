import { useBoolean } from '@/hooks';

export function usePolicyModal() {
  const { bool: policyVisible, setTrue: openPolicyModal } = useBoolean(false);

  return {
    /** 控制 modal 显示 */
    policyVisible,
    /** 打开 modal */
    openPolicyModal,
  };
}
