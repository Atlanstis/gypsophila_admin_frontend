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
      <NFormItem path="title" label="标题">
        <NInput v-model:value="formModel.title" placeholder="请输入标题"></NInput>
      </NFormItem>
      <NFormItem path="type" label="类型">
        <NRadioGroup v-model:value="formModel.type" name="radiogroup">
          <NSpace>
            <NRadio v-for="opt in ProfileGameGuideTypeOpt" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </NFormItem>
      <NFormItem
        v-if="formModel.type === ProfileGameGuideTypeEnum.url"
        path="url"
        label="url 地址"
        first
      >
        <NInput v-model:value="formModel.url" placeholder="请输入 url 地址"></NInput>
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
import type { FormInst, FormItemRule } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { ProfileGameGuideTypeEnum, ProfileGameGuideTypeOpt } from '@/enums';
import { isURL } from 'class-validator';
import { psnProfileGameGuideAdd, psnProfileGameGuideEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'GuideModal',
});

interface Props {
  type?: Modal.Type;
  editData?: ApiPsn.ProfileGameGuide | null;
  ppgId: ApiPsn.ProfileGame['id'];
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
    add: '新增攻略',
    edit: '编辑攻略',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Omit<ApiPsn.ProfileGameGuide, 'text' | 'order' | 'isCompleted'>;

function createFormModel(): FormModel {
  return {
    id: undefined,
    title: '',
    type: ProfileGameGuideTypeEnum.url,
    url: '',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    {
      validator: (rule: FormItemRule, value: string) => {
        if (!isURL(value, { protocols: ['https', 'http'], require_protocol: true })) {
          return new Error('请输入正确的 url 地址');
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
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
  const api = props.type === 'add' ? psnProfileGameGuideAdd : psnProfileGameGuideEdit;
  const { error } = await api({ ...formModel, ppgId: props.ppgId });
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
