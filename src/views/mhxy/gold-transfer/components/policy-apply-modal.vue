<template>
  <NModal
    v-model:show="modalVisible"
    :title="'应用策略'"
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
      <NFormItem label="策略名称">
        <NPopover v-if="policy" trigger="hover">
          <template #trigger>
            <NText strong>{{ policy.name }}</NText>
          </template>
          <div>
            <NGrid x-gap="12" :cols="2">
              <NGi :span="2">
                <NText strong>物品种类：</NText>
                <NText>{{ policy.propCategory.name }}</NText>
              </NGi>
              <NGi>
                <NText strong>额度：</NText>
                <NText>{{ policy.quota }}</NText>
              </NGi>
              <NGi>
                <NText strong>转金周期（天）：</NText>
                <NText>{{ policy.cycleByDay }}</NText>
              </NGi>
            </NGrid>
          </div>
        </NPopover>
      </NFormItem>
      <NFormItem label="应用账号">
        <NSelect
          v-model:value="formModel.accountId"
          :options="accountList"
          label-field="name"
          value-field="id"
          filterable
          clearable
          :render-label="renderAccountLabel"
        />
      </NFormItem>
      <NFormItem label="执行时间" path="nextApplyTime">
        <NDatePicker v-model:value="formModel.nextApplyTime" type="date" class="w-full" />
      </NFormItem>
      <NFormItem label="状态" path="status">
        <n-switch
          v-model:value="formModel.status"
          :checked-value="ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN"
          :unchecked-value="ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.CLOSE"
        />
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
import { useModal, type ModalEmits, type ModalProps, useAccountGroupList } from '@/hooks';
import { type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, computed } from 'vue';
import { mhxyGoldTransferPolicyApplyAdd, mhxyGoldTransferPolicyApplyEdit } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { renderAccountLabel, transformMsToDateStr } from '@/utils';
import { ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS } from '@/constants';

defineOptions({
  name: 'GoldTransferPolicyApplyModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.GoldTransferPolicyApplyFormModel;

interface Props {
  type: Modal.Type;
  editData?: FormModel | null;
  policy: ApiMhxy.GoldTransferPolicy | null;
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

const { transferGroupSelect, getAccountGroupData } = useAccountGroupList(true);

const accountList = computed(() => {
  return transferGroupSelect([]);
});

const formRef = ref<HTMLElement & FormInst>();

function createFormModel(): FormModel {
  return {
    id: undefined,
    nextApplyTime: new Date().getTime(),
    accountId: undefined,
    policyId: undefined,
    status: ENUM_MHXY_GOLD_TRANSFER_POLICY_APPLY_STATUS.OPEN,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请选择策略名称', trigger: 'blur' }],
  propCategoryId: [{ required: true, message: '请选择种类', type: 'number', trigger: 'change' }],
};

function handleUpdateFormModelByFormType() {
  const handlers: Record<Modal.Type, () => void> = {
    add: () => {
      const defaultFormModal = createFormModel();
      handleUpdateFormModel({ ...defaultFormModal, policyId: props.policy?.id });
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel({ ...props.editData, policyId: props.policy?.id });
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
  const api =
    props.type === 'add' ? mhxyGoldTransferPolicyApplyAdd : mhxyGoldTransferPolicyApplyEdit;
  const { error } = await api({
    ...formModel,
    nextApplyTime: transformMsToDateStr(formModel.nextApplyTime as number),
  });
  if (!error) {
    window.$message?.success(`应用成功`, { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
    emitSucess();
  }

  closeLoading();
}

function emitSucess() {
  emit('on-success');
}

function afterOpenModal() {
  getAccountGroupData();
  handleUpdateFormModelByFormType();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
