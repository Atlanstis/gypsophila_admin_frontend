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
      :label-width="type === 'add' ? 100 : 80"
      require-mark-placement="left"
      :rules="formRules"
    >
      <NFormItem v-if="type === 'add'" path="id" label="账号 Id" first>
        <NInput v-model:value="formModel.id" placeholder="请输入账号 Id"></NInput>
      </NFormItem>
      <NFormItem path="name" label="名称">
        <NInput v-model:value="formModel.name" placeholder="请输入名称"></NInput>
      </NFormItem>

      <NFormItem path="role" label="角色">
        <n-select
          v-model:value="formModel.role"
          :options="roleOpts"
          :render-label="renderRoleLabel"
          filterable
          placeholder="请选择角色"
        />
      </NFormItem>
      <NFormItem path="sect" label="门派">
        <n-select
          v-model:value="formModel.sect"
          :options="sectOpts"
          :render-label="renderSectLabel"
          filterable
          placeholder="请选择门派"
        />
      </NFormItem>
      <NFormItem v-if="type === 'add'" path="gold" label="金币数">
        <NInputNumber
          v-model:value="formModel.gold"
          :step="1"
          :min="0"
          :precision="0"
          :show-button="false"
          class="w-full"
        />
      </NFormItem>
      <NFormItem v-if="type === 'add'" path="gold" label="被锁金币数">
        <NInputNumber
          v-model:value="formModel.lockGold"
          :step="1"
          :min="0"
          :precision="0"
          :show-button="false"
          class="w-full"
        />
      </NFormItem>
      <NFormItem v-if="type === 'add'" path="isPrimary" label="是否为主号">
        <NSwitch v-model:value="formModel.isPrimary" />
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
import { NAvatar, type FormInst, type FormItemRule, type SelectRenderLabel } from 'naive-ui';
import { computed, ref, reactive, h } from 'vue';
import { mhxyAccountAdd, mhxyAccountEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { mhxyRoleImgMap, mhxySectImgMap } from '@/assets';

defineOptions({
  name: 'MhxyAccountModal',
});

interface Props {
  type: Modal.Type;
  editData?: Partial<BusinessMhxy.AccountFormModel> | null;
  accountRoles: ApiMhxy.AccountRole[];
  accountSects: ApiMhxy.AccountSect[];
}

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.AccountFormModel;

const roleOpts = computed(() => {
  const groupIndex: Record<ApiMhxy.AccountRole['type'], ApiMhxy.AccountRole[]> = {};
  props.accountRoles.forEach((item) => {
    if (groupIndex[item.type]) {
      groupIndex[item.type].push(item);
    } else {
      groupIndex[item.type] = [item];
    }
  });
  const groups = Object.keys(groupIndex).map((type) => ({
    type: 'group',
    label: type,
    key: type,
    children: groupIndex[type],
  }));
  return groups;
});

const sectOpts = computed(() => {
  return props.accountSects.map((sect) => ({ ...sect }));
});

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
    add: '新增账号',
    edit: '编辑账号',
  };
  return titleMap[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: '',
    name: '',
    isPrimary: false,
    role: undefined,
    sect: undefined,
    gold: 0,
    lockGold: 0,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  id: [{ required: true, message: '请输入账号 Id', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  sect: [{ required: true, message: '请选择门派', trigger: 'change' }],
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
  const api = props.type === 'add' ? mhxyAccountAdd : mhxyAccountEdit;
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

const createRenderLabel: (type: 'sect' | 'role') => SelectRenderLabel = (type) => {
  return (option) => {
    let opt: ApiMhxy.AccountSect | ApiMhxy.AccountRole = { ...option } as unknown as
      | ApiMhxy.AccountSect
      | ApiMhxy.AccountRole;
    let src: string = '';
    if (type === 'sect') {
      opt = opt as ApiMhxy.AccountSect;
      src = mhxySectImgMap[opt.value];
    }
    if (type === 'role') {
      opt = opt as ApiMhxy.AccountRole;
      src = mhxyRoleImgMap[opt.value];
    }
    return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
        },
      },
      [
        option.type !== 'group'
          ? h(NAvatar, {
              src,
              round: true,
              size: 'small',
            })
          : null,
        h(
          'div',
          {
            style: {
              marginLeft: '12px',
              padding: '4px 0',
            },
          },
          h('div', null, [opt.label]),
        ),
      ],
    );
  };
};

const renderRoleLabel = createRenderLabel('role');
const renderSectLabel = createRenderLabel('sect');
</script>

<style lang="scss" scoped></style>
