import { useBoolean } from '@/hooks';
import { ref } from 'vue';

/** 有关菜单 modal 的操作 */
export function useMenuModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  const editData = ref<BusinessManagement.MenuFormModal | null>(null);

  function setEditData(data: ApiManagement.Menu) {
    const { id, key, name, parentId, type } = data;
    editData.value = {
      id,
      key,
      name,
      parentId,
      type,
    };
  }

  const defaultParentId = ref<number | null>(null);

  function setDefaultParentId(val: number | null) {
    defaultParentId.value = val;
  }

  return {
    /** 控制菜单 modal 显示 */
    visible,
    /** 打开 菜单 modal */
    openModal,
    /** modal 操作类型 */
    modalType,
    /** 设置 modalType */
    setModalType,
    /** modalType 类型为 edit 时，所编辑的数据 */
    editData,
    /** 设置 editData */
    setEditData,
    /** 菜单 modal 所需的父菜单 id */
    defaultParentId,
    /** 设置父菜单 id */
    setDefaultParentId,
  };
}
