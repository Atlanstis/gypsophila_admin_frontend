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
          <NSpace>
            <NButton type="primary" @click="openPolicyModal">策略管理</NButton>
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
    <TransferFinishModal
      v-model:visible="finishVisible"
      :id="finishId"
      @on-success="getTableData"
    ></TransferFinishModal>
    <PolicyModal v-model:visible="policyVisible"></PolicyModal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import {
  useTransferTable,
  useTransferModal,
  useTransferFinishModal,
  usePolicyModal,
} from './hooks';
import { GoldTransferModal, TransferFinishModal, PolicyModal } from './components';

defineOptions({
  name: 'MhxyGoldTransfer',
});

const { visible, openModal } = useTransferModal();
const { policyVisible, openPolicyModal } = usePolicyModal();
const { finishVisible, setFinishId, finishId } = useTransferFinishModal();
const { loading, columns, tableData, pagination, getTableData } = useTransferTable(setFinishId);

function onGoldRecordAdd() {
  openModal();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
