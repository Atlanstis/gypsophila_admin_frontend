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
      <NFormItem v-if="parentItemShow" path="parentId" label="父途径">
        <NTreeSelect
          v-model:value="formModel.parentId"
          clearable
          filterable
          cascade
          checkable
          :disabled="parentItemDisabled"
          :options="parentOptions"
        ></NTreeSelect>
      </NFormItem>
      <NFormItem path="name" label="途径名称">
        <NInput v-model:value="formModel.name" placeholder="请输入途径名称"></NInput>
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
import { type FormInst, type FormItemRule, type TreeSelectOption } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { mhxyChannelAdd, mhxyChannelEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'ChannelModal',
});

interface Props {
  type: Modal.Type;
  editData?: Partial<BusinessMhxy.Channel> | null;
  channels: ApiMhxy.Channel[];
}

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.Channel;

const props = withDefaults(defineProps<Props & ModalProps>(), {
  visible: false,
  type: 'add',
  editData: null,
});

const emit = defineEmits<Emits & ModalEmits>();

/** 转换父途径字段映射 */
function transferKey(list: ApiMhxy.Channel[]): TreeSelectOption[] {
  return list.map((item) => {
    const children = transferKey(item.children);
    const opt: TreeSelectOption = {
      label: item.name,
      key: item.id,
    };
    if (children.length) {
      opt.children = children;
    }
    return opt;
  });
}

/** 父途径枚举 */
const parentOptions = computed(() => {
  return transferKey(props.channels);
});

/** 父途径是否显示 */
const parentItemShow = computed(() => {
  if (props.type === 'edit' && props.editData?.parentId === 0) {
    return false;
  }
  return true;
});

/** 父途径是否可编辑 */
const parentItemDisabled = computed(() => {
  if (props.type === 'edit' && props.editData?.parentId !== 0) {
    return true;
  }
  return false;
});

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emit,
  afterOpenModal,
  afterCloseModal,
);

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '新增途径',
    edit: '编辑途径',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: undefined,
    name: '',
    parentId: undefined,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入途径名称', trigger: 'blur' }],
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
  const api = props.type === 'add' ? mhxyChannelAdd : mhxyChannelEdit;
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
