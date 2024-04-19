<template>
  <NDataTable
    remote
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
  ></NDataTable>
</template>

<script lang="ts" setup>
import { h, onMounted, ref, watch, type Ref } from 'vue';
import { useBoolean, usePaginationWithDefinePageSize } from '@/hooks';
import { mhxyGoldTransferPolicyApplyDelete, mhxyGoldTransferPolicyApplyList } from '@/service';
import { NSpace, type DataTableColumns, NButton, NPopconfirm } from 'naive-ui';
import { renderMhxyAccount } from '@/utils';
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS } from '@/constants';
import { useThemeStore } from '@/stores';
import { PopoverBtn } from '@/components';

defineOptions({
  name: 'GoldTransferPolicyApplyTable',
});

defineExpose({
  getTableData,
});

interface Emits {
  (e: 'edit', data: ApiMhxy.GoldTransferPolicyApply): void;
}

const emits = defineEmits<Emits>();

const { iconRender } = useIconRender();
const { otherColor } = useThemeStore();

const columns: Ref<DataTableColumns<ApiMhxy.GoldTransferPolicyApply>> = ref([
  {
    key: 'account',
    title: '账号',
    align: 'center',
    render: (row) => renderMhxyAccount(row.account),
  },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    render: (row) => {
      const bool = row.status === ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN;
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
    },
  },
  {
    key: 'nextApplyTime',
    title: '下次执行时间',
    align: 'center',
  },
  {
    key: 'operation',
    title: '操作',
    align: 'center',
    width: '120',
    render: (row) => {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(PopoverBtn, {
              msg: '编辑',
              icon: ButtonIconEnum.edit,
              onClick: () => {
                emits('edit', row);
              },
            }),
            h(
              NPopconfirm,
              { onPositiveClick: () => onDeleteApply(row), trigger: 'hover' },
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

const props = defineProps<{
  policyId: ApiMhxy.GoldTransferPolicy['id'];
  signal: number;
}>();

watch(
  () => props.signal,
  () => {
    getTableData();
  },
);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const tableData = ref<ApiMhxy.GoldTransferPolicyApply[]>([]);

const { pagination, getPageParams } = usePaginationWithDefinePageSize(getTableData, 5);

async function getTableData() {
  startLoading();
  const { page, size } = getPageParams();
  const { data, error } = await mhxyGoldTransferPolicyApplyList(page, size, props.policyId);
  if (!error) {
    const { list, total } = data;
    tableData.value = list;
    pagination.itemCount = total;
  }
  endLoading();
}

async function onDeleteApply(row: ApiMhxy.GoldTransferPolicyApply) {
  const { error } = await mhxyGoldTransferPolicyApplyDelete(row.id);
  if (!error) {
    window.$message?.success('删除成功');
    getTableData();
  }
}

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss" scoped></style>
