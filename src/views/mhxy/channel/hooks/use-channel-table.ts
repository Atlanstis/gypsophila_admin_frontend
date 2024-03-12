import { useBoolean } from '@/hooks';
import { mhxyChannelList } from '@/service';
import { NSpace, type DataTableColumns, NPopconfirm, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { PopoverBtn } from '@/components';

export function useChannelTable(
  onChannelEdit: (row: ApiMhxy.Channel) => void,
  onChannelDelete: (row: ApiMhxy.Channel) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.Channel[]>([]);

  async function getTableData() {
    startLoading();
    const { data, error } = await mhxyChannelList();
    if (!error) {
      tableData.value = data;
    }
    endLoading();
  }

  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ApiMhxy.Channel>> = ref([
    {
      key: 'name',
      title: '名称',
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
                    { msg: '编辑', icon: ButtonIconEnum.edit, onClick: () => onChannelEdit(row) },
                    { default: () => '编辑' },
                  )
                : null,
              !row.isDefault && !row.children.length
                ? h(
                    NPopconfirm,
                    { onPositiveClick: () => onChannelDelete(row), trigger: 'hover' },
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
