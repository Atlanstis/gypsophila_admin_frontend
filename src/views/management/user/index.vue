<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace v-if="operation.canAdd" class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleUserAdd">
              <icon-ic-round-plus class="mr-4px text-20px" />
              新增
            </NButton>
          </NSpace>
        </NSpace>
      </template>
      <template #content>
        <NDataTable
          flex-height
          striped
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :rowKey="(user: ApiManagement.User) => user.id"
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
    <UserModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @on-success="getUserTableData"
    ></UserModal>
  </div>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
import { onMounted } from 'vue';
import { userDelete } from '@/service';
import UserModal from './components/user-modal.vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { useTable, useUserModal } from './hooks';
import { useRoute } from 'vue-router';
import { usePageOperationPermission } from '@/hooks';

defineOptions({
  name: 'UserManagementView',
});

const route = useRoute();

const { operation, getOperationPermission } = usePageOperationPermission(route, getUserTableData);

const { visible, openModal, modalType, setModalType, editData, setEditData } = useUserModal();

const { columns, loading, endLoading, tableData, getTableData, pagination } = useTable(
  operation,
  handleEdit,
  handleDelete,
);

function handleUserAdd() {
  setModalType('add');
  openModal();
}

function handleEdit(row: ApiManagement.User) {
  setModalType('edit');
  setEditData(row);
  openModal();
}

async function handleDelete(id: string) {
  const { error } = await userDelete({ id });
  if (error) return;
  window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
  getUserTableData();
}

/**
 * 当存在列表权限时，获取列表数据
 */
function getUserTableData() {
  if (operation.value.canList) {
    getTableData();
  } else {
    endLoading();
  }
}

onMounted(() => {
  getOperationPermission();
});
</script>

<style lang="scss" scoped></style>
