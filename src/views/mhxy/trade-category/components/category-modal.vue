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
      :label-width="100"
      require-mark-placement="left"
      :rules="formRules"
    >
      <NFormItem path="name" label="种类名称">
        <NInput v-model:value="formModel.name" placeholder="请输入种类名称"></NInput>
      </NFormItem>
      <NFormItem path="isTransfer" label="是否是转金项">
        <NSwitch v-model:value="formModel.isTransfer" />
      </NFormItem>
      <NFormItem path="isGem" label="是否是珍品">
        <NSwitch v-model:value="formModel.isGem" />
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
import { type FormInst, type FormItemRule } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { mhxyGoldTradeCategoryAdd, mhxyGoldTradeCategoryEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'TradeCategoryModal',
});

interface Props {
  type: Modal.Type;
  editData?: Partial<BusinessMhxy.GoldTradeCategory> | null;
}

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.GoldTradeCategory;

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
    add: '新增贸易种类',
    edit: '编辑贸易种类',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: undefined,
    name: '',
    isTransfer: false,
    isGem: false,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入种类名称', trigger: 'blur' }],
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
  const api = props.type === 'add' ? mhxyGoldTradeCategoryAdd : mhxyGoldTradeCategoryEdit;
  const { error } = await api({ ...formModel });
  if (!error) {
    window.$message?.success(`${title.value}成功`, { duration: DEFAULT_MESSAGE_DURATION });
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
