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
import { GamePlatform, PlaystationLoading, TrophyNumText } from '@/components';
import { useBoolean, usePagination } from '@/hooks';
import { psnGameList } from '@/service';
import { NImage, type DataTableColumns, NSpace } from 'naive-ui';
import { h, ref, type Ref, onMounted } from 'vue';

defineOptions({
  name: 'PlayStationGameView',
});

const tableData = ref<ApiPsn.Game[]>([]);

const columns: Ref<DataTableColumns<ApiPsn.Game>> = ref([
  {
    key: 'thumbnail',
    title: '缩略图',
    align: 'center',
    width: 80,
    fixed: 'left',
    render: ({ name, thumbnail }) => {
      return h(
        NImage,
        { alt: name, src: thumbnail, width: 80, height: 55, lazy: true },
        { placeholder: () => h(PlaystationLoading) },
      );
    },
  },
  {
    key: 'name',
    title: '游戏名称',
    align: 'center',
    width: 250,
    render: ({ originName }) =>
      h(NSpace, { justify: 'center' }, () => [h(NSpace, {}, { default: () => originName })]),
  },
  {
    key: 'platforms',
    title: '上线平台',
    align: 'center',
    width: '140',
    render: ({ platforms }) => {
      return h(
        NSpace,
        {
          justify: 'center',
        },
        {
          default: () =>
            platforms.map((platform) =>
              h(GamePlatform, {
                platform,
              }),
            ),
        },
      );
    },
  },
  {
    key: 'trophyNum',
    title: '奖杯数量',
    align: 'center',
    width: '200',
    render: ({ platinum, gold, silver, bronze }) =>
      h(TrophyNumText, { trophyNum: { platinum, gold, silver, bronze } }),
  },
]);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

async function getTableData() {
  const { page, size } = getPageParams();
  startLoading();
  const { data, error } = await psnGameList(page, size);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    setItemCount(total);
  }
  endLoading();
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
