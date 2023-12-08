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
import type { FormInst, FormItemRule, SelectOption } from 'naive-ui';
import { computed, ref, reactive } from 'vue';
import { menuAdd, menuEdit, menuListTop } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import type { Ref } from 'vue';
import { PARENT_FLAG } from '../constants';
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';

defineOptions({
  name: 'MenuModal',
});

type FormModel = BusinessManagement.MenuFormModal;

export interface Props {
  type?: Modal.Type;
  editData?: FormModel | null;
  parentId: number;
}

interface Emits {
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props & ModalProps>(), {
  visible: false,
  type: 'add',
  editData: null,
  parentId: PARENT_FLAG,
});

const emits = defineEmits<Emits & ModalEmits>();

const { modalVisible, submitLoading, showLoading, closeLoading, closeModal } = useModal(
  props,
  emits,
  afterOpenModal,
  afterCloseModal,
);

const title = computed(() => {
  const titleMap: Record<Modal.Type, string> = {
    add: '添加菜单',
    edit: '编辑菜单',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

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

/** 更新表单数据 */
function handleUpdateFormModel(model: FormModel) {
  Object.assign(formModel, model);
}

/** 提交表单 */
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

/** 执行成功后，通知上层组件 */
function emitSucess() {
  emits('on-success');
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

/**
 * modal 打开后处理
 */
function afterOpenModal() {
  handleUpdateFormModelByFormType();
  getMenuTop();
}

/**
 * modal 关闭后处理
 */
function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
