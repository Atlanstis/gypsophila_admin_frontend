<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAdd()">
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
          :rowKey="(user) => user.id"
          :pagination="pagination"
          :expanded-row-keys="expandedRowKeys"
        ></NDataTable>
      </template>
    </TableContainer>
    <MenuModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      :parent-id="defaultParentId"
      @on-success="getTableData"
    ></MenuModal>
    <PermissionModal
      v-model:visible="permissionModalVisible"
      :menuId="permissionMenuId"
    ></PermissionModal>
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NButton } from 'naive-ui';
import { onMounted } from 'vue';
import { menuDelete } from '@/service';
import MenuModal from './components/menu-modal.vue';
import { PermissionModal } from './components';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { usePermissionModal, useMenuModal, useTable } from './hooks';

defineOptions({
  name: 'MenuManagementView',
});

const { permissionModalVisible, permissionMenuId, openPermissionModal, setPermissionMenuId } =
  usePermissionModal();

const {
  visible,
  openModal,
  modalType,
  setModalType,
  editData,
  setEditData,
  defaultParentId,
  setDefaultParentId,
} = useMenuModal();

const { loading, columns, getTableData, expandedRowKeys, pagination, tableData } = useTable(
  handleAdd,
  handleEdit,
  handleDelete,
  handlePermission,
);

/**
 * 处理新增菜单
 * @param parentId 父菜单 Id
 */
function handleAdd(parentId?: number) {
  setModalType('add');
  setDefaultParentId(parentId);
  openModal();
}

/**
 * 处理编辑菜单
 * @param row 编辑项
 */
function handleEdit(row: ApiManagement.Menu) {
  setModalType('edit');
  setEditData(row);
  setDefaultParentId(row.parentId);
  openModal();
}

/**
 * 处理删除菜单
 * @param id 菜单 Id
 */
async function handleDelete(id: number) {
  const { error } = await menuDelete({ id });
  if (error) return;
  window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
  getTableData();
}

/**
 * 编辑菜单权限
 * @param row 菜单项
 */
function handlePermission(row: ApiManagement.Menu) {
  setPermissionMenuId(row.id);
  openPermissionModal();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
