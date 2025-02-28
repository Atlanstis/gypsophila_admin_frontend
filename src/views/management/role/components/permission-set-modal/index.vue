<template>
  <NModal
    v-model:show="modalVisible"
    title="权限设置"
    preset="card"
    :segmented="true"
    class="w-720px"
  >
    <div v-if="loading" class="h-200px flex-center">
      <NSpin></NSpin>
    </div>
    <div v-else class="h-400px m-b-2px">
      <ScrollContainer>
        <MenuPermissionTree
          :menuTree="menuTree"
          v-model:menuChecked="menuChecked"
          v-model:permissionMap="permissionMap"
        />
      </ScrollContainer>
    </div>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="closeModal">取消</NButton>
        <NButton type="primary" :loading="submitLoading" @click="formSubmit">提交</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script lang="ts" setup>
import { useModal, type ModalProps, type ModalEmits, useBoolean } from '@/hooks';
import { NSpace, NButton } from 'naive-ui';
import { ref } from 'vue';
import { roleMenuPermission, roleMenuPermissionEdit } from '../../api';
import MenuPermissionTree from './menu-permission-tree';

type Props = {
  roleId: number | null;
};

const props = withDefaults(defineProps<ModalProps & Props>(), {
  visible: false,
  roleId: null,
});

const emits = defineEmits<ModalEmits>();

defineOptions({
  name: 'PermissionSetModal',
});

/** 菜单树 */
const menuTree = ref<ResMenu.MenuWithChildren[]>([]);

/** 记录菜单选中状态 */
const menuChecked = ref<Record<string, boolean>>({});

/** 记录各级菜单权限选中状态 */
const permissionMap = ref<Record<string, number[]>>({});

/** 获取菜单及其权限 */
async function getRoleMenuPermission() {
  if (!props.roleId) return;
  startLoading();

  const { error, data } = await roleMenuPermission({ id: props.roleId });
  if (!error) {
    const { mps, list } = data;
    menuTree.value = list;
    /** 处理菜单及权限选中状态 */
    for (const { menuId, permissionIds } of mps) {
      menuChecked.value[menuId] = true;
      permissionMap.value[menuId] = permissionIds || [];
    }
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
  menuChecked.value = {};
  permissionMap.value = {};
}

/** 表单提交 */
async function formSubmit() {
  if (!props.roleId) return;
  const mps: ResRole.MenuPermission['mps'] = [];
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
    window.$message?.success('保存成功');
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
