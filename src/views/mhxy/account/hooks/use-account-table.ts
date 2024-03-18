import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountList } from '@/service';
import {
  NSpace,
  type DataTableColumns,
  NAvatar,
  NNumberAnimation,
  NPopconfirm,
  NButton,
} from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { mhxySectImgMap } from '@/assets';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { useIconRender } from '@/composables';
import { renderMhxyAccount } from '@/utils';
import { useThemeStore } from '@/stores';

export function useAccountTable(
  accountSects: Ref<ApiMhxy.AccountSect[]>,
  onAccountEdit: (row: ApiMhxy.Account) => void,
  onAccountDelete: (row: ApiMhxy.Account) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiMhxy.Account[]>([]);

  const { pagination, getPageParams, setItemCount } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await mhxyAccountList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      setItemCount(total);
    }
    endLoading();
  }

  const { iconRender } = useIconRender();
  const { otherColor } = useThemeStore();

  const columns: Ref<DataTableColumns<ApiMhxy.Account>> = ref([
    {
      key: 'name',
      title: '账号',
      align: 'center',
      render: (row) => renderMhxyAccount(row),
    },
    {
      key: 'sect',
      title: '门派',
      align: 'center',
      render: (row) => {
        const sectName = accountSects.value.find((item) => item.value === row.sect)?.label;
        return h(
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
                src: mhxySectImgMap[row.sect],
                round: true,
                color: '#fff',
                size: 'small',
                style: { marginRight: '8px' },
              }),
              h('span', {}, sectName),
            ],
          },
        );
      },
    },
    {
      key: 'gold',
      title: '金币数',
      align: 'center',
      render: (row) =>
        h(
          NSpace,
          { justify: 'center', align: 'center' },
          {
            default: () => [
              h(NNumberAnimation, {
                from: 0,
                to: row.gold,
                'show-separator': true,
                duration: 1000,
              }),
              row.lockGold > 0
                ? [
                    h('span', {}, `/`),
                    h(
                      'div',
                      { style: { color: otherColor.error } },
                      h(NNumberAnimation, {
                        from: 0,
                        to: row.lockGold,
                        'show-separator': true,
                        duration: 1000,
                      }),
                    ),
                    h(
                      iconRender({
                        fontSize: 18,
                        icon: ButtonIconEnum.lock,
                        color: otherColor.error,
                      }),
                    ),
                  ]
                : null,
            ],
          },
        ),
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
                { msg: '编辑', icon: ButtonIconEnum.edit, onClick: () => onAccountEdit(row) },
                { default: () => '编辑' },
              ),
              h(
                NPopconfirm,
                { onPositiveClick: () => onAccountDelete(row), trigger: 'hover' },
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
              ),
            ],
          },
        );
      },
    },
  ]);

  return { loading, tableData, pagination, columns, getTableData };
}
