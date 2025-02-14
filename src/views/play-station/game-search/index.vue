<template>
  <div>
    <TableContainer>
      <template #header>
        <NInput
          v-model:value="keyword"
          placeholder="请输入游戏名，回车键进行搜索"
          class="mb-12px"
          clearable
          @keydown="keyDownHandle"
        >
          <template #prefix>
            <icon-ic-outline-search />
          </template>
        </NInput>
      </template>
      <template #content>
        <NDataTable
          v-if="isSearched"
          flex-height
          striped
          remote
          :scroll-x="1000"
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
        >
          <template #loading>
            <PlaystationLoading />
          </template>
        </NDataTable>
      </template>
    </TableContainer>
  </div>
</template>

<script lang="ts" setup>
import { useSearchTable } from './hooks';
import { ref } from 'vue';

defineOptions({
  name: 'PlayStationSearchView',
});

const keyword = ref<string>('');

function keyDownHandle(key: KeyboardEvent) {
  if (key.code === 'Enter' && keyword.value.trim()) {
    setKeyword(keyword.value);
    resetPage();
    getTableData();
  }
}

const { loading, getTableData, setKeyword, tableData, columns, pagination, isSearched, resetPage } =
  useSearchTable();
</script>

<style lang="scss" scoped></style>
