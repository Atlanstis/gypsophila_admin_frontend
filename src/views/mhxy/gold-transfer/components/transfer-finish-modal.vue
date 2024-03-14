<template>
  <NModal
    v-model:show="modalVisible"
    :title="'转金处理'"
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
      <NFormItem label="转移关系">
        <component :is="TransferRelation" />
      </NFormItem>
      <NFormItem label="预计收支情况">
        <component :is="TransferAmount" />
      </NFormItem>
      <NFormItem label="实际金额" path="amount">
        <NInputNumber
          v-model:value="formModel.amount"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="状态">
        <NSelect
          v-model:value="formModel.status"
          :options="MHXY_GOLD_TRANSFER_STATUS_OPT"
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
import { ref, reactive, h, computed, watchEffect } from 'vue';
import { mhxyAccountGoldTransferFinish, mhxyAccountGoldTransferInfo } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { renderTransferAmount, renderTransferRelation } from '@/utils';
import { MHXY_GOLD_TRANSFER_STATUS_OPT, MHXY_GOLD_TRANSFER_STATUS } from '@/constants';

defineOptions({
  name: 'MhxyAccountGoldTransferFinishModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type Props = {
  id?: ApiMhxy.AccountGoldTransfer['id'];
};

type FormModel = Omit<BusinessMhxy.GoldTransferFinishFormModal, 'id'>;

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

function createFormModel(): FormModel {
  return {
    amount: undefined,
    status: 'success',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  amount: [{ required: true, message: '请输入实际到手金额', type: 'number', trigger: 'blur' }],
};

/** 更新表单数据 */
function handleUpdateFormModel(modal: Partial<FormModel>) {
  Object.assign(formModel, modal);
}

async function formSubmit() {
  if (!props.id) return;
  await formRef.value?.validate();
  showLoading();
  const { error } = await mhxyAccountGoldTransferFinish({ ...formModel, id: props.id });
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

const transferInfo = ref<ApiMhxy.AccountGoldTransferGem>();

/** 状态发生变化时，修改实际金额 */
watchEffect(() => {
  if (!transferInfo.value) return;
  if (formModel.status === MHXY_GOLD_TRANSFER_STATUS.FAIL_FROM_LOCK) {
    handleUpdateFormModel({ amount: transferInfo.value.expenditureAmount });
  } else if (formModel.status === MHXY_GOLD_TRANSFER_STATUS.SUCCESS) {
    handleUpdateFormModel({ amount: transferInfo.value.realAmount });
  }
});

/** 转移关系组件 */
const TransferRelation = computed(() => {
  if (!transferInfo.value) return null;
  const { fromAccount, toAccount } = transferInfo.value;
  return h(
    NSpace,
    { justify: 'center', align: 'center' },
    {
      default: () => renderTransferRelation(fromAccount, toAccount),
    },
  );
});

/** 预计收支情况组件 */
const TransferAmount = computed(() => {
  if (!transferInfo.value) return null;
  const { expenditureAmount } = transferInfo.value;
  return h(
    NSpace,
    { justify: 'center', align: 'center' },
    {
      default: () => renderTransferAmount(expenditureAmount, formModel.amount || 0),
    },
  );
});

/** 获取转金信息 */
async function getTransferInfo() {
  if (!props.id) return;
  const { error, data } = await mhxyAccountGoldTransferInfo(props.id);
  if (!error) {
    transferInfo.value = data;
    // 未处于进行状态，跳过
    if (data.status !== MHXY_GOLD_TRANSFER_STATUS.PROGRESS) {
      window.$message?.error(`该记录已处于完成状态，请选择其他记录`, {
        duration: DEFAULT_MESSAGE_DURATION,
      });
      closeModal();
      emitSucess();
      return;
    }
  }
}

function afterOpenModal() {
  getTransferInfo();
  handleUpdateFormModel(createFormModel());
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
