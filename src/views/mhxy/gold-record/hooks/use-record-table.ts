import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountGoldRecordList } from '@/service';
import { NAvatar, type DataTableColumns, NSpace, NPopover } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useIconRender } from '@/composables';
import { mhxyRoleImgMap } from '@/assets';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';

export function useRecordTable() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.AccountGoldRecord[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyAccountGoldRecordList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const { iconRender } = useIconRender();
  const themeStore = useThemeStore();

  const columns: Ref<DataTableColumns<ApiMhxy.AccountGoldRecord>> = ref([
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center',
    },
    {
      key: 'name',
      title: '角色',
      align: 'center',
      render: (row) =>
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          {
            default: () => [
              h(NAvatar, {
                src: mhxyRoleImgMap[row.account.role],
                round: true,
                color: '#fff',
                size: 'small',
              }),
              h(
                'span',
                {
                  style: { marginLeft: '8px' },
                },
                row.account.name,
              ),
            ],
          },
        ),
    },
    {
      key: 'category',
      title: '种类',
      align: 'center',
      render: (row) => h('span', row.category.name),
    },
    {
      key: 'situation',
      title: '收支情况',
      align: 'center',
      render: (row) => {
        const { success, error } = themeStore.otherColor;
        const IncreaseIcon = iconRender({
          fontSize: 18,
          icon: ButtonIconEnum.increase,
          color: success,
        });
        const DecreaseIcon = iconRender({
          fontSize: 18,
          icon: ButtonIconEnum.decrease,
          color: error,
        });
        return h(
          NPopover,
          {},
          {
            trigger: () =>
              h(
                NSpace,
                { justify: 'center', align: 'center' },
                {
                  default: () => [
                    h(
                      'span',
                      {
                        style: {
                          color: row.type === 'revenue' ? success : error,
                        },
                      },
                      row.num,
                    ),
                    h(row.type === 'revenue' ? IncreaseIcon : DecreaseIcon),
                  ],
                },
              ),
            default: () =>
              h('div', [
                h('div', `后：${row.afterNum}`),
                h('div', `前：${row.beforeNum}`),
                row.remark ? h('div', `备注：${row.remark}`) : null,
              ]),
          },
        );
      },
    },
  ]);

  return { loading, tableData, pagination, columns, getTableData };
}
