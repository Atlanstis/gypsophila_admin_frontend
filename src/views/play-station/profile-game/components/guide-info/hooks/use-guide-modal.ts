import { useBoolean } from '@/hooks';
import { ref } from 'vue';

export function useGuideModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  const editData = ref<ApiPsn.ProfileGameGuide | null>(null);

  const setEditData = (val: ApiPsn.ProfileGameGuide | null) => {
    if (val) {
      editData.value = { ...val };
    }
  };

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  return {
    visible,
    openModal,
    modalType,
    setModalType,
    editData,
    setEditData,
  };
}
