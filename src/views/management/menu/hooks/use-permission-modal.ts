import { useBoolean } from '@/hooks';
import { ref } from 'vue';

/** 有关权限 modal 的操作 */
export function usePermissionModal() {
  const { bool: permissionModalVisible, setTrue: openPermissionModal } = useBoolean(false);

  const permissionMenuId = ref<number | null>(null);

  function setPermissionMenuId(menuId: number) {
    permissionMenuId.value = menuId;
  }

  return {
    /** 权限 modal 开关 */
    permissionModalVisible,
    /** 打开权限 modal */
    openPermissionModal,
    /**  modal 开关所需的 menuId 参数  */
    permissionMenuId,
    /** 设置 menuId 参数 */
    setPermissionMenuId,
  };
}
