<template>
  <NModal
    v-model:show="modalVisible"
    :title="'权限管理'"
    preset="card"
    :segmented="true"
    class="w-720px"
  >
    <NSpace class="pb-12px" justify="space-between">
      <NButton type="primary" @click="handlePermissionAdd">
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
    <PermissionOperateModal
      v-model:visible="operationModalVisible"
      :type="operationModalType"
      :menu-id="menuId"
      :edit-data="operationEditData"
      @on-success="getTableData"
    ></PermissionOperateModal>
  </NModal>
</template>

<script lang="ts" setup>
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { menuPermissionDelete } from '@/service';
import { usePermissionOperation, usePermissionTable } from './hooks';
import { PermissionOperateModal } from './components';

defineOptions({
  name: 'PermissionModal',
});

export type Props = {
  menuId: Common.Nullable<number>;
} & ModalProps;

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuId: null,
});

const emits = defineEmits<ModalEmits>();

/** 处理数据的编辑 */
function handleEdit(editData: ResMenu.MenuPermission) {
  setOperationEditData(editData);
  setOperationModalType('edit');
  openOpetationModal();
}

/** 处理数据的删除 */
async function handleDelete(id: number) {
  const { error, msg } = await menuPermissionDelete(id);
  if (!error) {
    window.$message?.success(msg);
    getTableData();
  }
}

const { columns, tableData, getTableData, clearTableData, loading } = usePermissionTable(
  props,
  handleEdit,
  handleDelete,
);
const { modalVisible } = useModal(props, emits, openHandle, closeHandle);
const {
  operationModalVisible,
  openOpetationModal,
  operationModalType,
  setOperationModalType,
  operationEditData,
  setOperationEditData,
} = usePermissionOperation();

function handlePermissionAdd() {
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
