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
      <NFormItem v-if="props.parentId !== PARENT_FLAG" label="上级菜单" path="parentId">
        <NSelect v-model:value="formModel.parentId" disabled :options="menuTopOpt" />
      </NFormItem>
      <NFormItem label="菜单名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入菜单名称" />
      </NFormItem>
      <NFormItem label="菜单 Key" path="key">
        <NInput v-model:value="formModel.key" placeholder="请输入菜单 Key" />
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
import type { FormInst, FormItemRule, SelectOption } from 'naive-ui';
import { computed, ref, reactive, watch } from 'vue';
import { menuAdd, menuEdit, menuListTop } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import type { Ref } from 'vue';
import { PARENT_FLAG } from '../constants';

defineOptions({
  name: 'UserModal',
});

export interface Props {
  visible: boolean;
  type?: 'add' | 'edit';
  editData?: ApiManagement.Menu | null;
  parentId: number;
}

export type ModalType = NonNullable<Props['type']>;

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null,
  parentId: PARENT_FLAG,
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
    add: '添加菜单',
    edit: '编辑菜单',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = { [P in Exclude<keyof ApiManagement.Menu, 'children'>]: ApiManagement.Menu[P] };

function createFormModel(): FormModel {
  return {
    id: 0,
    key: '',
    name: '',
    parentId: props.parentId || PARENT_FLAG,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入菜单 Key', trigger: 'blur' }],
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
  Object.assign(formModel, model);
}

const { bool: submitLoading, setTrue: showLoading, setFalse: closeLoading } = useBoolean(false);

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  const api = props.type === 'add' ? menuAdd : menuEdit;
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

const menuTopOpt: Ref<SelectOption[]> = ref([]);

async function getMenuTop() {
  if (!menuTopOpt.value.length) {
    const { data, error } = await menuListTop();
    if (!error) {
      menuTopOpt.value = data.map((menu) => ({
        label: menu.name,
        value: menu.id,
      }));
    }
  }
  menuListTop;
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      handleUpdateFormModelByFormType();
      getMenuTop();
    } else {
      formRef.value?.restoreValidation();
    }
  },
);
</script>

<style lang="scss" scoped></style>
