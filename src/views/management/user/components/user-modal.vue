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
      <NFormItem label="用户名" path="username">
        <NInput
          v-model:value="formModel.username"
          :disabled="type === 'edit'"
          placeholder="请输入用户名"
        />
      </NFormItem>
      <NFormItem label="昵称" path="nickname">
        <NInput v-model:value="formModel.nickname" placeholder="请输入昵称" />
      </NFormItem>
      <NFormItem v-if="formModel.role !== BusinessRoleEnum.SuperAdmin" label="角色" path="role">
        <NSelect v-model:value="formModel.role" :options="roleList" placeholder="请选择角色" />
      </NFormItem>
      <NFormItem v-if="type === 'add'" label="密码" path="password">
        <NInput
          v-model:value="formModel.password"
          placeholder="请输入密码"
          type="password"
          show-password-on="click"
        />
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
import { useModal, type ModalEmits, type ModalProps } from '@/hooks';
import type { FormInst, FormItemRule, SelectOption } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { roleListAssignable, userAdd, userEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { BusinessRoleEnum } from '@/enums';

defineOptions({
  name: 'UserModal',
});

interface Props {
  type?: Modal.Type;
  editData?: BusinessManagement.UserModel | null;
}

interface Emits {
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props & ModalProps>(), {
  visible: false,
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
    add: '添加用户',
    edit: '编辑用户',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = BusinessManagement.UserModel;

function createFormModel(): FormModel {
  return {
    username: '',
    nickname: '',
    id: '',
    password: '',
    role: null,
  };
}

const roleList = ref<SelectOption[]>([]);

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, type: 'number', message: '请选择角色', trigger: 'change' }],
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
  const api = props.type === 'add' ? userAdd : userEdit;
  const { error } = await api({ ...formModel });
  if (!error) {
    const title = `${props.type === 'add' ? '新增' : '编辑'}成功`;
    window.$message?.success(title, { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
    emitSucess();
  }
  closeLoading();
}

function emitSucess() {
  emit('on-success');
}

/** 获取可以分配的角色 */
async function getRoleList() {
  roleList.value = [];
  const { data, error } = await roleListAssignable();
  if (!error) {
    roleList.value = data.map((role) => ({
      label: role.name,
      value: role.id,
    }));
  }
}

function afterOpenModal() {
  getRoleList();
  handleUpdateFormModelByFormType();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
