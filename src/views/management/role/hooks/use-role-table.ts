import { usePagination } from '@/composables';
import { RoleIsDefaultEnum } from '@/enums';
import { useBoolean } from '@/hooks';
import { roleList } from '@/service';
import { NTag, type DataTableColumns, NButton, NSpace, NPopconfirm } from 'naive-ui';
import { h, ref, type Ref } from 'vue';

/** 有关角色列表的操作 */
export function useRoleTable(
  handleEdit: (row: ApiManagement.Role) => void,
  handleDelete: (id: number) => void,
  handleAllocation: (row: ApiManagement.Role) => void,
) {
  const columns: Ref<DataTableColumns<ApiManagement.Role>> = ref([
    {
      key: 'name',
      title: '角色名',
      align: 'center',
    },
    {
      key: 'isDefault',
      title: '是否内置角色',
      align: 'center',
      render: (row) => {
        if (row.isDefault === RoleIsDefaultEnum.YES) {
          return h(NTag, { type: 'success' }, { default: () => '是' });
        } else if (row.isDefault === RoleIsDefaultEnum.NO) {
          return h(NTag, { type: 'warning' }, { default: () => '否' });
        }
        return null;
      },
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      render: (row) => {
        const delConfirm = h(
          NPopconfirm,
          { onPositiveClick: () => handleDelete(row.id) },
          {
            default: () => '确认删除',
            trigger: () => h(NButton, { size: 'small', type: 'error' }, () => '删除'),
          },
        );
        const isDefault = row.isDefault === RoleIsDefaultEnum.NO;
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              h(
                NButton,
                { size: 'small', onClick: () => handleAllocation(row) },
                { default: () => '权限控制' },
              ),
              h(
                NButton,
                { size: 'small', onClick: () => handleEdit(row) },
                { default: () => '编辑' },
              ),
              isDefault ? delConfirm : null,
            ],
          },
        );
      },
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

  const tableData = ref<ApiManagement.Role[]>([]);

  const { pagination, getPageParams } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await roleList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      pagination.itemCount = total;
    }
    endLoading();
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
    /** 列表分页信息 */
    pagination,
  };
}