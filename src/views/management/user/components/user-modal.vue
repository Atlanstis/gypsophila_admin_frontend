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
      <NFormItem v-if="roleFiledShow" label="角色" path="roleIds">
        <NSelect
          v-model:value="formModel.roleIds"
          :options="roleList"
          multiple
          max-tag-count="responsive"
          placeholder="请选择角色"
        />
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
import { roleAssignable, userAdd, userEdit } from '@/service';
import { RoleIdEnum } from '@/constants';
import { useAuthStore } from '@/stores';
import type { UserDto, UserModel } from '../typing';

defineOptions({
  name: 'UserModal',
});

interface Props {
  type?: Modal.Type;
  editData?: Common.Nullable<UserModel>;
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

const authStore = useAuthStore();

const roleFiledShow = computed(() => {
  // 拥有超级管理员的角色无法修改
  if (formModel.roleIds.includes(RoleIdEnum.Admin)) return false;
  // 编辑时，无法修改自身角色
  if (props.type === 'edit' && authStore.userInfo?.id === formModel.id) return false;
  return true;
});

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '添加用户',
    edit: '编辑用户',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = UserModel;

function createFormModel(): FormModel {
  return {
    username: '',
    nickname: '',
    id: null,
    password: '',
    roleIds: [],
  };
}

const roleList = ref<SelectOption[]>([]);

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
  roleIds: [{ required: true, type: 'array', max: 3, message: '请选择角色', trigger: 'change' }],
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
  const params: UserDto = {
    ...formModel,
  };
  if (props.type === 'add' && formModel.password) {
    params.password = await authStore.encrypt(formModel.password);
  } else {
    delete params.password;
  }
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

/** 获取可以分配的角色 */
async function getRoleList() {
  roleList.value = [];
  const { data, error } = await roleAssignable();
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
