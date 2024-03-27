<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="onCategoryAdd">
              <icon-ic-round-plus class="text-20px" />
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
          :row-key="(row: ApiMhxy.PropCategory) => row.id"
          :loading="loading"
          :columns="columns"
          :data="tableData"
        ></NDataTable>
      </template>
    </TableContainer>
    <CategoryModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      :categories="tableData"
      @on-success="getTableData"
    ></CategoryModal>
  </div>
</template>

<script lang="ts" setup>
import { mhxyPropCategoryDelete } from '@/service';
import { CategoryModal } from './components';
import { useCategoryModal, useCategoryTable } from './hooks';
import { onMounted } from 'vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'MhxyPropCategoryView',
});

const { loading, tableData, columns, getTableData } = useCategoryTable(
  onCategoryEdit,
  onCategoryDelete,
);
const { modalType, visible, openModal, setModalType, setEditData, editData } = useCategoryModal();

function onCategoryAdd() {
  setModalType('add');
  openModal();
}

function onCategoryEdit(data: ApiMhxy.PropCategory) {
  setEditData(data);
  setModalType('edit');
  openModal();
}

async function onCategoryDelete(record: ApiMhxy.PropCategory) {
  const { error } = await mhxyPropCategoryDelete(record.id);
  if (!error) {
    window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
    getTableData();
  }
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
