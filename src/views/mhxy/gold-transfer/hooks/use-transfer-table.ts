import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldTransferList, mhxyAccountGoldTransferRevert } from '@/service';
import { NSpace, type DataTableColumns, NPopconfirm, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { renderTransferAmount, renderTransferRelation } from '@/utils';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { PopoverBtn } from '@/components';
import { MHXY_GOLD_TRANSFER_STATUS, MHXY_GOLD_TRANSFER_STATUS_TEXT } from '@/constants';
import { useIconRender } from '@/composables';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

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

  const { iconRender } = useIconRender();

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
      render: (row) => renderTransferAmount(row.expenditureAmount, row.revenueAmount),
    },
    {
      key: 'propCategory',
      title: '道具种类',
      align: 'center',
      width: '80',
      render: (row) => h('span', row.propCategory.name),
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: '130',
      render: (row) => {
        const map: Record<MHXY_GOLD_TRANSFER_STATUS, { text: string; color: string }> = {
          [MHXY_GOLD_TRANSFER_STATUS.PROGRESS]: {
            text: MHXY_GOLD_TRANSFER_STATUS_TEXT[MHXY_GOLD_TRANSFER_STATUS.PROGRESS],
            color: otherColor.info,
          },
          [MHXY_GOLD_TRANSFER_STATUS.SUCCESS]: {
            text: MHXY_GOLD_TRANSFER_STATUS_TEXT[MHXY_GOLD_TRANSFER_STATUS.SUCCESS],
            color: otherColor.success,
          },
          [MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK]: {
            text: MHXY_GOLD_TRANSFER_STATUS_TEXT[MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK],
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
                    msg: '操作',
                    icon: ButtonIconEnum.finish,
                    onClick: () => {
                      setFinishId(row.id);
                    },
                  })
                : null,
              h(
                NPopconfirm,
                { onPositiveClick: () => onRevertTransfer(row), trigger: 'hover' },
                {
                  default: () => '是否撤销此次记录？',
                  trigger: () =>
                    h(
                      NButton,
                      { type: 'error', size: 'small' },
                      {
                        icon: iconRender({ fontSize: 18, icon: ButtonIconEnum.revert }),
                      },
                    ),
                },
              ),
            ],
          },
        );
      },
    },
  ]);

  async function onRevertTransfer(row: ApiMhxy.AccountGoldTransfer) {
    const { error } = await mhxyAccountGoldTransferRevert(row.id);
    if (!error) {
      window.$message?.success('撤销成功', { duration: DEFAULT_MESSAGE_DURATION });
      getTableData();
    }
  }

  return { loading, tableData, pagination, columns, getTableData };
}
