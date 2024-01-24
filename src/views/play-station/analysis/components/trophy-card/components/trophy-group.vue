<template>
  <NSpace v-if="props.group" vertical>
    <NSpace>
      <div class="h-80px w-80px flex flex-center">
        <NImage width="80" height="80" :src="props.group.thumbnail">
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <NSpace class="h-full" vertical justify="space-around">
        <NSpace align="center">
          <div class="text-16px font-bold">{{ props.group.name }}</div>
          <NTag v-if="props.group.isDLC" size="small" type="primary">DLC</NTag>
        </NSpace>
        <TrophyNum :trophy-num="props.group.trophyNum" />
      </NSpace>
    </NSpace>
    <NDataTable :data="props.group.trophies" :columns="columns"></NDataTable>
  </NSpace>
</template>

<script lang="ts" setup>
import { h, ref, type Ref } from 'vue';
import { NImage, type DataTableColumns, NTag, NProgress, NSpace } from 'naive-ui';
import PopoverBtn from '@/components/common/popover-btn.vue';
import { PlaystationLoading } from '@/components';
import { useRouterPush } from '@/composables';
import { TrophyColorMap } from '@/constants';
import { ButtonIconEnum } from '@/enums';

defineOptions({
  name: 'TropyGroup',
});

type Props = {
  group: Psnine.TrophyGroup | null;
};

const props = withDefaults(defineProps<Props>(), {
  group: null,
});

const { toOutsideUrl } = useRouterPush(true);

const columns: Ref<DataTableColumns<Psnine.Troup>> = ref([
  {
    key: 'order',
    title: '次序',
    align: 'center',
    width: 80,
    minWidth: 80,
    sorter: (row1, row2) => row1.order - row2.order,
  },
  {
    key: 'thumbnail',
    title: '缩略图',
    align: 'center',
    minWidth: 60,
    width: 60,
    fixed: 'left',
    render: ({ name, thumbnail }) => {
      return h(
        NImage,
        { alt: name, src: thumbnail, width: 60, height: 60, lazy: true },
        { placeholder: () => h(PlaystationLoading) },
      );
    },
  },
  {
    key: 'name',
    title: '奖杯名称',
    align: 'center',
    width: 120,
    fixed: 'left',
    render: ({ name, trophyType }) =>
      h('span', { style: { color: TrophyColorMap[trophyType] } }, name),
  },
  {
    key: 'description',
    title: '奖杯描述',
    align: 'center',
    width: 280,
    render: ({ description, trophyType }) =>
      h('span', { style: { color: TrophyColorMap[trophyType] } }, description),
  },
  {
    key: 'tipNums',
    title: '提示数量',
    align: 'center',
    width: 100,
    sorter: (row1, row2) => row1.tipNums - row2.tipNums,
    render: ({ tipNums }) =>
      tipNums > 0 ? h(NTag, { type: 'primary', size: 'small' }, () => tipNums) : null,
  },
  {
    key: 'perfectRate',
    title: '完成率',
    align: 'center',
    width: 100,
    sorter: (row1, row2) => row1.complateRate - row2.complateRate,
    render: ({ complateRate }) => {
      return h(NProgress, {
        percentage: complateRate,
        indicatorPlacement: 'inside',
      });
    },
  },
  {
    key: 'operation',
    title: '操作',
    align: 'center',
    fixed: 'right',
    minWidth: 80,
    width: 80,
    render: ({ url }) =>
      h(NSpace, { justify: 'center' }, () => [
        h(PopoverBtn, {
          msg: '查看 Psnine 详情',
          icon: ButtonIconEnum.detail,
          onClick: () => {
            toOutsideUrl(url);
          },
        }),
      ]),
  },
]);
</script>

<style lang="scss" scoped></style>
