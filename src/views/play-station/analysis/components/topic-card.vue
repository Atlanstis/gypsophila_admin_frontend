<template>
  <NCard
    title="主题讨论"
    :segmented="{
      content: true,
    }"
  >
    <template #header-extra>
      <PopoverBtn :msg="'查看更多'" icon="ri:more-line" @click="watchTopicMore"></PopoverBtn>
    </template>
    <NDataTable striped :loading="loading" :columns="columns" :data="tableData">
      <template #loading>
        <PlaystationLoading />
      </template>
    </NDataTable>
  </NCard>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';
import { NSpace, type DataTableColumns, NTag } from 'naive-ui';
import { type Ref, ref, onMounted, h } from 'vue';
import { psnineGameTopic } from '@/service';
import PopoverBtn from '@/components/common/popover-btn.vue';
import { useRouterPush } from '@/composables';

defineOptions({
  name: 'TopicCard',
});

type Props = {
  id: number | null;
};

const props = withDefaults(defineProps<Props>(), {
  id: null,
});

const { toOutsideUrl } = useRouterPush(true);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

const columns: Ref<DataTableColumns<Psnine.GameTopic>> = ref([
  {
    key: 'title',
    title: '标题名称',
  },
  {
    key: 'publicationTime',
    title: '发布时间',
  },
  {
    key: 'discussTimes',
    title: '讨论次数',
    align: 'center',
    width: 100,
    sorter: (row1, row2) => row1.discussTimes - row2.discussTimes,
    render: ({ discussTimes }) =>
      discussTimes > 0 ? h(NTag, { type: 'primary', size: 'small' }, () => discussTimes) : null,
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
          icon: 'solar:eye-broken',
          onClick: () => {
            toOutsideUrl(url);
          },
        }),
      ]),
  },
]);

const tableData = ref<Psnine.GameTopic[]>([]);

function watchTopicMore() {
  toOutsideUrl(`https://psnine.com/psngame/${props.id}/topic`);
}

async function getTableData() {
  if (props.id) {
    startLoading();
    const { data, error } = await psnineGameTopic(props.id);
    if (!error) {
      tableData.value = data.list;
    }
    endLoading();
  }
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
