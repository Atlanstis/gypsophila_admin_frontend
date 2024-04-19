import { useBoolean } from '@/hooks';
import dayjs from 'dayjs';
import { ref } from 'vue';

export function usePolicyApplyModal() {
  const { bool: applyVisible, setTrue: openApplyModal } = useBoolean();

  const applyModalType = ref<Modal.Type>('add');

  function setApplyModalType(type: Modal.Type) {
    applyModalType.value = type;
  }

  const activePolicy = ref<ApiMhxy.GoldTransferPolicy | null>(null);

  function setActivePolicy(policy: ApiMhxy.GoldTransferPolicy) {
    activePolicy.value = policy;
  }

  const editApply = ref<BusinessMhxy.GoldTransferPolicyApplyFormModel | null>(null);

  function setEditApply(apply: ApiMhxy.GoldTransferPolicyApply) {
    const { id, status, nextApplyTime, account } = apply;
    editApply.value = {
      id,
      status,
      nextApplyTime: dayjs(nextApplyTime).valueOf(),
      accountId: account.id,
    };
  }

  return {
    applyVisible,
    openApplyModal,
    applyModalType,
    setApplyModalType,
    activePolicy,
    setActivePolicy,
    editApply,
    setEditApply,
  };
}
