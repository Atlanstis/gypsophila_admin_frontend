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
  </div>
</template>

<script lang="ts" setup>
import { type DataTableColumns, NSpace, NButton, NPopconfirm, NTag } from 'naive-ui';
import { onMounted, ref, type Ref } from 'vue';
import { menuDelete, menuList } from '@/service';
import { h } from 'vue';
import MenuModal from './components/menu-modal.vue';
import type { ModalType } from './components/menu-modal.vue';
import { useBoolean } from '@/hooks';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { usePagination } from '@/composables';
import { PARENT_FLAG } from './constants';

defineOptions({
  name: 'UserManagementView',
});

const { bool: visible, setTrue: openModal } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const modalType = ref<ModalType>('add');

const { pagination, getPageParams } = usePagination(getTableData);

const columns: Ref<DataTableColumns<ApiManagement.Menu>> = ref([
  {
    key: 'name',
    title: '菜单名称',
    align: 'left',
    titleAlign: 'center',
  },
  {
    key: 'key',
    title: '菜单 Key',
    align: 'center',
  },
  {
    key: 'isParent',
    title: '类型',
    align: 'center',
    render: (row) => {
      const isParent = row.parentId === PARENT_FLAG;
      const isMenu = isParent && row.children;
      return h(
        NTag,
        { type: isMenu ? 'warning' : 'success' },
        { default: () => (isMenu ? '菜单' : '页面') },
      );
    },
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: (row) => {
      const hasDel = !row.children;
      const hasAdd = row.parentId === PARENT_FLAG;
      const delBtn = h(
        NPopconfirm,
        { onPositiveClick: () => handleDelete(row.id) },
        {
          default: () => '确认删除',
          trigger: () => h(NButton, { size: 'small', type: 'error' }, () => '删除'),
        },
      );
      const addBtn = h(
        NButton,
        { type: 'primary', size: 'small', onClick: () => handleAdd(row.id) },
        {
          default: () => '新增',
        },
      );
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            hasAdd ? addBtn : null,
            h(
              NButton,
              { size: 'small', onClick: () => handleEdit(row) },
              { default: () => '编辑' },
            ),
            hasDel ? delBtn : null,
          ],
        },
      );
    },
  },
]);

const editData = ref<ApiManagement.Menu | null>(null);

function setEditData(data: ApiManagement.Menu | null) {
  editData.value = data;
}

function setModalType(val: ModalType) {
  modalType.value = val;
}

function handleAdd(parentId?: number) {
  setModalType('add');

  setDefaultParentId(parentId);
  openModal();
}

function handleEdit(row: ApiManagement.Menu) {
  setModalType('edit');
  setEditData(row);
  setDefaultParentId(row.parentId);
  openModal();
}

async function handleDelete(id: number) {
  const { error } = await menuDelete({ id });
  if (error) return;
  window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
  getTableData();
}
const tableData = ref<ApiManagement.Menu[]>([]);

async function getTableData() {
  startLoading();
  const { page, size } = getPageParams();
  const { data, error } = await menuList(page, size);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    pagination.itemCount = total;
  }
  endLoading();
}

const defaultParentId = ref<number>(PARENT_FLAG);

function setDefaultParentId(val: number | undefined) {
  defaultParentId.value = val !== undefined ? val : PARENT_FLAG;
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
