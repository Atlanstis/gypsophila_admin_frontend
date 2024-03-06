import { useBoolean } from '@/hooks';
import { ref } from 'vue';

type FinishId = ApiMhxy.AccountGoldTransfer['id'];

export function useTransferFinishModal() {
  const { bool: finishVisible, setTrue: openFinishModal } = useBoolean(false);

  const finishId = ref<FinishId>();

  function setFinishId(id: FinishId) {
    finishId.value = id;
    openFinishModal();
  }

  return {
    finishVisible,
    finishId,
    setFinishId,
  };
}
