import { ref } from 'vue';
import { useBoolean } from '@/hooks';
import type { UserModel } from '../typing';

/** 有关用户 Modal 的操作 */
export function useUserModal() {
  const { bool: visible, setTrue: openModal } = useBoolean(false);

  const modalType = ref<Modal.Type>('add');

  function setModalType(val: Modal.Type) {
    modalType.value = val;
  }

  const editData = ref<Common.Nullable<UserModel>>(null);

  function setEditData(data: ResUser.UserListData) {
    const { id, username, nickname, roles } = data;
    editData.value = {
      id: id,
      username: username,
      nickname: nickname,
      roleIds: roles.map((role) => role.id),
    };
  }

  return {
    /** 控制用户 modal 显示 */
    visible,
    /** 打开用户 modal */
    openModal,
    /** 用户 modal 操作类型 */
    modalType,
    /** 设置用户 modal 操作类型  */
    setModalType,
    /** 编辑数据 */
    editData,
    /** 设置编辑数据 */
    setEditData,
  };
}
