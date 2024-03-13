import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldRecordList } from '@/service';
import { type DataTableColumns, NSpace } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { renderGoldTrend, renderMhxyAccount } from '@/utils';
import { MHXY_GOLD_RECORD_STATUS, MHXY_GOLD_RECORD_STATUS_OPT } from '@/constants';
import { useThemeStore } from '@/stores';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';

export function useRecordTable(setRecordId: (id: ApiMhxy.AccountGoldRecord['id']) => void) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.AccountGoldRecord[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  const theme = useThemeStore();

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
      render: (row) => renderMhxyAccount(row.account),
    },
    {
      key: 'channel',
      title: '途径',
      align: 'center',
      render: (row) =>
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [h('span', row.channel.name)],
          },
        ),
    },
    {
      key: 'situation',
      title: '收支情况',
      align: 'center',
      render: (row) => renderGoldTrend(row.amount, row.type),
    },
    {
      key: 'createTime',
      title: '记录时间',
      align: 'center',
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 80,
      render: (row) => {
        const opt = MHXY_GOLD_RECORD_STATUS_OPT.find((item) => item.value === row.status);
        const color: Record<MHXY_GOLD_RECORD_STATUS, string> = {
          [MHXY_GOLD_RECORD_STATUS.COMPLETE]: theme.otherColor.success,
          [MHXY_GOLD_RECORD_STATUS.IN_PROGRESS]: theme.otherColor.info,
        };
        return opt ? h('span', { style: { color: color[row.status] } }, opt.label) : '';
      },
    },
    {
      key: 'operation',
      title: '操作',
      align: 'center',
      width: 80,
      render: (row) => {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              row.status === MHXY_GOLD_RECORD_STATUS.IN_PROGRESS
                ? h(PopoverBtn, {
                    msg: '处理',
                    icon: ButtonIconEnum.finish,
                    onClick: () => {
                      setRecordId(row.id);
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
