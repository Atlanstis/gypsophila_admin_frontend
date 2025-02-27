<template>
  <NModal
    v-model:show="modalVisible"
    :title="title"
    preset="card"
    :segmented="true"
    class="w-800px"
  >
    <NForm
      ref="formRef"
      :model="formModel"
      label-placement="left"
      label-width="80"
      require-mark-placement="left"
      :rules="formRules"
      class="m-x-40px"
    >
      <NFormItem v-if="props.parentId" label="上级菜单" path="parentId">
        <NSelect v-model:value="formModel.parentId" disabled :options="menuTopOpts" clearable />
      </NFormItem>
      <NGrid :cols="2" :x-gap="24">
        <NGridItem>
          <NFormItem label="菜单名称" path="name">
            <NInput v-model:value="formModel.name" placeholder="请输入菜单名称" clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="菜单标识" path="key">
            <NInput v-model:value="formModel.key" placeholder="请输入菜单标识" clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="类型" path="type">
            <NRadioGroup v-model:value="formModel.type" :disabled="props.type === 'edit'">
              <NRadio
                v-for="type in MenuTypeOpts"
                :key="type.value"
                :value="type.value"
                :label="type.label"
              />
            </NRadioGroup>
          </NFormItem>
        </NGridItem>
        <NGridItem v-if="formModel.type === MenuTypeEnum.menu">
          <NFormItem label="布局组件" path="layout">
            <NSelect
              v-model:value="formModel.layout"
              :options="Const_LayoutOpts"
              placeholder="请选择布局组件"
              clearable
            />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="路径" path="path" :first="true">
            <NInput v-model:value="formModel.path" placeholder="请输入路径" />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="排序" path="order">
            <NInputNumber
              v-model:value="formModel.order"
              :min="0"
              :max="99"
              :precision="0"
              class="w-full"
            />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem label="本地图标" path="iconLocal">
            <NSelect
              v-model:value="formModel.iconLocal"
              placeholder="请选择本地图标"
              :options="Const_IconOpts"
              :render-label="renderIconLocalLabel"
              clearable
            />
          </NFormItem>
        </NGridItem>
        <NGridItem>
          <NFormItem path="icon">
            <template #label>
              <NSpace align="center" :size="2">
                <div>图标</div>
                <div @click="onClickIconify" class="cursor-pointer hover:color-primary">
                  <component
                    :is="iconRender({ icon: ButtonIconEnum.link, fontSize: 18 })"
                  ></component>
                </div>
              </NSpace>
            </template>
            <NInput v-model:value="formModel.icon" placeholder="请输入 iconify 图标名称" clearable>
              <template #suffix>
                <div class="w-18px h-18px flex-center">
                  <component
                    v-if="formModel.icon"
                    :key="formModel.icon"
                    :is="iconRender({ icon: formModel.icon })"
                  />
                </div>
              </template>
            </NInput>
          </NFormItem>
        </NGridItem>
        <template v-if="formModel.type === MenuTypeEnum.page">
          <NGridItem>
            <NFormItem label="路由缓存" path="keepAlive">
              <NRadioGroup v-model:value="formModel.keepAlive">
                <NRadio :value="true">是</NRadio>
                <NRadio :value="false">否</NRadio>
              </NRadioGroup>
            </NFormItem>
          </NGridItem>
          <NGridItem>
            <NFormItem label="隐藏页面" path="hideInMenu">
              <NRadioGroup v-model:value="formModel.hideInMenu">
                <NRadio :value="true">是</NRadio>
                <NRadio :value="false">否</NRadio>
              </NRadioGroup>
            </NFormItem>
          </NGridItem>
          <NGridItem v-if="formModel.hideInMenu">
            <NFormItem label="选中激活菜单" path="activeMenu">
              <NInput
                v-model:value="formModel.activeMenu"
                placeholder="请输入选中时激活菜单"
                clearable
              />
            </NFormItem>
          </NGridItem>
        </template>
      </NGrid>
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
import { NSpace, type FormInst, type FormItemRule, type SelectOption } from 'naive-ui';
import { computed, ref, reactive, h, watch } from 'vue';
import { menuAdd, menuEdit, menuListTop } from '@/service';
import type { Ref } from 'vue';
import { useModal, type ModalProps, type ModalEmits } from '@/hooks';
import { MenuTypeEnum, MenuTypeOpts } from '../constants';
import type { MenuModel } from '../typing';
import { Const_IconOpts, Const_LayoutOpts } from '@/constants';
import { useIconRender, useRouterPush } from '@/composables';
import { ButtonIconEnum } from '@/enums';

defineOptions({
  name: 'MenuModal',
});

export interface Props {
  type?: Modal.Type;
  editData?: MenuModel | null;
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

const { iconRender } = useIconRender();
const { toOutsideUrl } = useRouterPush();

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

function createFormModel(): MenuModel {
  return {
    id: null,
    key: '',
    name: '',
    path: '',
    layout: undefined,
    icon: undefined,
    iconLocal: undefined,
    keepAlive: false,
    hideInMenu: false,
    activeMenu: undefined,
    type: MenuTypeEnum.page,
    parentId: props.parentId || null,
    order: 0,
  };
}

/** 本地图标 Render 函数 */
function renderIconLocalLabel(option: SelectOption) {
  const icon = iconRender({
    iconLocal: option.value as string,
    fontSize: 18,
  })();
  return h(NSpace, {}, { default: () => [icon, option.label] });
}

function onClickIconify() {
  toOutsideUrl('https://icon-sets.iconify.design');
}

const formModel = reactive<MenuModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'input' }],
  key: [{ required: true, message: '请输入菜单标识', trigger: 'input' }],
  path: [
    { required: true, message: '请输入路径', trigger: 'input' },
    {
      validator: (rule, value) => {
        const trimmedValue = value.trim();
        if (!trimmedValue.startsWith('/')) {
          return new Error("路径必须以 '/' 开头");
        }
        if (trimmedValue === '/') {
          return new Error('路径不能仅为 "/"');
        }
        return true;
      },
      trigger: 'input',
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

/** 更新表单数据 */
function handleUpdateFormModel(model: MenuModel) {
  Object.assign(formModel, model);
}

/** 监听类型变化 */
watch(
  () => formModel.type,
  (newType) => {
    if (newType === MenuTypeEnum.menu) {
      formModel.keepAlive = false;
      formModel.hideInMenu = false;
      formModel.activeMenu = undefined;
    } else if (newType === MenuTypeEnum.page) {
      formModel.layout = undefined;
    }
  },
);

/** 监听隐藏页面变化 */
watch(
  () => formModel.hideInMenu,
  (newHideInMenu) => {
    if (!newHideInMenu) {
      formModel.activeMenu = undefined;
    }
  },
);

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
