import { useBoolean } from '@/hooks';
import { ref } from 'vue';

/** 新增编辑 */
export function usePolicyOperationModal() {
  const { bool: operationModalVisible, setTrue: openOpetationModal } = useBoolean(false);

  const operationModalType = ref<Modal.Type>('add');

  function setOperationModalType(type: Modal.Type) {
    operationModalType.value = type;
  }

  const operationEditData = ref<BusinessMhxy.GoldTransferPolicyFormModel | null>(null);

  function setOperationEditData(data: ApiMhxy.GoldTransferPolicy) {
    operationEditData.value = {
      id: data.id,
      name: data.name,
      quota: data.quota,
      cycleByDay: data.cycleByDay,
      propCategoryId: data.propCategory.id,
    };
  }

  return {
    /** 模态框显示开关 */
    operationModalVisible,
    /** 打开模态框 */
    openOpetationModal,
    /** 模态框 */
    operationModalType,
    /** 设置模态框类型 */
    setOperationModalType,
    /** 模态框编辑时的数据 */
    operationEditData,
    /** 设置要编辑的数据 */
    setOperationEditData,
  };
}
