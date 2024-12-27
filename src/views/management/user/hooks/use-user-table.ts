import { NTag, type DataTableColumns, NPopconfirm, NSpace, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { useBoolean, usePagination } from '@/hooks';
import { useIconRender } from '@/composables';
import { userList } from '../api';

/** 有关列表的操作 */
export function useUserTable(
  handleEdit: (row: ResUser.UserListData) => void,
  handleDelete: (id: string) => void,
) {
  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ResUser.UserListData>> = ref([
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
          h(NTag, { type: 'primary' }, { default: () => role.name }),
        );
        return h(NSpace, {}, { default: () => roleName });
      },
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      render: (row) => {
        const { permission, id } = row;
        const delConfirm = h(
          NPopconfirm,
          { onPositiveClick: () => handleDelete(id), trigger: 'hover' },
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

        const editBtn = h(PopoverBtn, {
          msg: '编辑',
          icon: ButtonIconEnum.edit,
          onClick: () => handleEdit(row),
        });
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              permission.edit ? editBtn : null,
              permission.delete ? delConfirm : null,
            ],
          },
        );
      },
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ResUser.UserListData[]>([]);

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
