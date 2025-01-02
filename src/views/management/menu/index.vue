<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NButton v-if="permission.add" type="primary" @click="onAdd(null)">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </NButton>
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
          :rowKey="(menu: ResMenu.MenuListData) => menu.id"
          :pagination="pagination"
          :expanded-row-keys="expandedRowKeys"
          :on-update:expanded-row-keys="
            (keys: DataTableRowKey[]) => onExpandedRowKeys(keys as number[])
          "
        ></NDataTable>
      </template>
    </TableContainer>
    <MenuModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      :parent-id="defaultParentId"
      @on-success="onRefreshCanWatch"
    ></MenuModal>
    <PermissionManageModal
      v-model:visible="permissionModalVisible"
      :menuId="permissionMenuId"
    ></PermissionManageModal>
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NButton, type DataTableRowKey } from 'naive-ui';
import { onMounted } from 'vue';
import { menuDelete } from './api';
import { PermissionManageModal, MenuModal } from './components';
import { usePermissionManageModal, useMenuModal, useMenuTable, useMenuConfig } from './hooks';

defineOptions({
  name: 'MenuManagementView',
});

const { permissionModalVisible, permissionMenuId, openPermissionModal, setPermissionMenuId } =
  usePermissionManageModal();

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

const {
  loading,
  columns,
  getTableData,
  expandedRowKeys,
  onExpandedRowKeys,
  pagination,
  tableData,
} = useMenuTable(onAdd, onEdit, onDelete, onPermissionManage);

const { permission, getMenuConfig, onRefreshCanWatch } = useMenuConfig(getTableData);

/**
 * 处理新增菜单
 * @param parentId 父菜单 Id
 */
function onAdd(parentId: Common.Nullable<number>) {
  setModalType('add');
  setEditData(null);
  setDefaultParentId(parentId);
  openModal();
}

/**
 * 处理编辑菜单
 * @param row 编辑项
 */
function onEdit(row: ResMenu.MenuListData) {
  setModalType('edit');
  setEditData(row);
  setDefaultParentId(row.parentId);
  openModal();
}

/**
 * 处理删除菜单
 * @param id 菜单 Id
 */
async function onDelete(id: number) {
  const { error, msg } = await menuDelete({ id });
  if (error) return;
  window.$message?.success(msg);
  onRefreshCanWatch();
}

/**
 * 编辑菜单权限
 * @param row 菜单项
 */
function onPermissionManage(row: ResMenu.MenuListData) {
  setPermissionMenuId(row.id);
  openPermissionModal();
}

onMounted(() => {
  getMenuConfig();
});
</script>

<style lang="scss" scoped></style>
