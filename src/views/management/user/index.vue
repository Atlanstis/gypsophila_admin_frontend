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
import { NTag, type DataTableColumns, NSpace, NButton, NPopconfirm } from 'naive-ui';
import { onMounted, ref, type Ref } from 'vue';
import { userDelete, userList } from '@/service';
import { h } from 'vue';
import { BusinessRoleEnum } from '@/enums';
import UserModal from './components/user-modal.vue';
import type { ModalType } from './components/user-modal.vue';
import { useBoolean } from '@/hooks';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { usePagination } from '@/composables';

defineOptions({
  name: 'UserManagementView',
});

const { bool: visible, setTrue: openModal } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

const modalType = ref<ModalType>('add');

const columns: Ref<DataTableColumns<ApiManagement.User>> = ref([
  {
    key: 'username',
    title: '用户名',
    align: 'center',
  },
  {
    key: 'nickname',
    title: '昵称',
    align: 'center',
  },
  {
    key: 'roles',
    title: '角色',
    align: 'center',
    render: (row) => {
      const roleName = row.roles.map((role) =>
        h(NTag, { type: 'info' }, { default: () => role.name }),
      );
      return h('div', roleName);
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
      const canDel = !row.roles.some((role) => role.id === BusinessRoleEnum.SuperAdmin);
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

const editData = ref<ApiManagement.User | null>(null);

function setEditData(data: ApiManagement.User | null) {
  editData.value = data;
}

function setModalType(val: ModalType) {
  modalType.value = val;
}

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
const tableData = ref<ApiManagement.User[]>([]);

async function getTableData() {
  startLoading();
  const { page, size } = getPageParams();
  const { data, error } = await userList(page, size);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    pagination.itemCount = total;
  }
  endLoading();
}

const { pagination, getPageParams } = usePagination(getTableData);

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>