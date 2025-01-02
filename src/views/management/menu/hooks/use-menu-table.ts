import { useBoolean, usePagination } from '@/hooks';
import { NTag, type DataTableColumns, NPopconfirm, NButton, NSpace } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { menuList } from '../api';
import { useIconRender } from '@/composables';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';

export function useMenuTable(
  onAdd: (parentId: number | null) => void,
  onEdit: (row: ResMenu.MenuListData) => void,
  onDelete: (id: number) => void,
  onPermissionManage: (row: ResMenu.MenuListData) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ResMenu.MenuListData>> = ref([
    {
      key: 'name',
      title: '菜单名称',
      align: 'left',
      titleAlign: 'center',
    },
    {
      key: 'key',
      title: '菜单标识',
      align: 'center',
    },
    {
      key: 'type',
      title: '类型',
      align: 'center',
      width: 100,
      render: (row) => {
        const isMenu = row.type === 'menu';
        return h(
          NTag,
          { type: isMenu ? 'warning' : 'success' },
          { default: () => (isMenu ? '菜单' : '页面') },
        );
      },
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: 220,
      render: (row) => {
        const { permission } = row;
        const delBtn = h(
          NPopconfirm,
          { onPositiveClick: () => onDelete(row.id), trigger: 'hover' },
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
        const addBtn = h(PopoverBtn, {
          msg: '新增',
          icon: ButtonIconEnum.add,
          onClick: () => onAdd(row.id),
        });
        const permissionBtn = h(PopoverBtn, {
          msg: '编辑权限',
          icon: ButtonIconEnum.setting,
          onClick: () => {
            onPermissionManage(row);
          },
        });

        const editBtn = h(PopoverBtn, {
          msg: '编辑',
          icon: ButtonIconEnum.edit,
          onClick: () => onEdit(row),
        });
        return h(
          NSpace,
          { justify: 'right' },
          {
            default: () => [
              permission.add ? addBtn : null,
              permission.edit ? editBtn : null,
              permission.permissionManage ? permissionBtn : null,
              permission.delete ? delBtn : null,
            ],
          },
        );
      },
    },
  ]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  const tableData = ref<ResMenu.MenuListData[]>([]);

  const expandedRowKeys = ref<number[]>([]);

  function onExpandedRowKeys(keys: number[]) {
    expandedRowKeys.value = keys;
  }

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await menuList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);

      const expandedKeys: number[] = [];
      list.forEach((menu) => {
        if (menu.children?.length) {
          expandedKeys.push(menu.id);
        }
      });
      expandedRowKeys.value = expandedKeys;
    }
    endLoading();
  }

  return {
    /** 列表加载状态 */
    loading,
    /** 停止列表加载状态 */
    endLoading,
    /** 列表字段 */
    columns,
    /** 获取菜单数据 */
    getTableData,
    /** 列表分页信息 */
    pagination,
    /** 展开项，默认展开所有子菜单 */
    expandedRowKeys,
    /** 展开项的折叠操作 */
    onExpandedRowKeys,
    /** 列表数据 */
    tableData,
  };
}
