<template>
  <NModal
    v-model:show="modalVisible"
    title="分配菜单"
    preset="card"
    :segmented="true"
    class="w-600px"
  >
    <NDataTable
      striped
      children-key=""
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="false"
      :single-line="false"
    >
    </NDataTable>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="closeModal">取消</NButton>
        <NButton type="primary" :loading="submitLoading" @click="formSubmit">提交</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { useModal, type ModalProps, type ModalEmits, useBoolean } from '@/hooks';
import { menuListAll, roleMenu, roleMenuEdit } from '@/service';
import { NCheckbox, type DataTableColumns, NSpace } from 'naive-ui';
import { computed, h, ref } from 'vue';

type Props = {
  roleId: number | null;
};

const props = withDefaults(defineProps<ModalProps & Props>(), {
  visible: false,
  roleId: null,
});

const emits = defineEmits<ModalEmits>();

defineOptions({
  name: 'AllocationMenuModal',
});

const columns = computed(() => {
  const columns: DataTableColumns<ApiManagement.Menu> = [
    {
      key: 'one',
      title: '一级菜单',
      align: 'center',
      rowSpan: (rowData, rowIndex) => rowSpanArr.value[rowIndex],
      render: (row) => {
        return h(NSpace, () => [
          h(NCheckbox, {
            checked: checked.value[row.key],
            'on-update:checked': (val: boolean) => handleMenuCheck(row.key, val),
          }),
          h('span', row.name),
        ]);
      },
    },
    {
      key: 'two',
      title: '二级菜单',
      align: 'center',
      render: (row) => {
        if (!row.children) return null;
        const item = row.children[0];
        return h(NSpace, () => [
          h(NCheckbox, {
            disabled: !checked.value[row.key],
            checked: checked.value[item.key],
            'on-update:checked': (val: boolean) => handleMenuCheck(item.key, val),
          }),
          h('span', item.name),
        ]);
      },
    },
  ];
  return columns;
});

const rowSpanArr = ref<number[]>([]);

const checked = ref<Record<string, boolean>>({});

function handleMenuCheck(key: string, val: boolean) {
  checked.value[key] = val;
}

const tableData = ref<ApiManagement.Menu[]>([]);

async function getMenuList() {
  startLoading();
  const { data, error } = await menuListAll();
  if (!error) {
    const arr: ApiManagement.Menu[] = [];
    const rowArr: number[] = [];
    data.forEach((menu) => {
      const childrenLength = menu.children ? menu.children.length : 1;
      if (menu.children) {
        for (let i = 0; i < childrenLength; i++) {
          rowArr.push(i === 0 ? childrenLength : 0);
          arr.push({ ...menu, children: [menu.children[i]] });
        }
      } else {
        rowArr.push(childrenLength);
        arr.push(menu);
      }
    });
    rowSpanArr.value = rowArr;
    tableData.value = arr;
  }
  endLoading();
}

async function getRoleMenu() {
  if (!props.roleId) return;
  const { error, data } = await roleMenu({ id: props.roleId });
  if (!error) {
    data.forEach((key) => {
      checked.value[key] = true;
    });
  }
}

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

function handleModalOpen() {
  clearData();
  getMenuList();
  getRoleMenu();
}

function clearData() {
  rowSpanArr.value = [];
  tableData.value = [];
  checked.value = {};
}

async function formSubmit() {
  if (!props.roleId) return;
  showLoading();
  const menus: string[] = [];
  Object.keys(checked.value).forEach((key) => {
    if (checked.value[key]) {
      menus.push(key);
    }
  });
  const { error } = await roleMenuEdit({ id: props.roleId, menus });
  if (!error) {
    window.$message?.success('保存成功', { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
  }
  closeLoading();
}

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emits,
  handleModalOpen,
);
</script>

<style lang="scss" scoped></style>
