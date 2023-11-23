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
import { roleAdd, roleEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'RoleModal',
});

export interface Props {
  visible: boolean;
  type?: 'add' | 'edit';
  editData?: ApiManagement.Role | null;
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
    add: '添加角色',
    edit: '编辑角色',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<ApiManagement.Role, 'name'>;

function createFormModel(): FormModel {
  return {
    name: '',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
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
  formModel.name = model.name || '';
}

const { bool: submitLoading, setTrue: showLoading, setFalse: closeLoading } = useBoolean(false);

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  let api: any;
  let params: any;
  const map: Record<ModalType, () => void> = {
    add: () => {
      api = roleAdd;
      params = { ...formModel };
    },
    edit: () => {
      api = roleEdit;
      params = { ...formModel, id: props.editData?.id };
    },
  };
  map[props.type]();
  const { error } = await api(params);
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
