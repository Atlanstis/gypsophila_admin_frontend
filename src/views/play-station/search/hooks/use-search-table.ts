import { useRouterPush } from '@/composables';
import { PerfectDifficultyColorMap, PlatformColorMap } from '@/constants';
import { useBoolean, usePaginationWithDefinePageSize } from '@/hooks';
import { psnineGameSearch } from '@/service';
import { NImage, type DataTableColumns, NTag, NSpace, NProgress } from 'naive-ui';
import { type Ref, ref, h } from 'vue';
import PopoverBtn from '@/components/common/popover-btn.vue';
import PlaystationLoading from '@/components/custom/loading/playstation-loading.vue';
import { TrophyNumText } from '@/components';
import { ButtonIconEnum, RouteEnum } from '@/enums';

export function useSearchTable() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

  const { bool: isSearched, setTrue: setSearched } = useBoolean(false);

  const { routerPush, toOutsideUrl } = useRouterPush(false);

  const keyword = ref<string>('');

  const tableData = ref<Psnine.SearchGame[]>([]);

  const columns: Ref<DataTableColumns<Psnine.SearchGame>> = ref([
    {
      key: 'thumbnail',
      title: '缩略图',
      align: 'center',
      width: 100,
      fixed: 'left',
      render: ({ name, thumbnail }) => {
        return h(
          NImage,
          { alt: name, src: thumbnail, width: 100, height: 55, lazy: true },
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
                      h(NTag, { size: 'small', type: 'info' }, { default: () => v }),
                    ),
                },
              )
            : null,
        ]),
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
      key: 'trophyNum',
      title: '奖杯数量',
      align: 'center',
      width: '200',
      render: ({ trophyNum }) => h(TrophyNumText, { trophyNum }),
    },
    {
      key: 'perfectDiffucuity',
      title: '完美难度',
      align: 'center',
      width: 100,
      render: ({ perfectDiffucuity }) => {
        return h(
          'span',
          { style: { color: PerfectDifficultyColorMap[perfectDiffucuity] } },
          perfectDiffucuity,
        );
      },
    },
    {
      key: 'perfectRate',
      title: '完美率',
      align: 'center',
      width: 140,
      render: ({ perfectDiffucuity, perfectRate }) => {
        return h(NProgress, {
          color: PerfectDifficultyColorMap[perfectDiffucuity],
          percentage: perfectRate,
          indicatorPlacement: 'inside',
        });
      },
    },
    { key: 'players', title: '游玩人数', align: 'center', width: 100 },
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
            msg: '分析',
            icon: ButtonIconEnum.analysis,
            onClick: () => {
              routerPush({ name: RouteEnum.PlayStation_Analysis, params: { id } });
            },
          }),
        ]),
    },
  ]);

  const { pagination, getPageParams, setItemCount, resetPage } = usePaginationWithDefinePageSize(
    getTableData,
    30,
  );

  function setKeyword(str: string) {
    keyword.value = str;
  }

  async function getTableData() {
    setSearched();
    startLoading();
    tableData.value = [];
    const { page } = getPageParams();
    const { data, error } = await psnineGameSearch(keyword.value, page);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }
  return {
    /** 获取列表数据 */
    getTableData,
    /** 设置搜索关键字 */
    setKeyword,
    /** 列表加载状态 */
    loading,
    /** 列表数据 */
    tableData,
    /** 列表字段 */
    columns,
    /** 列表分页信息 */
    pagination,
    /** 是否进行过搜索，进行过则显示列表 */
    isSearched,
    /** 重置分页信息 */
    resetPage,
  };
}
