import PopoverBtn from '@/components/common/popover-btn.vue';
import { BusinessRoleEnum, ButtonIconEnum } from '@/enums';
import { useBoolean, usePagination } from '@/hooks';
import { userList } from '@/service';
import { NTag, type DataTableColumns, NPopconfirm, NSpace, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useIconRender } from '@/composables';

/** 有关列表的操作 */
export function useTable(
  operation: Ref<System.OperationPermission>,
  handleEdit: (row: ApiManagement.User) => void,
  handleDelete: (id: string) => void,
) {
  const { iconRender } = useIconRender();

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
        );
        /** 超级管理员账号，及无删除权限的无法进行删除操作 */
        const canDel =
          !row.roles.some((role) => role.id === BusinessRoleEnum.SuperAdmin) &&
          operation.value.canDelete;

        const editBtn = h(PopoverBtn, {
          msg: '编辑',
          icon: ButtonIconEnum.edit,
          onClick: () => handleEdit(row),
        });
        const canEdit = operation.value.canEdit;
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [canEdit ? editBtn : null, canDel ? delConfirm : null],
          },
        );
      },
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

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
    /** 停止列表加载状态 */
    endLoading,
    /** 获取列表数据 */
    getTableData,
    /** 列表数据 */
    tableData,
    /** 分页信息 */
    pagination,
  };
}
