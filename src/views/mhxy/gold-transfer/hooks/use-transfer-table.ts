import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldTransferList } from '@/service';
import { NSpace, type DataTableColumns, NPopover } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { renderGoldTrend, renderTableAccount } from '@/utils';
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';

export function useTransferTable() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.AccountGoldTransfer[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  const { iconRender } = useIconRender();
  const themeStore = useThemeStore();
  const { themeColor } = themeStore;

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyAccountGoldTransferList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const columns: Ref<DataTableColumns<ApiMhxy.AccountGoldTransfer>> = ref([
    {
      key: 'account',
      title: '角色',
      align: 'center',
      render: (row) =>
        h(
          NSpace,
          { justify: 'center', align: 'center' },
          {
            default: () => [
              renderTableAccount(row.fromAccount),
              h(iconRender({ fontSize: 18, icon: ButtonIconEnum.arrowRight, color: themeColor })),
              renderTableAccount(row.toAccount),
            ],
          },
        ),
    },
    {
      key: 'situation',
      title: '收支情况',
      align: 'center',
      render: (row) =>
        h(
          NPopover,
          {},
          {
            trigger: () =>
              h(
                NSpace,
                { justify: 'center' },
                {
                  default: () => [
                    renderGoldTrend(row.fromAfterGold - row.fromBeforeGold),
                    h('span', '/'),
                    renderGoldTrend(row.toAfterGold - row.toBeforeGold),
                  ],
                },
              ),
            default: () =>
              h('div', [
                h(
                  'div',
                  `损耗：${
                    row.fromAfterGold - row.fromBeforeGold + row.toAfterGold - row.toBeforeGold
                  }`,
                ),
              ]),
          },
        ),
    },
    {
      key: 'category',
      title: '种类',
      align: 'center',
      render: (row) => h('span', row.category.name),
    },
    {
      key: 'createTime',
      title: '转金时间',
      align: 'center',
    },
  ]);

  return { loading, tableData, pagination, columns, getTableData };
}
