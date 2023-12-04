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
              checked: menuChecked.value[row.key],
              'on-update:checked': (val: boolean) => handleMenuCheck(row.key, val),
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
              disabled: !menuChecked.value[row.key],
              checked: menuChecked.value[item.key],
              'on-update:checked': (val: boolean) => handleMenuCheck(item.key, val),
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
              value: permissionMap.value[item.key],
              disabled: !menuChecked.value[row.key] || !menuChecked.value[item.key],
              'on-update:value': (val: string[]) => handlePermission(item.key, val),
            },
            () =>
              item.permissions.map((permission) =>
                h(NCheckbox, { value: permission.key }, () => permission.name),
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
function handleMenuCheck(key: string, val: boolean) {
  menuChecked.value[key] = val;
}

/** 记录各级菜单权限选中状态 */
const permissionMap = ref<Record<string, string[]>>({});

/** 处理权限是否被选中 */
function handlePermission(key: string, val: string[]) {
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
    const { menus, permissions, list } = data;
    /** 处理菜单选中状态 */
    menus.forEach((key) => {
      menuChecked.value[key] = true;
    });
    /** 处理权限选中状态 */
    permissionMap.value = permissions;
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
  showLoading();
  const menus: string[] = [];
  Object.keys(menuChecked.value).forEach((key) => {
    if (menuChecked.value[key]) {
      menus.push(key);
    }
  });
  const { error } = await roleMenuPermissionEdit({
    id: props.roleId,
    menus,
    permissions: permissionMap.value,
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
