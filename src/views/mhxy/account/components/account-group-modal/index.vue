<template>
  <NModal
    v-model:show="modalVisible"
    :title="'分组管理'"
    preset="card"
    :segmented="true"
    class="w-500px"
  >
    <NSpace class="pb-12px" justify="space-between">
      <NButton type="primary" @click="onGroupAdd">
        <icon-ic-round-plus class="mr-4px text-20px" />
        新增
      </NButton>
    </NSpace>
    <NDataTable
      striped
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="false"
    ></NDataTable>
    <AccountGroupOperationModal
      v-model:visible="operationModalVisible"
      :type="operationModalType"
      :edit-data="operationEditData"
      @on-success="getTableData"
    ></AccountGroupOperationModal>
  </NModal>
</template>

<script lang="ts" setup>
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { useGroupOperationModal, useGroupTable } from './hooks';
import { mhxyAccountGroupDelete } from '@/service';
import { AccountGroupOperationModal } from '..';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'AccountGroupManageModal',
});

export type Props = {} & ModalProps;

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emits = defineEmits<ModalEmits>();

/** 处理数据的编辑 */
function handleEdit(editData: ApiMhxy.AccountGroup) {
  setOperationEditData(editData);
  setOperationModalType('edit');
  openOpetationModal();
}

/** 处理数据的删除 */
async function handleDelete(id: number) {
  const { error } = await mhxyAccountGroupDelete(id);
  if (!error) {
    window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
    getTableData();
  }
}

const { columns, tableData, getTableData, clearTableData, loading } = useGroupTable(
  props,
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
} = useGroupOperationModal();

function onGroupAdd() {
  setOperationModalType('add');
  openOpetationModal();
}

/** 模态框打开，执行的操作 */
function openHandle() {
  getTableData();
}

/** 模态框关闭，执行的操作 */
function closeHandle() {
  clearTableData();
}
</script>

<style lang="scss" scoped></style>
