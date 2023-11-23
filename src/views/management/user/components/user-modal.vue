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
        <NInput v-model:value="formModel.username" placeholder="请输入用户名" />
      </NFormItem>
      <NFormItem label="昵称" path="nickname">
        <NInput v-model:value="formModel.nickname" placeholder="请输入昵称" />
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
import { useBoolean } from '@/hooks';
import type { FormInst, FormItemRule } from 'naive-ui';
import { computed, ref, reactive, watch } from 'vue';
import { userAdd, userEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'UserModal',
});

export interface Props {
  visible: boolean;
  type?: 'add' | 'edit';
  editData?: ApiManagement.User | null;
}

export type ModalType = NonNullable<Props['type']>;

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null,
});

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },

  set(visible) {
    emit('update:visible', visible);
  },
});

const title = computed(() => {
  const titleMap: Record<ModalType, string> = {
    add: '添加用户',
    edit: '编辑用户',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<BusinessManagement.User, 'username' | 'nickname' | 'password' | 'id'>;

function createFormModel(): FormModel {
  return {
    username: '',
    nickname: '',
    password: '',
    id: '',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

function handleUpdateFormModelByFormType() {
  const handlers: Record<ModalType, () => void> = {
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
  Object.keys(formModel).forEach((key) => {
    const cKey = key as keyof FormModel;
    formModel[cKey] = model[cKey] || '';
  });
}

const { bool: submitLoading, setTrue: showLoading, setFalse: closeLoading } = useBoolean(false);

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

function closeModal() {
  modalVisible.value = false;
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      handleUpdateFormModelByFormType();
    } else {
      formRef.value?.restoreValidation();
    }
  },
);
</script>

<style lang="scss" scoped></style>
