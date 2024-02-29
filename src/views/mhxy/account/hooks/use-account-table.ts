import { useBoolean, usePagination } from '@/hooks';
import { mhxyAccountList } from '@/service';
import {
  NSpace,
  type DataTableColumns,
  NTag,
  NAvatar,
  NNumberAnimation,
  NPopconfirm,
  NButton,
} from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { mhxyRoleImgMap, mhxySectImgMap } from '@/assets';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { useIconRender } from '@/composables';

export function useAccountTable(
  accountRoles: Ref<ApiMhxy.AccountRole[]>,
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

  const columns: Ref<DataTableColumns<ApiMhxy.Account>> = ref([
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
                src: mhxyRoleImgMap[row.role],
                round: true,
                color: '#fff',
                size: 'small',
              }),
              h(
                'span',
                {
                  style: { margin: '0 8px' },
                },
                row.name,
              ),
              row.isPrimary
                ? h(NTag, { size: 'small', type: 'primary' }, { default: () => '主号' })
                : null,
            ],
          },
        ),
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
        h(NNumberAnimation, { from: 0, to: row.gold, 'show-separator': true, duration: 1000 }),
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
