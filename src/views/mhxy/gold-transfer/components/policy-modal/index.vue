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
      :row-key="(row: ApiMhxy.GoldTransferPolicy) => row.id"
      :expanded-row-keys="expandedRowKeys"
      :on-update:expanded-row-keys="onUpdateExpandedRowKeys"
    ></NDataTable>
    <PolicyOperationModal
      v-model:visible="operationModalVisible"
      :type="operationModalType"
      :edit-data="operationEditData"
      @on-success="getTableData"
    ></PolicyOperationModal>
    <PolicyApplyModal
      v-model:visible="applyVisible"
      :type="applyModalType"
      :policy="activePolicy"
      :edit-data="editApply"
      @on-success="onPolicyApplied"
    ></PolicyApplyModal>
  </NModal>
</template>

<script lang="ts" setup>
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { usePolicyApplyModal, usePolicyOperationModal, usePolicyTable } from './hooks';
import { mhxyGoldTransferPolicyDelete } from '@/service';
import { PolicyOperationModal, PolicyApplyModal } from '..';
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

const {
  columns,
  tableData,
  getTableData,
  loading,
  pagination,
  expandedRowKeys,
  onUpdateExpandedRowKeys,
  changeRefreshSignal,
} = usePolicyTable(handleEdit, onApply, onApplyEdit, handleDelete);

const { modalVisible } = useModal(props, emits, openHandle, closeHandle);

const {
  operationModalVisible,
  operationModalType,
  operationEditData,
  openOpetationModal,
  setOperationModalType,
  setOperationEditData,
} = usePolicyOperationModal();

const {
  applyVisible,
  openApplyModal,
  applyModalType,
  setApplyModalType,
  activePolicy,
  setActivePolicy,
  editApply,
  setEditApply,
} = usePolicyApplyModal();

async function onApply(policy: ApiMhxy.GoldTransferPolicy) {
  setActivePolicy(policy);
  setApplyModalType('add');
  openApplyModal();
}

async function onApplyEdit(
  policy: ApiMhxy.GoldTransferPolicy,
  apply: ApiMhxy.GoldTransferPolicyApply,
) {
  setActivePolicy(policy);
  setApplyModalType('edit');
  setEditApply(apply);
  openApplyModal();
}

/**
 * 应用策略到新的账号时，刷新展开的账号应用数据
 */
function onPolicyApplied() {
  changeRefreshSignal();
}

function onPolicyAdd() {
  setOperationModalType('add');
  openOpetationModal();
}

/** 模态框打开，执行的操作 */
function openHandle() {
  getTableData();
}

/** 模态框关闭，执行的操作 */
function closeHandle() {
  onUpdateExpandedRowKeys([]);
}
</script>

<style lang="scss" scoped></style>
