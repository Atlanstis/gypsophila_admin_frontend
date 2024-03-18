<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="onGoldRecordAdd">
              <icon-ic-round-plus class="text-20px" />
              新增记录
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
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
    <GoldRecordModal v-model:visible="visible" @on-success="getTableData"></GoldRecordModal>
    <RecordCompleteModal
      v-model:visible="completeVisible"
      :id="recordId"
      @on-success="getTableData"
    ></RecordCompleteModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRecordModal, useRecordTable, useRecordCompleteModal } from './hooks';
import { GoldRecordModal, RecordCompleteModal } from './components';

defineOptions({
  name: 'MhxyGoldRecord',
});

const { completeVisible, setRecordId, recordId } = useRecordCompleteModal();
const { visible, openModal } = useRecordModal();
const { loading, columns, tableData, pagination, getTableData } = useRecordTable(setRecordId);

function onGoldRecordAdd() {
  openModal();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
