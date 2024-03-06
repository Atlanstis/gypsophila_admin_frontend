import { useBoolean, usePagination } from '@/hooks';
import { mhxyGoldTradeCategoryList } from '@/service';
import { NSpace, type DataTableColumns, NPopconfirm, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useIconRender } from '@/composables';
import { useThemeStore } from '@/stores';
import { ButtonIconEnum } from '@/enums';
import { PopoverBtn } from '@/components';

export function useCategoryTable(
  onCategoryEdit: (row: ApiMhxy.GoldTradeCategory) => void,
  onCategoryDelete: (row: ApiMhxy.GoldTradeCategory) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.GoldTradeCategory[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyGoldTradeCategoryList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const { iconRender } = useIconRender();
  const { otherColor } = useThemeStore();

  function renderCircle(bool: boolean) {
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

  const columns: Ref<DataTableColumns<ApiMhxy.GoldTradeCategory>> = ref([
    {
      key: 'name',
      title: '种类',
      align: 'center',
    },
    {
      key: 'isTransfer',
      title: '是否是转金项',
      align: 'center',
      render: (row) => renderCircle(row.isTransfer),
    },
    {
      key: 'isGem',
      title: '是否是珍品',
      align: 'center',
      render: (row) => renderCircle(row.isGem),
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: (row) => renderCircle(row.status === '1'),
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
              !row.isDefault
                ? h(
                    PopoverBtn,
                    { msg: '编辑', icon: ButtonIconEnum.edit, onClick: () => onCategoryEdit(row) },
                    { default: () => '编辑' },
                  )
                : null,
              !row.isDefault
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

  return { loading, tableData, pagination, columns, getTableData };
}
