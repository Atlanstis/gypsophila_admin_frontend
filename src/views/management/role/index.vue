<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace v-if="operation.canAdd" class="pb-12px" justify="space-between">
          <NSpace>
            <nButton type="primary" @click="handleRoleAdd">
              <icon-ic-round-plus class="mr-4px text-20px" />
              新增
            </nButton>
          </NSpace>
        </NSpace>
      </template>
      <template #content>
        <NDataTable
          class="flex-1-hidden"
          flex-height
          striped
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :rowKey="(role) => role.id"
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
    <RoleModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @on-success="getRoleTableData"
    ></RoleModal>
    <AllocationMenuModal
      v-model:visible="visibleAllocationMenu"
      :role-id="allocationRoleId"
    ></AllocationMenuModal>
  </div>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
import { onMounted } from 'vue';
import { roleDelete } from '@/service';
import RoleModal from './components/role-modal.vue';
import AllocationMenuModal from './components/allocation-menu-modal.vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { useRoleTable, useRoleModal, useAllocationMenuModal } from './hooks';
import { usePageOperationPermission } from '@/hooks';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'RoleManagementView',
});

const route = useRoute();

const { operation, getOperationPermission } = usePageOperationPermission(route, getRoleTableData);

const { visible, openModal, modalType, setModalType, editData, setEditData } = useRoleModal();

const { visibleAllocationMenu, openAllocationMenuModal, allocationRoleId, setAllocationRoleId } =
  useAllocationMenuModal();

const { columns, tableData, getTableData, pagination, loading, endLoading } = useRoleTable(
  operation,
  handleEdit,
  handleDelete,
  handleAllocation,
);

function handleRoleAdd() {
  setModalType('add');
  openModal();
}

function handleEdit(row: ApiManagement.Role) {
  setModalType('edit');
  setEditData(row);
  openModal();
}

async function handleDelete(id: number) {
  const { error } = await roleDelete({ id });
  if (error) return;
  window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
  getTableData();
}

function handleAllocation(row: ApiManagement.Role) {
  setAllocationRoleId(row.id);
  openAllocationMenuModal();
}

/**
 * 当存在列表权限时，获取列表数据
 */
function getRoleTableData() {
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
