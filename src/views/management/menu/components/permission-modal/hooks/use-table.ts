import { menuPermissionList } from '@/service';
import { NSpace, type DataTableColumns, NButton, NPopconfirm, NTag } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import type { Props } from '../index.vue';
import { useBoolean } from '@/hooks';
import { PermissionTypeOpts } from '@/views/management/menu/constants';
/**
 * 列表的相关操作
 * @param props 组件 props
 * @param handleEdit 数据编辑操作
 * @param handleDelete 数据删除操作
 */
export function useTable(
  props: Props,
  handleEdit: (row: ApiManagement.Permission) => void,
  handleDelete: (id: number) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const columns: Ref<DataTableColumns<ApiManagement.Permission>> = ref([
    {
      key: 'name',
      title: '权限名称',
      align: 'center',
    },
    {
      key: 'key',
      title: '权限 Key',
      align: 'center',
    },
    {
      key: 'type',
      title: '类型',
      align: 'center',
      render: ({ type }) => {
        const item = PermissionTypeOpts.find((opt) => opt.value === type);
        return item ? h(NTag, { bordered: false, type: 'primary' }, () => item.label) : null;
      },
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      render: (row) => {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              h(
                NButton,
                { size: 'small', onClick: () => handleEdit(row) },
                { default: () => '编辑' },
              ),
              h(
                NPopconfirm,
                { onPositiveClick: () => handleDelete(row.id) },
                {
                  default: () => '确认删除',
                  trigger: () => h(NButton, { size: 'small', type: 'error' }, () => '删除'),
                },
              ),
            ],
          },
        );
      },
    },
  ]);

  const tableData = ref<ApiManagement.Permission[]>([]);

  async function getTableData() {
    if (!props.menuId) return;
    tableData.value = [];
    startLoading();
    const { data, error } = await menuPermissionList(props.menuId);
    if (!error) {
      tableData.value = data;
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
  };
}
