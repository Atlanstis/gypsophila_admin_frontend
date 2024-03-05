<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="onGoldRecordAdd">
              <icon-ic-round-plus class="text-20px" />
              开始转金
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
    <GoldTransferModal v-model:visible="visible" @on-success="getTableData"></GoldTransferModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useTransferTable, useTransferModal } from './hooks';
import { GoldTransferModal } from './components';

defineOptions({
  name: 'MhxyGoldTransfer',
});

const { visible, openModal } = useTransferModal();

const { loading, columns, tableData, pagination, getTableData } = useTransferTable();

function onGoldRecordAdd() {
  openModal();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
