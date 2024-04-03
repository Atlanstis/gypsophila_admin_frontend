<template>
  <NDataTable
    remote
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
  ></NDataTable>
</template>

<script lang="ts" setup>
import { useLogTable } from './hooks';
import { onMounted } from 'vue';

defineOptions({
  name: 'TaskLog',
});

const props = defineProps<{ taskId: number }>();

const { setTaskId, getTableData, columns, tableData, pagination, loading } = useLogTable();

onMounted(() => {
  setTaskId(props.taskId);
  getTableData();
});
</script>

<style lang="scss" scoped></style>
