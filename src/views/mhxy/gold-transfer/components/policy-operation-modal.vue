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
      <NFormItem label="策略名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入策略名称"></NInput>
      </NFormItem>
      <NFormItem label="道具种类" path="propCategoryId">
        <NTreeSelect
          v-model:value="formModel.propCategoryId"
          filterable
          cascade
          checkable
          :options="propCategoryTree"
        ></NTreeSelect>
      </NFormItem>
      <NFormItem label="额度" path="quota">
        <NInputNumber
          v-model:value="formModel.quota"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="周期（天）" path="cycleByDay">
        <NInputNumber
          v-model:value="formModel.cycleByDay"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
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
import { useModal, type ModalEmits, type ModalProps, usePropCategoryList } from '@/hooks';
import { type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, computed } from 'vue';
import { mhxyGoldTransferPolicyAdd, mhxyGoldTransferPolicyEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'GoldTransferPolicyModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.GoldTransferPolicyFormModel;

interface Props {
  type: Modal.Type;
  editData?: FormModel | null;
}

const props = withDefaults(defineProps<Props & ModalProps>(), {
  visible: false,
});

const emit = defineEmits<Emits & ModalEmits>();

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emit,
  afterOpenModal,
  afterCloseModal,
);

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: undefined,
    name: '',
    quota: undefined,
    cycleByDay: undefined,
    propCategoryId: undefined,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请选择策略名称', trigger: 'blur' }],
  propCategoryId: [{ required: true, message: '请选择种类', type: 'number', trigger: 'change' }],
  quota: [
    { required: true, message: '请输入额度', type: 'number', trigger: 'blur' },
    { min: 1, message: '请输入大于 0 的数字', type: 'number', trigger: 'blur' },
  ],
  cycleByDay: [
    { required: true, message: '请输入周期', type: 'number', trigger: 'blur' },
    { min: 1, message: '请输入大于 0 的数字', type: 'number', trigger: 'blur' },
  ],
};

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '新增转金策略',
    edit: '编辑转金策略',
  };
  return titleMap[props.type];
});

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
  const api = props.type === 'add' ? mhxyGoldTransferPolicyAdd : mhxyGoldTransferPolicyEdit;
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

const { propCategoryTree, getPropCatrgory } = usePropCategoryList();

function afterOpenModal() {
  getPropCatrgory();
  handleUpdateFormModelByFormType();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
