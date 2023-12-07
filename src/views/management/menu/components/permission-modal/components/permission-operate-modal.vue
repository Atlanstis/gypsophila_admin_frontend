<template>
  <NModal
    v-model:show="modalVisible"
    :title="title"
    preset="card"
    :segmented="true"
    class="w-500px"
  >
    <NForm
      ref="formRef"
      :model="formModel"
      label-placement="left"
      label-width="80"
      require-mark-placement="left"
      :rules="formRules"
    >
      <NFormItem label="权限名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入权限名称" />
      </NFormItem>
      <NFormItem label="权限 Key" path="key">
        <NInput v-model:value="formModel.key" placeholder="请输入权限 Key" />
      </NFormItem>
      <NFormItem label="类型" path="type">
        <NSelect v-model:value="formModel.type" :options="PermissionTypeOpts" />
      </NFormItem>
    </NForm>
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
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { menuPermissionAdd, menuPermissionEdit } from '@/service';
import type { FormInst, FormItemRule } from 'naive-ui';
import { computed, reactive, ref } from 'vue';
import { PermissionTypeMenu, PermissionTypeOpts } from '@/views/management/menu/constants';

defineOptions({
  name: 'PermissionOperateModal',
});

type Props = ModalProps & {
  type: Modal.Type;
  menuId: number | null;
  editData?: ApiManagement.Permission | null;
};

type Emits = ModalEmits & {
  (e: 'on-success'): void;
};

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  default: 'add',
  editData: null,
});

const emits = defineEmits<Emits>();

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emits,
  handleModalOpen,
  handleModalClose,
);

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '添加权限',
    edit: '编辑权限',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Omit<ApiManagement.Permission, 'id'> & {
  id: number | null;
};

function createFormModel(): FormModel {
  return {
    id: null,
    name: '',
    key: '',
    type: PermissionTypeMenu.Other,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入权限 Key', trigger: 'blur' }],
};

function handleUpdateFormModelByFormType() {
  const handlers: Record<Modal.Type, () => void> = {
    add: () => {
      const defaultFormModal = createFormModel();
      handleUpdateFormModel(defaultFormModal);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    },
  };
  handlers[props.type]();
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleModalOpen() {
  handleUpdateFormModelByFormType();
}

function handleModalClose() {
  formRef.value?.restoreValidation();
}

function emitSucess() {
  emits('on-success');
}

async function formSubmit() {
  if (!props.menuId) return;
  await formRef.value?.validate();
  showLoading();
  const api = props.type === 'add' ? menuPermissionAdd : menuPermissionEdit;
  const { error } = await api({ ...formModel, menuId: props.menuId });
  if (!error) {
    const title = props.type === 'add' ? '新增成功' : '编辑成功';
    window.$message?.success(title, { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
    emitSucess();
  }
  closeLoading();
}
</script>

<style lang="scss" scoped></style>
