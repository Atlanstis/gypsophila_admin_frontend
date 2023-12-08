import { usePagination } from '@/composables';
import { BusinessRoleEnum } from '@/enums';
import { useBoolean } from '@/hooks';
import { userList } from '@/service';
import { NTag, type DataTableColumns, NPopconfirm, NButton, NSpace } from 'naive-ui';
import { h, ref, type Ref } from 'vue';

/** 有关列表的操作 */
export function useTable(
  handleEdit: (row: ApiManagement.User) => void,
  handleDelete: (id: string) => void,
) {
  const columns: Ref<DataTableColumns<ApiManagement.User>> = ref([
    {
      key: 'username',
      title: '用户名',
      align: 'center',
    },
    {
      key: 'nickname',
      title: '昵称',
      align: 'center',
    },
    {
      key: 'roles',
      title: '角色',
      align: 'center',
      render: (row) => {
        const roleName = row.roles.map((role) =>
          h(NTag, { type: 'info' }, { default: () => role.name }),
        );
        return h('div', roleName);
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
        const canDel = !row.roles.some((role) => role.id === BusinessRoleEnum.SuperAdmin);
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
              canDel ? delConfirm : null,
            ],
          },
        );
      },
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

  const tableData = ref<ApiManagement.User[]>([]);

  const { pagination, getPageParams } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await userList(page, size);
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
    /** 列表加载状态 */
    loading,
    /** 获取列表数据 */
    getTableData,
    /** 列表数据 */
    tableData,
    /** 分页信息 */
    pagination,
  };
}
