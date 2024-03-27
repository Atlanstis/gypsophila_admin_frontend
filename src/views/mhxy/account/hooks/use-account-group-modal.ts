import { useBoolean } from '@/hooks';

/** 账号分组管理 */
export function useAccountGroupModal() {
  const { bool: groupManageVisible, setTrue: openGroupManageModal } = useBoolean(false);

  return { groupManageVisible, openGroupManageModal };
}
