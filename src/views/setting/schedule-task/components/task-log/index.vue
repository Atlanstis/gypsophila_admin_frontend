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
import { onMounted, watch } from 'vue';

defineOptions({
  name: 'TaskLog',
});

const props = defineProps<{ taskId: number; random: number }>();

const { setTaskId, getTableData, columns, tableData, pagination, loading } = useLogTable();

watch(
  () => props.random,
  (newval, oldval) => {
    if (newval !== oldval) {
      getTableData();
    }
  },
);

watch(
  () => props.taskId,
  (newval, oldval) => {
    if (newval !== oldval) {
      setTaskId(newval);
    }
    getTableData();
  },
);

onMounted(() => {
  setTaskId(props.taskId);
  getTableData();
});
</script>

<style lang="scss" scoped></style>
