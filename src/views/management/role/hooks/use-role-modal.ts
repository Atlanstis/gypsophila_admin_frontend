import { useBoolean } from '@/hooks';
import { ref } from 'vue';

export function useRoleModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  const editData = ref<ApiManagement.Role | null>(null);

  function setEditData(data: ApiManagement.Role | null) {
    editData.value = data;
  }

  return { visible, openModal, modalType, setModalType, editData, setEditData };
}
