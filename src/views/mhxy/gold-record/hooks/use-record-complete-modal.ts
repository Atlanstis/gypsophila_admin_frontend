import { useBoolean } from '@/hooks';
import { ref } from 'vue';

type RecordId = ApiMhxy.AccountGoldRecord['id'];

export function useRecordCompleteModal() {
  const { bool: completeVisible, setTrue: openCompleteModal } = useBoolean(false);

  const recordId = ref<RecordId>();

  function setRecordId(id: RecordId) {
    recordId.value = id;
    openCompleteModal();
  }

  return {
    completeVisible,
    recordId,
    setRecordId,
  };
}
