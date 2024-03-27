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
      :label-width="100"
      require-mark-placement="left"
      :rules="formRules"
    >
      <div>
        <NH5 prefix="bar">
          <NText type="primary">基本信息</NText>
        </NH5>
        <NGrid x-gap="12" :cols="2">
          <NGi>
            <NFormItem path="id" label="账号 Id">
              <NInput
                v-model:value="formModel.id"
                placeholder="请输入账号 Id"
                :disabled="type === 'edit'"
              ></NInput>
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem path="name" label="名称">
              <NInput v-model:value="formModel.name" placeholder="请输入名称"></NInput>
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem path="role" label="角色">
              <n-select
                v-model:value="formModel.role"
                :options="roleOpts"
                :render-label="renderRoleLabel"
                filterable
                placeholder="请选择角色"
              />
            </NFormItem>
          </NGi>
          <NGi>
            <NFormItem path="sect" label="门派">
              <n-select
                v-model:value="formModel.sect"
                :options="sectOpts"
                :render-label="renderSectLabel"
                filterable
                placeholder="请选择门派"
              />
            </NFormItem>
          </NGi>
          <NGi v-if="type === 'add'">
            <NFormItem path="gold" label="金币数">
              <NInputNumber
                v-model:value="formModel.gold"
                :step="1"
                :min="0"
                :precision="0"
                :show-button="false"
                class="w-full"
              /> </NFormItem
          ></NGi>
          <NGi v-if="type === 'add'">
            <NFormItem path="gold" label="被锁金币数">
              <NInputNumber
                v-model:value="formModel.lockGold"
                :step="1"
                :min="0"
                :precision="0"
                :show-button="false"
                class="w-full"
              /> </NFormItem
          ></NGi>
          <NGi>
            <NFormItem path="isPrimary" label="是否为主号">
              <NSwitch v-model:value="formModel.isPrimary" />
            </NFormItem>
          </NGi>
        </NGrid>
        <NH5 prefix="bar">
          <NText type="primary">分组信息</NText>
        </NH5>
        <NGrid x-gap="12" :cols="2">
          <NGi>
            <NFormItem path="groupId" label="分组">
              <NSelect
                v-model:value="formModel.groupId"
                filterable
                placeholder="请选择分组"
                :options="accountGroupData"
                :loading="loading"
                clearable
                label-field="name"
                value-field="id"
              ></NSelect>
            </NFormItem>
          </NGi>
          <NGi v-if="formModel.groupId" :span="2">
            <NFormItem path="groupRemark" label="备注">
              <NInput v-model:value="formModel.groupRemark" type="textarea"></NInput>
            </NFormItem>
          </NGi>
        </NGrid>
      </div>
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
import { useModal, type ModalEmits, type ModalProps, useAccountGroupList } from '@/hooks';
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
    groupId: undefined,
    groupRemark: '',
  };
}

const { loading, getAccountGroupData, accountGroupData } = useAccountGroupList();

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
  getAccountGroupData();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
  handleUpdateFormModel(createFormModel());
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
