import { useBoolean } from '@/hooks';
import { ref } from 'vue';
import type { RoleModel } from '../typings';

export function useRoleModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  const editData = ref<Common.Nullable<RoleModel>>(null);

  function setEditData(data: ResRole.RoleListData) {
    const { id, name, desc } = data;
    editData.value = { id, name, desc };
  }

  return { visible, openModal, modalType, setModalType, editData, setEditData };
}
