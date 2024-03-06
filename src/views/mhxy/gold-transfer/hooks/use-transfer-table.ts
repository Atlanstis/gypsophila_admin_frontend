import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldTransferList } from '@/service';
import { NSpace, type DataTableColumns, NPopover } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { renderGoldTrend, renderTransferRelation } from '@/utils';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { PopoverBtn } from '@/components';

export function useTransferTable(setFinishId: (id: ApiMhxy.AccountGoldTransfer['id']) => void) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.AccountGoldTransfer[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  const themeStore = useThemeStore();
  const { otherColor } = themeStore;

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
      key: 'relation',
      title: '转移关系',
      align: 'center',
      render: (row) =>
        h(
          NSpace,
          { justify: 'center', align: 'center' },
          {
            default: () => renderTransferRelation(row.fromAccount, row.toAccount),
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
      width: '80',
      render: (row) => h('span', row.category.name),
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: '130',
      render: (row) => {
        const map: Record<ApiMhxy.AccountGoldTransferStatus, { text: string; color: string }> = {
          progress: {
            text: '进行中',
            color: otherColor.info,
          },
          success: {
            text: '转金成功',
            color: otherColor.success,
          },
          failFromLock: {
            text: '转金失败，转出账号金币被锁',
            color: otherColor.error,
          },
        };
        return h('span', { style: { color: map[row.status].color } }, map[row.status].text);
      },
    },
    {
      key: 'createTime',
      title: '转金时间',
      align: 'center',
    },
    {
      key: 'operation',
      title: '操作',
      align: 'center',
      width: '120',
      render: (row) => {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              row.status === 'progress'
                ? h(PopoverBtn, {
                    msg: '完成',
                    icon: ButtonIconEnum.finish,
                    onClick: () => {
                      setFinishId(row.id);
                    },
                  })
                : null,
            ],
          },
        );
      },
    },
  ]);

  return { loading, tableData, pagination, columns, getTableData };
}
