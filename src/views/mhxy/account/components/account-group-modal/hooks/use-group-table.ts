import {
  NSpace,
  type DataTableColumns,
  NButton,
  NPopconfirm,
  NAvatarGroup,
  NTooltip,
  NAvatar,
} from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import type { Props } from '../index.vue';
import { useAccountGroupList } from '@/hooks';
import { useIconRender } from '@/composables';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { mhxyRoleImgMap } from '@/assets';

/**
 * 列表的相关操作
 * @param props 组件 props
 * @param handleEdit 数据编辑操作
 * @param handleDelete 数据删除操作
 */
export function useGroupTable(
  props: Props,
  handleEdit: (row: ApiMhxy.AccountGroup) => void,
  handleDelete: (id: number) => void,
) {
  const { loading, getAccountGroupData, accountGroupData, clearGroupData } =
    useAccountGroupList(true);

  const { iconRender } = useIconRender();

  const columns: Ref<DataTableColumns<ApiMhxy.AccountGroup>> = ref([
    {
      key: 'name',
      title: '分组名称',
      align: 'center',
    },
    {
      key: 'items',
      title: '账号详情',
      align: 'center',
      render: (row) => {
        const accounts = row.items.map((item) => ({
          name: item.account.name,
          src: mhxyRoleImgMap[item.account.role],
        }));
        return h(
          NAvatarGroup,
          { options: accounts, max: 3 },
          {
            avatar: ({ option }: { option: { name: string; src: string } }) =>
              h(
                NTooltip,
                {},
                {
                  trigger: () => h(NAvatar, { src: option.src }),
                  default: () => option.name,
                },
              ),

            rest: ({ rest }: { rest: number }) =>
              h(NAvatar, {}, { default: () => h('span', `+${rest}`) }),
          },
        );
      },
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
              h(PopoverBtn, {
                msg: '编辑',
                icon: ButtonIconEnum.edit,
                onClick: () => handleEdit(row),
              }),
              h(
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
              ),
            ],
          },
        );
      },
    },
  ]);

  return {
    /** 列表字段 */
    columns,
    /** 列表数据 */
    tableData: accountGroupData,
    /** 列表加载状态 */
    loading,
    /** 获取列表数据 */
    getTableData: getAccountGroupData,
    /** 清除列表数据 */
    clearTableData: clearGroupData,
  };
}
