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
          :row-key="(row) => row.id"
          :loading="loading"
          :columns="columns"
          :data="tableData"
        ></NDataTable>
      </template>
    </TableContainer>
    <ChannelModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      :channels="tableData"
      @on-success="getTableData"
    ></ChannelModal>
  </div>
</template>

<script lang="ts" setup>
import { mhxyChannelDelete } from '@/service';
import { ChannelModal } from './components';
import { useChannelModal, useChannelTable } from './hooks';
import { onMounted } from 'vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'MhxyChannelView',
});

const { loading, tableData, columns, getTableData } = useChannelTable(
  onChannelEdit,
  onChannelDelete,
);
const { modalType, visible, openModal, setModalType, setEditData, editData } = useChannelModal();

function onCategoryAdd() {
  setModalType('add');
  openModal();
}

function onChannelEdit(data: ApiMhxy.Channel) {
  setEditData(data);
  setModalType('edit');
  openModal();
}

async function onChannelDelete(record: ApiMhxy.Channel) {
  const { error } = await mhxyChannelDelete(record.id);
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
