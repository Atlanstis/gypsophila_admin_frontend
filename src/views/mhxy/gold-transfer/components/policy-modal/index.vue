<template>
  <NModal
    v-model:show="modalVisible"
    :title="'策略管理'"
    preset="card"
    :segmented="true"
    class="w-800px"
  >
    <NSpace class="pb-12px" justify="space-between">
      <NButton type="primary" @click="onPolicyAdd">
        <icon-ic-round-plus class="mr-4px text-20px" />
        新增
      </NButton>
    </NSpace>
    <NDataTable
      striped
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
    ></NDataTable>
    <PolicyOperationModal
      v-model:visible="operationModalVisible"
      :type="operationModalType"
      :edit-data="operationEditData"
      @on-success="getTableData"
    ></PolicyOperationModal>
  </NModal>
</template>

<script lang="ts" setup>
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { usePolicyOperationModal, usePolicyTable } from './hooks';
import { mhxyGoldTransferPolicyDelete } from '@/service';
import { PolicyOperationModal } from '..';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'GoldTransferPolicyModal',
});

const props = withDefaults(defineProps<ModalProps>(), {
  visible: false,
});

const emits = defineEmits<ModalEmits>();

/** 处理数据的编辑 */
function handleEdit(editData: ApiMhxy.GoldTransferPolicy) {
  setOperationEditData(editData);
  setOperationModalType('edit');
  openOpetationModal();
}

/** 处理数据的删除 */
async function handleDelete(id: number) {
  const { error } = await mhxyGoldTransferPolicyDelete(id);
  if (!error) {
    window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
    getTableData();
  }
}

const { columns, tableData, getTableData, loading, pagination } = usePolicyTable(
  handleEdit,
  handleDelete,
);
const { modalVisible } = useModal(props, emits, openHandle, closeHandle);
const {
  operationModalVisible,
  operationModalType,
  operationEditData,
  openOpetationModal,
  setOperationModalType,
  setOperationEditData,
} = usePolicyOperationModal();

function onPolicyAdd() {
  setOperationModalType('add');
  openOpetationModal();
}

/** 模态框打开，执行的操作 */
function openHandle() {
  getTableData();
}

/** 模态框关闭，执行的操作 */
function closeHandle() {}
</script>

<style lang="scss" scoped></style>
