<template>
  <NModal
    v-model:show="modalVisible"
    title="权限控制"
    preset="card"
    :segmented="true"
    class="w-720px"
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
import { roleMenuPermission, roleMenuPermissionEdit } from '@/service';
import { NCheckbox, type DataTableColumns, NSpace, NCheckboxGroup } from 'naive-ui';
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
  const columns: DataTableColumns<BusinessManagement.RoleMenuPermission> = [
    {
      key: 'Primary',
      title: '一级菜单',
      align: 'center',
      width: '140px',
      rowSpan: (rowData, rowIndex) => rowSpanArr.value[rowIndex],
      render: (row) => {
        return h(NSpace, () => [
          h(
            NCheckbox,
            {
              checked: menuChecked.value[row.id],
              'on-update:checked': (val: boolean) => handleMenuCheck(row.id, val),
            },
            {
              default: () => row.name,
            },
          ),
        ]);
      },
    },
    {
      key: 'Secondary',
      title: '二级菜单',
      align: 'center',
      width: '140px',
      render: (row) => {
        if (!row.children) return null;
        const item = row.children[0];
        return h(NSpace, () => [
          h(
            NCheckbox,
            {
              disabled: !menuChecked.value[row.id],
              checked: menuChecked.value[item.id],
              'on-update:checked': (val: boolean) => handleMenuCheck(item.id, val),
            },
            {
              default: () => item.name,
            },
          ),
        ]);
      },
    },
    {
      key: 'permission',
      title: '权限',
      align: 'center',
      render: (row) => {
        const item = row.children ? row.children[0] : row;
        return h(NSpace, () =>
          h(
            NCheckboxGroup,
            {
              value: permissionMap.value[item.id],
              disabled: !menuChecked.value[row.id] || !menuChecked.value[item.id],
              'on-update:value': (val: number[]) => handlePermission(item.id, val),
            },
            () =>
              item.permissions &&
              item.permissions.map((permission) =>
                h(NCheckbox, { value: permission.id }, () => permission.name),
              ),
          ),
        );
      },
    },
  ];
  return columns;
});

/** 记录行合并数量 */
const rowSpanArr = ref<number[]>([]);

/** 记录菜单选中状态 */
const menuChecked = ref<Record<string, boolean>>({});

/** 处理菜单选中状体啊  */
function handleMenuCheck(key: number, val: boolean) {
  menuChecked.value[key] = val;
}

/** 记录各级菜单权限选中状态 */
const permissionMap = ref<Record<string, number[]>>({});

/** 处理权限是否被选中 */
function handlePermission(key: number, val: number[]) {
  permissionMap.value[key] = val;
}

/** 列表数据 */
const tableData = ref<BusinessManagement.RoleMenuPermission[]>([]);

/** 获取菜单及其权限 */
async function getRoleMenuPermission() {
  if (!props.roleId) return;
  startLoading();

  const { error, data } = await roleMenuPermission({ id: props.roleId });
  if (!error) {
    const { mps, list } = data;
    /** 处理菜单及权限选中状态 */
    for (const { menuId, permissionIds } of mps) {
      menuChecked.value[menuId] = true;
      permissionMap.value[menuId] = permissionIds || [];
    }
    /** 处理表单数据 */
    const arr: BusinessManagement.RoleMenuPermission[] = [];
    const rowArr: number[] = [];
    list.forEach((menu) => {
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

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

function handleModalOpen() {
  clearData();
  getRoleMenuPermission();
}

/** 清理数据 */
function clearData() {
  rowSpanArr.value = [];
  tableData.value = [];
  menuChecked.value = {};
  permissionMap.value = {};
}

/** 表单提交 */
async function formSubmit() {
  if (!props.roleId) return;
  const mps: { menuId: number; permissionIds: number[] }[] = [];
  showLoading();
  Object.keys(menuChecked.value).forEach((id) => {
    if (menuChecked.value[id]) {
      const permissionIds = permissionMap.value[id] || [];
      mps.push({ menuId: Number(id), permissionIds });
    }
  });
  const { error } = await roleMenuPermissionEdit({
    id: props.roleId,
    mps,
  });
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
