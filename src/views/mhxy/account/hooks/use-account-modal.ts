import { useBoolean } from '@/hooks';
import { ref } from 'vue';

export function useAccountModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  const editData = ref<Partial<BusinessMhxy.AccountFormModel> | null>(null);

  function setEditData(data: ApiMhxy.Account) {
    const { id, name, role, sect, isPrimary } = data;
    editData.value = {
      id,
      name,
      role,
      sect,
      isPrimary,
    };
  }

  return {
    /** 控制 modal 显示 */
    visible,
    /** 打开 modal */
    openModal,
    /** modal 操作类型 */
    modalType,
    /** 设置 modal 操作类型  */
    setModalType,
    /** 编辑数据 */
    editData,
    /** 设置编辑数据 */
    setEditData,
  };
}
