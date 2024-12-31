import { useBoolean } from '@/hooks';
import { ref } from 'vue';

export function usePermissionSetModal() {
  const { bool: permissionSetModalVisible, setTrue: openPermissionSetModal } = useBoolean(false);

  const permissionSetRoleId = ref<Common.Nullable<number>>(null);

  function setpermissionSetRoleId(id: number) {
    permissionSetRoleId.value = id;
  }

  return {
    permissionSetModalVisible,
    openPermissionSetModal,
    permissionSetRoleId,
    setpermissionSetRoleId,
  };
}
