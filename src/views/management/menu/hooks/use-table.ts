import { useBoolean, usePagination } from '@/hooks';
import { NTag, type DataTableColumns, NPopconfirm, NButton, NSpace } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { PARENT_FLAG } from '../constants';
import { menuList } from '@/service';
import { useIconRender } from '@/composables';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';

export function useTable(
  operation: Ref<System.OperationPermission>,
  handleAdd: (parentId?: number) => void,
  handleEdit: (row: ApiManagement.Menu) => void,
  handleDelete: (id: number) => void,
  handlePermission: (row: ApiManagement.Menu) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ApiManagement.Menu>> = ref([
    {
      key: 'name',
      title: '菜单名称',
      align: 'left',
      titleAlign: 'center',
    },
    {
      key: 'key',
      title: '菜单 Key',
      align: 'center',
    },
    {
      key: 'isParent',
      title: '类型',
      align: 'center',
      render: (row) => {
        const isParent = row.parentId === PARENT_FLAG;
        const isMenu = isParent && row.children;
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
      render: (row) => {
        const hasDel = !row.children && operation.value.canDelete;
        const hasAdd = row.parentId === PARENT_FLAG && operation.value.canAdd;
        const hasPermission = !row.children && operation.value.canAllocation;
        const delBtn = h(
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
        const addBtn = h(PopoverBtn, {
          msg: '新增',
          icon: ButtonIconEnum.add,
          onClick: () => handleAdd(row.id),
        });
        const permissionBtn = h(PopoverBtn, {
          msg: '编辑权限',
          icon: ButtonIconEnum.setting,
          onClick: () => {
            handlePermission(row);
          },
        });

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
            default: () => [
              hasAdd ? addBtn : null,
              canEdit ? editBtn : null,
              hasPermission ? permissionBtn : null,
              hasDel ? delBtn : null,
            ],
          },
        );
      },
    },
  ]);

  const { pagination, getPageParams } = usePagination(getTableData);

  const tableData = ref<ApiManagement.Menu[]>([]);

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
      pagination.itemCount = total;

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
