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
      <NFormItem path="name" label="区服名称">
        <NInput v-model:value="formModel.name" placeholder="请输入区服名称"></NInput>
      </NFormItem>
      <NFormItem path="openDate" label="开服时间">
        <n-date-picker v-model:value="formModel.openDate" type="date" />
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
import { mhxyAreaAdd, mhxyAreaEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { transformDateStrToMs, transformMsToDateStr } from '@/utils';

defineOptions({
  name: 'ChannelModal',
});

interface Props {
  type: Modal.Type;
  editData?: any;
}

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = { name: string; id: undefined | number; openDate: number | undefined };

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
    add: '新增区服',
    edit: '编辑区服',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: undefined,
    name: '',
    openDate: undefined,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入区服名称', trigger: 'change' }],
  openDate: [{ required: true, type: 'number', message: '请输入开服时间', trigger: 'change' }],
};

function handleUpdateFormModelByFormType() {
  const handlers: Record<Modal.Type, () => void> = {
    add: () => {
      const defaultFormModal = createFormModel();
      handleUpdateFormModel(defaultFormModal);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel({
          ...props.editData,
          openDate: transformDateStrToMs(props.editData.openDate),
        });
      }
    },
  };
  handlers[props.type]();
}

function handleUpdateFormModel(model: any) {
  Object.assign(formModel, model);
}

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  if (!formModel.openDate) return;
  const api = props.type === 'add' ? mhxyAreaAdd : mhxyAreaEdit;
  const { error } = await api({
    ...formModel,
    openDate: transformMsToDateStr(formModel.openDate),
  });
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
