<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <nButton type="primary" @click="handleUserAdd">
              <icon-ic-round-plus class="mr-4px text-20px" />
              新增
            </nButton>
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
          :rowKey="(user) => user.id"
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
    <UserModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @on-success="getTableData"
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

defineOptions({
  name: 'UserManagementView',
});

const { visible, openModal, modalType, setModalType, editData, setEditData } = useUserModal();

const { columns, loading, tableData, getTableData, pagination } = useTable(
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
  getTableData();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
