<template>
  <NModal
    v-model:show="modalVisible"
    title="同步游戏"
    preset="card"
    :segmented="true"
    class="w-920px"
  >
    <div class="h-400px">
      <NDataTable
        class="h-full"
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
    </div>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="closeModal">关闭</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import {
  useModal,
  type ModalProps,
  type ModalEmits,
  useBoolean,
  usePaginationWithDefinePageSize,
} from '@/hooks';
import { psnSynchronizeableGame } from '@/service';
import { NSpace, type DataTableColumns, NImage, NTag, NProgress } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import PlaystationLoading from '@/components/custom/loading/playstation-loading.vue';
import PopoverBtn from '@/components/common/popover-btn.vue';
import { PlatformColorMap } from '@/constants';
import { ButtonIconEnum } from '@/enums';
import { useRouterPush } from '@/composables';
import { TrophyNumText } from '@/components';

const props = withDefaults(defineProps<ModalProps>(), {
  visible: false,
  roleId: null,
});

const emits = defineEmits<ModalEmits>();

defineOptions({
  name: 'AllocationMenuModal',
});

const { toOutsideUrl } = useRouterPush(false);

const tableData = ref<Psnine.SyncGame[]>([]);

const columns: Ref<DataTableColumns<Psnine.SyncGame>> = ref([
  {
    key: 'thumbnail',
    title: '缩略图',
    align: 'center',
    minWidth: 80,
    fixed: 'left',
    render: ({ name, thumbnail }) => {
      return h(
        NImage,
        { alt: name, src: thumbnail, width: 80, lazy: true },
        { placeholder: () => h(PlaystationLoading) },
      );
    },
  },
  {
    key: 'name',
    title: '游戏名称',
    align: 'center',
    width: 250,
    render: ({ name, version }) =>
      h(NSpace, { justify: 'center' }, () => [
        h(NSpace, {}, { default: () => name }),
        version.length
          ? h(
              NSpace,
              {},
              {
                default: () =>
                  version.map((v) =>
                    h(NTag, { size: 'small', type: 'primary' }, { default: () => v }),
                  ),
              },
            )
          : null,
      ]),
  },
  {
    key: 'trophyNum',
    title: '已获得奖杯',
    align: 'center',
    width: 180,
    render: ({ trophyGot }) => h(TrophyNumText, { trophyNum: trophyGot }),
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
              h(
                NTag,
                {
                  size: 'small',
                  color: {
                    color: PlatformColorMap[platform],
                    textColor: '#fff',
                  },
                  bordered: false,
                },
                { default: () => platform },
              ),
            ),
        },
      );
    },
  },
  {
    key: 'perfectRate',
    title: '完成率',
    align: 'center',
    width: 80,
    render: ({ progress }) => {
      const status = progress <= 10 ? 'error' : progress < 100 ? 'default' : 'success';
      return h(NProgress, {
        status,
        percentage: progress,
        indicatorPlacement: 'inside',
      });
    },
  },
  {
    key: 'operation',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: ({ id, url }) =>
      h(NSpace, { justify: 'center' }, () => [
        h(PopoverBtn, {
          msg: '查看 Psnine 详情',
          icon: ButtonIconEnum.detail,
          onClick: () => {
            toOutsideUrl(url);
          },
        }),
        h(PopoverBtn, {
          msg: '同步',
          icon: ButtonIconEnum.refresh,
          onClick: () => {
            console.log(id);
          },
        }),
      ]),
  },
]);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

const { pagination, getPageParams, setItemCount, resetPage } = usePaginationWithDefinePageSize(
  getSynchronizeableGame,
  30,
);

function handleModalOpen() {
  clearData();
  getSynchronizeableGame();
}

/** 获取可以同步的游戏列表 */
async function getSynchronizeableGame() {
  startLoading();
  const { page } = getPageParams();
  const { data, error } = await psnSynchronizeableGame(page);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    setItemCount(total);
  } else {
    closeModal();
  }
  endLoading();
}

/** 清理数据 */
function clearData() {
  resetPage();
  tableData.value = [];
  setItemCount(0);
}

const { modalVisible, closeModal } = useModal(props, emits, handleModalOpen);
</script>

<style lang="scss" scoped></style>
