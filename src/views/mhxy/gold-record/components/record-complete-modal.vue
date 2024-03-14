<template>
  <NModal
    v-model:show="modalVisible"
    :title="'记录处理'"
    preset="card"
    :segmented="true"
    class="w-500px"
  >
    <NForm
      ref="formRef"
      :model="formModel"
      label-placement="left"
      :label-width="110"
      require-mark-placement="left"
      :rules="formRules"
    >
      <NFormItem label="账号">
        <AccountComp />
      </NFormItem>
      <NFormItem label="途径">
        {{ recordInfo?.channel.name }}
      </NFormItem>
      <NFormItem label="涉及金额">
        <GoldTrendComp />
      </NFormItem>
      <NFormItem label="实际金额" path="realAmount">
        <NInputNumber
          v-model:value="formModel.realAmount"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="操作" path="status">
        <NSelect
          v-model:value="formModel.status"
          :options="MHXY_GOLD_RECORD_COMPLETE_STATUS_OPT"
        ></NSelect>
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
import { NSpace, type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, defineComponent } from 'vue';
import { mhxyAccountGoldRecordComplete, mhxyAccountGoldRecordInfo } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import {
  MHXY_GOLD_RECORD_COMPLETE_STATUS_OPT,
  MHXY_GOLD_RECORD_COMPLETE_STATUS,
} from '@/constants';
import { renderMhxyAccount, renderGoldTrend } from '@/utils';

defineOptions({
  name: 'RecordCompleteModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type Props = {
  id?: ApiMhxy.AccountGoldRecord['id'];
};

type FormModel = Omit<BusinessMhxy.GoldRecordCompleteFormModal, 'id'>;

const props = withDefaults(defineProps<ModalProps & Props>(), {
  visible: false,
  id: undefined,
});

const emit = defineEmits<Emits & ModalEmits>();

const { modalVisible, closeModal, submitLoading, showLoading, closeLoading } = useModal(
  props,
  emit,
  afterOpenModal,
  afterCloseModal,
);

const formRef = ref<HTMLElement & FormInst>();

const GoldTrendComp = defineComponent({
  name: 'GoldTrendComp',
  render() {
    return recordInfo.value
      ? renderGoldTrend(recordInfo.value.amount, recordInfo.value.type)
      : null;
  },
});

const AccountComp = defineComponent({
  name: 'GoldTrendComp',
  render() {
    return recordInfo.value ? renderMhxyAccount(recordInfo.value.account) : null;
  },
});

function createFormModel(): FormModel {
  return {
    realAmount: undefined,
    status: MHXY_GOLD_RECORD_COMPLETE_STATUS.COMPLETE,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  realAmount: [{ required: true, message: '请输入实际金额', type: 'number', trigger: 'blur' }],
};

/** 更新表单数据 */
function handleUpdateFormModel(modal: Partial<FormModel>) {
  Object.assign(formModel, modal);
}

async function formSubmit() {
  if (!props.id) return;
  await formRef.value?.validate();
  showLoading();
  const { error } = await mhxyAccountGoldRecordComplete({ ...formModel, id: props.id });
  if (!error) {
    window.$message?.success(`处理成功`, { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
    emitSucess();
  }
  closeLoading();
}

function emitSucess() {
  emit('on-success');
}

const recordInfo = ref<BusinessMhxy.GoldRecordCompleteInfo>();

/** 获取收支信息 */
async function getRecordInfo() {
  if (!props.id) return;
  const { error, data } = await mhxyAccountGoldRecordInfo(props.id);
  if (!error) {
    recordInfo.value = data;
    handleUpdateFormModel({ realAmount: recordInfo.value?.realAmount });
  } else {
    closeModal();
  }
}

function afterOpenModal() {
  getRecordInfo();
  handleUpdateFormModel(createFormModel());
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
