<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NButton v-if="permission.add" type="primary" @click="handleRoleAdd">
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
          :rowKey="(role: ResRole.RoleListData) => role.id"
          :pagination="pagination"
        ></NDataTable>
        <NSpace v-else justify="center" align="center">
          <GhostPlaceholder type="auth" />
        </NSpace>
      </template>
    </TableContainer>
    <RoleModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @on-success="onRefreshCanWatch"
    ></RoleModal>
    <PermissionSetModal
      v-model:visible="permissionSetModalVisible"
      :role-id="permissionSetRoleId"
    ></PermissionSetModal>
  </div>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
import { onMounted } from 'vue';
import { roleDelete } from './api';
import { RoleModal, PermissionSetModal } from './components';
import { useRoleTable, useRoleModal, usePermissionSetModal, useRoleConfig } from './hooks';

defineOptions({
  name: 'RoleManagementView',
});

const { visible, openModal, modalType, setModalType, editData, setEditData } = useRoleModal();

const {
  permissionSetModalVisible,
  openPermissionSetModal,
  permissionSetRoleId,
  setpermissionSetRoleId,
} = usePermissionSetModal();

const { columns, tableData, getTableData, pagination, loading } = useRoleTable(
  handleEdit,
  handleDelete,
  handleAllocation,
);

const { permission, getRoleConfig, onRefreshCanWatch } = useRoleConfig(getTableData);

function handleRoleAdd() {
  setModalType('add');
  openModal();
}

function handleEdit(row: ResRole.RoleListData) {
  setModalType('edit');
  setEditData(row);
  openModal();
}

async function handleDelete(id: number) {
  const { error, msg } = await roleDelete({ id });
  if (error) return;
  window.$message?.success(msg);
  onRefreshCanWatch();
}

function handleAllocation(row: ResRole.RoleListData) {
  setpermissionSetRoleId(row.id);
  openPermissionSetModal();
}

onMounted(() => {
  getRoleConfig();
});
</script>

<style lang="scss" scoped></style>
