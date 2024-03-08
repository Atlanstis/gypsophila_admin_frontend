import { useBoolean } from '@/hooks';
import { mhxyPropCategoryList } from '@/service';
import { NSpace, type DataTableColumns, NPopconfirm, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useIconRender } from '@/composables';
import { useThemeStore } from '@/stores';
import { ButtonIconEnum } from '@/enums';
import { PopoverBtn } from '@/components';

export function useCategoryTable(
  onCategoryEdit: (row: ApiMhxy.PropCategory) => void,
  onCategoryDelete: (row: ApiMhxy.PropCategory) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.PropCategory[]>([]);

  async function getTableData() {
    startLoading();
    const { data, error } = await mhxyPropCategoryList();
    if (!error) {
      tableData.value = data;
    }
    endLoading();
  }

  const { iconRender } = useIconRender();
  const { otherColor } = useThemeStore();

  function renderBoolean(bool: boolean) {
    return h(
      NSpace,
      { justify: 'center', align: 'center' },
      {
        default: () =>
          h(
            iconRender({
              icon: bool ? ButtonIconEnum.circleConfirm : ButtonIconEnum.circleClose,
              fontSize: 18,
              color: bool ? otherColor.success : otherColor.error,
            }),
          ),
      },
    );
  }

  const columns: Ref<DataTableColumns<ApiMhxy.PropCategory>> = ref([
    {
      key: 'name',
      title: '种类',
    },
    {
      key: 'isGem',
      title: '是否是珍品',
      align: 'center',
      render: (row) => renderBoolean(row.isGem),
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
                PopoverBtn,
                { msg: '编辑', icon: ButtonIconEnum.edit, onClick: () => onCategoryEdit(row) },
                { default: () => '编辑' },
              ),
              !row.children.length
                ? h(
                    NPopconfirm,
                    { onPositiveClick: () => onCategoryDelete(row), trigger: 'hover' },
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
                  )
                : null,
            ],
          },
        );
      },
    },
  ]);

  return { loading, tableData, columns, getTableData };
}
