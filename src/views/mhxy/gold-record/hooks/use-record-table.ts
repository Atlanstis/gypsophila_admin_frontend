import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldRecordList } from '@/service';
import { type DataTableColumns, NSpace, NPopover, NTag } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { renderGoldTrend, renderTableAccount } from '@/utils';

export function useRecordTable() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.AccountGoldRecord[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyAccountGoldRecordList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const columns: Ref<DataTableColumns<ApiMhxy.AccountGoldRecord>> = ref([
    {
      key: 'name',
      title: '角色',
      align: 'center',
      render: (row) => renderTableAccount(row.account),
    },
    {
      key: 'category',
      title: '种类',
      align: 'center',
      render: (row) =>
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              h('span', row.category.name),
              row.isTransfer
                ? h(NTag, { size: 'small', type: 'primary' }, { default: () => '转金' })
                : null,
              row.category.isGem
                ? h(NTag, { size: 'small', type: 'primary' }, { default: () => '珍品' })
                : null,
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
            trigger: () => renderGoldTrend(row.amount),
            default: () =>
              h('div', [
                h('div', `后：${row.afterGold}`),
                h('div', `前：${row.beforeGold}`),
                row.remark ? h('div', `备注：${row.remark}`) : null,
              ]),
          },
        ),
    },
    {
      key: 'createTime',
      title: '记录时间',
      align: 'center',
    },
  ]);

  return { loading, tableData, pagination, columns, getTableData };
}
