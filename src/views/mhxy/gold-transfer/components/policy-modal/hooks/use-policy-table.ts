import { NSpace, type DataTableColumns, NButton, NPopconfirm } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useBoolean, usePagination } from '@/hooks';
import { useIconRender } from '@/composables';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { mhxyGoldTransferPolicyList } from '@/service';

/**
 * 列表的相关操作
 * @param props 组件 props
 * @param handleEdit 数据编辑操作
 * @param handleDelete 数据删除操作
 */
export function usePolicyTable(
  handleEdit: (row: ApiMhxy.GoldTransferPolicy) => void,
  handleDelete: (id: number) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

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
      width: '120px',
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
  };
}
