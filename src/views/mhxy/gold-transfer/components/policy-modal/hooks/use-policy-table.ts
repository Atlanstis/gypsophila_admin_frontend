import { NSpace, type DataTableColumns, NButton, NPopconfirm } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useBoolean, usePagination } from '@/hooks';
import { useIconRender } from '@/composables';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { mhxyGoldTransferPolicyList } from '@/service';
import { PolicyApplyTable } from '../..';

type PolicyKeys = ApiMhxy.GoldTransferPolicy['id'][];

/**
 * 列表的相关操作
 * @param props 组件 props
 * @param handleEdit 数据编辑操作
 * @param handleDelete 数据删除操作
 */
export function usePolicyTable(
  handleEdit: (row: ApiMhxy.GoldTransferPolicy) => void,
  handleApply: (policy: ApiMhxy.GoldTransferPolicy) => void,
  onEditApply: (policy: ApiMhxy.GoldTransferPolicy, apply: ApiMhxy.GoldTransferPolicyApply) => void,
  handleDelete: (id: number) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  /** 策略被应用后，更改该数字，达到刷新策略应用数据 */
  const tableRefreshSignal = ref(0);

  function changeRefreshSignal() {
    tableRefreshSignal.value += 1;
  }

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyGoldTransferPolicyList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const tableData = ref<ApiMhxy.GoldTransferPolicy[]>([]);

  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ApiMhxy.GoldTransferPolicy>> = ref([
    {
      type: 'expand',
      renderExpand: (rowData) => {
        return h(PolicyApplyTable, {
          policyId: rowData.id,
          signal: tableRefreshSignal.value,
          onEdit: (apply) => onEditApply(rowData, apply),
        });
      },
    },
    {
      key: 'name',
      title: '策略名称',
      align: 'center',
    },
    {
      key: 'propCategory',
      title: '道具种类',
      align: 'center',
      render: (row) => h('span', row.propCategory.name),
    },
    {
      key: 'quota',
      title: '额度',
      align: 'center',
    },
    {
      key: 'cycleByDay',
      title: '周期（天）',
      align: 'center',
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: '170px',
      render: (row) => {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              h(PopoverBtn, {
                msg: '编辑',
                icon: ButtonIconEnum.edit,
                onClick: () => handleEdit(row),
              }),
              h(PopoverBtn, {
                msg: '应用策略',
                icon: ButtonIconEnum.userAdd,
                onClick: () => handleApply(row),
              }),
              h(
                NPopconfirm,
                { onPositiveClick: () => handleDelete(row.id), trigger: 'hover' },
                {
                  default: () => '确认删除',
                  trigger: () =>
                    h(
                      NButton,
                      { type: 'error', size: 'small' },
                      {
                        icon: iconRender({ fontSize: 18, icon: ButtonIconEnum.delete }),
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

  const expandedRowKeys = ref<PolicyKeys>([]);
  function onUpdateExpandedRowKeys(keys: PolicyKeys) {
    expandedRowKeys.value = keys.length ? keys.slice(-1) : [];
  }

  return {
    /** 列表字段 */
    columns,
    /** 列表数据 */
    tableData,
    /** 列表加载状态 */
    loading,
    /** 获取列表数据 */
    getTableData,
    /** 分页信息 */
    pagination,
    expandedRowKeys,
    onUpdateExpandedRowKeys,
    changeRefreshSignal,
  };
}
