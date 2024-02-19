import { PopoverBtn } from '@/components';
import { useIconRender, useRouterPush } from '@/composables';
import { ButtonIconEnum, ProfileGameGuideTypeEnum } from '@/enums';
import { useBoolean } from '@/hooks';
import { psnProfileGameGuideList } from '@/service';
import { NSpace, type DataTableColumns, NPopconfirm, NButton } from 'naive-ui';
import { h, ref, type Ref } from 'vue';

export function useGudieTable(
  onEditGuide: (data: ApiPsn.ProfileGameGuide) => void,
  onDeleteGuide: (id: ApiPsn.ProfileGameGuide['id']) => void,
) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

  const { toOutsideUrl } = useRouterPush(false);

  const { iconRender } = useIconRender();

  const tableData = ref<ApiPsn.ProfileGameGuide[]>([]);

  const columns: Ref<DataTableColumns<ApiPsn.ProfileGameGuide>> = ref([
    {
      key: 'title',
      title: '标题名称',
    },
    {
      key: 'operation',
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (row) => {
        const { url, type } = row;
        const linkBtn = h(PopoverBtn, {
          msg: '查看链接',
          icon: ButtonIconEnum.link,
          onClick: () => {
            toOutsideUrl(url);
          },
        });
        const showLink = type === ProfileGameGuideTypeEnum.url;
        const editBtn = h(PopoverBtn, {
          msg: '编辑',
          icon: ButtonIconEnum.edit,
          onClick: () => {
            onEditGuide(row);
          },
        });

        const deleteBtn = h(
          NPopconfirm,
          { onPositiveClick: () => onDeleteGuide(row.id), trigger: 'hover' },
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
        return h(NSpace, { justify: 'center' }, () => [
          editBtn,
          deleteBtn,
          showLink ? linkBtn : null,
        ]);
      },
    },
  ]);

  async function getPsnProfileGameGuideList(id: ApiPsn.ProfileGame['id']) {
    startLoading();
    const { data, error } = await psnProfileGameGuideList(id);
    if (!error) {
      tableData.value = data;
    }
    endLoading();
  }

  return {
    loading,
    tableData,
    columns,
    getPsnProfileGameGuideList,
  };
}
