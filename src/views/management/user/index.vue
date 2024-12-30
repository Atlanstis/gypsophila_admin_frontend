<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NButton v-if="permission.add" type="primary" @click="handleUserAdd">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </NButton>
        </NSpace>
      </template>
      <template #content>
        <NDataTable
          v-if="permission.watch"
          flex-height
          striped
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :rowKey="(user: ResUser.UserListData) => user.id"
          :pagination="pagination"
        ></NDataTable>
        <NSpace v-else justify="center" align="center">
          <GhostPlaceholder type="auth" />
        </NSpace>
      </template>
    </TableContainer>
    <UserModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @on-success="onRefreshCanWatch"
    ></UserModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { userDelete } from '@/service';
import UserModal from './components/user-modal.vue';
import { useUserTable, useUserModal, useUserConfig } from './hooks';

defineOptions({
  name: 'UserManagementView',
});

const { visible, openModal, modalType, setModalType, editData, setEditData } = useUserModal();

const { columns, loading, tableData, getTableData, pagination } = useUserTable(
  handleEdit,
  handleDelete,
);

const { permission, getUserConfig, onRefreshCanWatch } = useUserConfig(getTableData);

function handleUserAdd() {
  setModalType('add');
  openModal();
}

function handleEdit(row: ResUser.UserListData) {
  setModalType('edit');
  setEditData(row);
  openModal();
}

async function handleDelete(id: string) {
  const { error, msg } = await userDelete(id);
  if (error) return;
  window.$message?.success(msg);
  onRefreshCanWatch();
}

onMounted(() => {
  getUserConfig();
});
</script>

<style lang="scss" scoped></style>
