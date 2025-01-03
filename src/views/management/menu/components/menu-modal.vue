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
      <NFormItem v-if="props.parentId" label="上级菜单" path="parentId">
        <NSelect v-model:value="formModel.parentId" disabled :options="menuTopOpts" />
      </NFormItem>
      <NFormItem label="菜单名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入菜单名称" />
      </NFormItem>
      <NFormItem label="菜单标识" path="key">
        <NInput v-model:value="formModel.key" placeholder="请输入菜单标识" />
      </NFormItem>
      <NFormItem label="类型" path="type">
        <NRadioGroup
          v-model:value="formModel.type"
          :disabled="props.type === 'edit' || !!props.parentId"
        >
          <NRadio
            v-for="type in MenuTypeOpts"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          />
        </NRadioGroup>
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
import type { Ref } from 'vue';
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { MenuTypeEnum, MenuTypeOpts } from '../constants';
import type { MenuModel } from '../typing';

defineOptions({
  name: 'MenuModal',
});

type FormModel = MenuModel;

export interface Props {
  type?: Modal.Type;
  editData?: FormModel | null;
  parentId: number | null;
}

interface Emits {
  (e: 'on-success'): void;
}

const props = withDefaults(defineProps<Props & ModalProps>(), {
  visible: false,
  type: 'add',
  editData: null,
  parentId: null,
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
    id: null,
    key: '',
    name: '',
    type: MenuTypeEnum.page,
    parentId: props.parentId || null,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
  key: [{ required: true, message: '请输入菜单标识', trigger: 'change' }],
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
  const { error, msg } = await api({ ...formModel });
  if (!error) {
    window.$message?.success(msg);
    closeModal();
    emitSucess();
  }
  closeLoading();
}

function emitSucess() {
  emits('on-success');
}

const menuTopOpts: Ref<SelectOption[]> = ref([]);

/** 获取顶级菜单 */
async function getMenuTop() {
  if (!props.parentId) return;
  const { data, error } = await menuListTop();
  if (!error) {
    menuTopOpts.value = data.map((menu) => ({
      label: menu.name,
      value: menu.id,
    }));
  }
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
