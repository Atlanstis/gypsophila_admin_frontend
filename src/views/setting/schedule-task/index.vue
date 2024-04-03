<template>
  <div>
    <TableContainer>
      <template #content>
        <NDataTable
          flex-height
          striped
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :row-key="(row: ApiScheduleTask.ScheduleTask) => row.id"
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
  </div>
</template>

<script lang="ts" setup>
import { useTaskTable } from './hooks';
import { onMounted } from 'vue';

defineOptions({
  name: 'ScheduleTaskView',
});

const { loading, columns, tableData, pagination, getTableData } = useTaskTable();

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
