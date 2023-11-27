<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
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
      @on-success="getTableData"
    ></RoleModal>
  </div>
</template>

<script lang="ts" setup>
import { usePagination } from '@/composables';
import { RoleIsDefaultEnum } from '@/enums';
import { useBoolean } from '@/hooks';
import { NTag, type DataTableColumns, NPopconfirm, NButton, NSpace } from 'naive-ui';
import { onMounted } from 'vue';
import { h, ref, type Ref } from 'vue';
import { roleDelete, roleList } from '@/service';
import RoleModal from './components/role-modal.vue';
import type { ModalType } from './components/role-modal.vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'RoleManagementView',
});

const { bool: visible, setTrue: openModal } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);
const modalType = ref<ModalType>('add');

const columns: Ref<DataTableColumns<ApiManagement.Role>> = ref([
  {
    key: 'name',
    title: '角色名',
    align: 'center',
  },
  {
    key: 'isDefault',
    title: '是否内置角色',
    align: 'center',
    render: (row) => {
      if (row.isDefault === RoleIsDefaultEnum.YES) {
        return h(NTag, { type: 'success' }, { default: () => '是' });
      } else if (row.isDefault === RoleIsDefaultEnum.NO) {
        return h(NTag, { type: 'warning' }, { default: () => '否' });
      }
      return null;
    },
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: (row) => {
      const delConfirm = h(
        NPopconfirm,
        { onPositiveClick: () => handleDelete(row.id) },
        {
          default: () => '确认删除',
          trigger: () => h(NButton, { size: 'small', type: 'error' }, () => '删除'),
        },
      );
      const canDel = row.isDefault === RoleIsDefaultEnum.NO;
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              { size: 'small', onClick: () => handleEdit(row) },
              { default: () => '编辑' },
            ),
            canDel ? delConfirm : null,
          ],
        },
      );
    },
  },
]);

const tableData = ref<ApiManagement.Role[]>([]);

const { pagination, getPageParams } = usePagination(getTableData);

const editData = ref<ApiManagement.Role | null>(null);

function setEditData(data: ApiManagement.Role | null) {
  editData.value = data;
}

function setModalType(val: ModalType) {
  modalType.value = val;
}

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

async function getTableData() {
  startLoading();
  const { page, size } = getPageParams();
  const { data, error } = await roleList(page, size);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    pagination.itemCount = total;
  }
  endLoading();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>