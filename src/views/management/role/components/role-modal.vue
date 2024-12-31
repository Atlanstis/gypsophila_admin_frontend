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
      <NFormItem label="角色名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入角色名称" />
      </NFormItem>
      <NFormItem label="角色描述" path="desc">
        <NInput v-model:value="formModel.desc" type="textarea" placeholder="请输入角色描述" />
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
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import type { FormInst, FormItemRule } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { roleAdd, roleEdit } from '../api';
import type { RoleModel } from '../typings';

defineOptions({
  name: 'RoleModal',
});

export interface Props {
  type?: Modal.Type;
  editData?: Common.Nullable<RoleModel>;
}

interface Emits {
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props & ModalProps>(), {
  type: 'add',
  editData: null,
});

const emit = defineEmits<Emits & ModalEmits>();

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emit,
  afterOpenModal,
  afterCloseModal,
);

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '添加角色',
    edit: '编辑角色',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = RoleModel;

function createFormModel(): FormModel {
  return {
    id: null,
    name: '',
    desc: '',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
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

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  const api = props.type === 'add' ? roleAdd : roleEdit;
  const params = { ...formModel };
  const { error, msg } = await api(params);
  if (!error) {
    window.$message?.success(msg);
    closeModal();
    emitSucess();
  }
  closeLoading();
}

function emitSucess() {
  emit('on-success');
}

function afterOpenModal() {
  handleUpdateFormModelByFormType();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
