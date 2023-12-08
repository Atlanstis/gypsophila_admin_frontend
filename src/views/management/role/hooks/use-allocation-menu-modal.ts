import { useBoolean } from '@/hooks';
import { ref } from 'vue';

/** 有关权限控制 modal 的操作 */
export function useAllocationMenuModal() {
  const { bool: visibleAllocationMenu, setTrue: openAllocationMenuModal } = useBoolean(false);

  const allocationRoleId = ref<number | null>(null);

  function setAllocationRoleId(id: number) {
    allocationRoleId.value = id;
  }

  return {
    visibleAllocationMenu,
    openAllocationMenuModal,
    allocationRoleId,
    setAllocationRoleId,
  };
}
