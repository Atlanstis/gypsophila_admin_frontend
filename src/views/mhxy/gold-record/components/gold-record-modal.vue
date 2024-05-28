<template>
  <NModal
    v-model:show="modalVisible"
    :title="'新增金币记录'"
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
      <NFormItem label="账号" path="accountId">
        <NSelect
          v-model:value="formModel.accountId"
          :options="accountOpts"
          label-field="name"
          value-field="id"
          filterable
          :render-label="renderAccountLabel"
        />
      </NFormItem>
      <NFormItem label="途径" path="channelId">
        <NTreeSelect
          v-model:value="formModel.channelId"
          filterable
          cascade
          checkable
          :options="channelTree"
        ></NTreeSelect>
      </NFormItem>
      <NFormItem
        v-if="activeChannel?.key === MHXY_CHANNEL_DEFAULT_KEY.TRADE"
        label="道具种类"
        path="type"
      >
        <NTreeSelect
          v-model:value="formModel.propCategoryId"
          filterable
          cascade
          checkable
          :options="propCategoryTree"
        ></NTreeSelect>
      </NFormItem>
      <NFormItem label="计算方式" path="amountType">
        <NRadioGroup
          v-model:value="formModel.amountType"
          name="amountType"
          :disabled="amountTypeDisabled"
        >
          <NRadio
            v-for="opt of MHXY_GOLD_RECORD_AMOUNT_TYPE_OPT"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem
        v-if="formModel.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT"
        label="当前金币数"
        path="nowAmount"
      >
        <NInputNumber
          v-model:value="formModel.nowAmount"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem v-if="showLockAmount" label="当前被锁金币数" path="nowLockAmount">
        <NInputNumber
          v-model:value="formModel.nowLockAmount"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <template v-if="formModel.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT">
        <NFormItem label="涉及金额" path="amount">
          <NInputNumber
            v-model:value="formModel.amount"
            class="w-full"
            :precision="0"
            :show-button="false"
            :on-update:value="onCalcRealAmount"
          ></NInputNumber>
        </NFormItem>
        <NFormItem label="收支类型" path="type">
          <NRadioGroup v-model:value="formModel.type" name="type" :disabled="fieldDisabled">
            <NRadio v-for="opt of MHXY_GOLD_RECORD_TYPE_OPT" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </NRadio>
          </NRadioGroup>
        </NFormItem>
      </template>
      <NFormItem label="状态" path="status">
        <NRadioGroup v-model:value="formModel.status" name="status" :disabled="fieldDisabled">
          <NRadio v-for="opt of MHXY_GOLD_RECORD_STATUS_OPT" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem label="备注" path="remark">
        <NInput v-model:value="formModel.remark" type="textarea"></NInput>
      </NFormItem>
      <NFormItem label="预估金币变化" v-if="formModel.accountId">
        <MhxyAccountGoldChange :from-gold="activeAccountGold" :to-gold="estimatedGold" />
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
import {
  useModal,
  type ModalEmits,
  type ModalProps,
  usePropCategoryList,
  useChannelList,
  useAccountGroupList,
} from '@/hooks';
import { type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, computed, watchEffect } from 'vue';
import { mhxyAccountGoldRecordAdd, mhxyAmountCalc } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { renderAccountLabel } from '@/utils';
import {
  MHXY_CHANNEL_DEFAULT_KEY,
  MHXY_GOLD_RECORD_AMOUNT_TYPE,
  MHXY_GOLD_RECORD_AMOUNT_TYPE_OPT,
  MHXY_GOLD_RECORD_STATUS,
  MHXY_GOLD_RECORD_STATUS_OPT,
  MHXY_GOLD_RECORD_TYPE,
  MHXY_GOLD_RECORD_TYPE_OPT,
} from '@/constants';

defineOptions({
  name: 'MhxyAccountGoldRecordModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.GoldRecordFormModal;

const props = withDefaults(defineProps<ModalProps>(), {
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
    accountId: undefined,
    channelId: undefined,
    propCategoryId: undefined,
    type: MHXY_GOLD_RECORD_TYPE.REVENUE,
    amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT,
    amount: undefined,
    nowAmount: undefined,
    nowLockAmount: undefined,
    status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
    remark: '',
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  amount: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  nowAmount: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  nowLockAmount: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  accountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
  channelId: [{ required: true, message: '请选择途径', type: 'number', trigger: 'change' }],
};

// 选中的途径
const activeChannel = computed(() => {
  return channelFlat.value.find((item) => item.id === formModel.channelId) || null;
});

// 选择途径是交易的情况
const activeChannelIsTrade = computed(() => {
  return activeChannel.value ? activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.TRADE : false;
});

/** 更新表单数据 */
function handleUpdateFormModel(modal: Partial<FormModel>) {
  Object.assign(formModel, modal);
}

/** 计算税后的价格 */
const afterCalcVal = ref<number | undefined>(undefined);

/** 途径为交易的情况，计算收完税后的价格 */
async function onCalcRealAmount(amount: number | null) {
  formModel.amount = amount !== null ? amount : undefined;
  if (!activeChannelIsTrade.value) return;
  afterCalcVal.value = undefined;
  formModel.amount = amount !== null ? amount : undefined;
  if (formModel.amount !== undefined && formModel.type === MHXY_GOLD_RECORD_TYPE.REVENUE) {
    const { data, error } = await mhxyAmountCalc(formModel.amount);
    if (!error) {
      afterCalcVal.value = data;
    }
  }
}

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  const { error } = await mhxyAccountGoldRecordAdd({ ...formModel });
  if (!error) {
    window.$message?.success(`新增成功`, { duration: DEFAULT_MESSAGE_DURATION });
    closeModal();
    emitSucess();
  }
  closeLoading();
}

function emitSucess() {
  emit('on-success');
}

const { propCategoryTree, getPropCatrgory } = usePropCategoryList();
const { channelTree, channelFlat, getChannel } = useChannelList();
const { transferGroupSelect, getAccountGroupData, accountList } = useAccountGroupList(true);

const accountOpts = computed(() => transferGroupSelect());

/** 当前选中的账号的金币数 */
const activeAccountGold = computed(() => {
  if (!formModel.accountId) return undefined;
  const account = accountList.value.find((item) => item.id === formModel.accountId) || null;
  return account ? account.gold : undefined;
});

/** 账号预计金币 */
const estimatedGold = computed(() => {
  if (!formModel.accountId) return undefined;
  if (formModel.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT) {
    // 按账号现有金币数
    return formModel.nowAmount !== null ? formModel.nowAmount : undefined;
  } else if (formModel.amountType === MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT) {
    // 按涉及金额
    if (!formModel.amount || !activeAccountGold.value) return undefined;
    if (formModel.type === MHXY_GOLD_RECORD_TYPE.EXPENDITURE) {
      // 支出的情况
      return activeAccountGold.value - formModel.amount;
    }
    if (formModel.type === MHXY_GOLD_RECORD_TYPE.REVENUE) {
      // 收入
      if (activeChannelIsTrade.value) {
        // 途径是交易时，涉及金额需计算当前税率
        if (afterCalcVal.value === undefined) return undefined;
        return activeAccountGold.value + afterCalcVal.value;
      }
      // 途径不是交易时，直接计算涉及金额
      return activeAccountGold.value + formModel.amount;
    }
  }
  return undefined;
});

function afterOpenModal() {
  getChannel();
  getPropCatrgory();
  getAccountGroupData();
  handleUpdateFormModel(createFormModel());
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}

const fieldDisabled = computed(() => {
  const key = activeChannel.value?.key;
  if (!key) return false;
  return !![
    MHXY_CHANNEL_DEFAULT_KEY.GOLD_DEDUCT,
    MHXY_CHANNEL_DEFAULT_KEY.GOLD_LOCK,
    MHXY_CHANNEL_DEFAULT_KEY.GOLD_UNLOCK,
    MHXY_CHANNEL_DEFAULT_KEY.MANUAL_CALIBRATION,
  ].find((item) => item === key);
});

const amountTypeDisabled = computed(() => {
  const key = activeChannel.value?.key;
  if (!key) return false;
  return MHXY_CHANNEL_DEFAULT_KEY.MANUAL_CALIBRATION === key;
});

const showLockAmount = computed(() => {
  const key = activeChannel.value?.key;
  return MHXY_CHANNEL_DEFAULT_KEY.MANUAL_CALIBRATION === key;
});

watchEffect(() => {
  if (activeChannel.value) {
    handleUpdateFormModel({
      amount: null,
      nowAmount: null,
    });
    if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.TRADE) {
      // 途径是交易的情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT,
        status: MHXY_GOLD_RECORD_STATUS.IN_PROGRESS,
      });
    } else if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.ACTIVITY) {
      // 途径是活动的情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT,
      });
    } else if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.GOLD_LOCK) {
      // 金币被锁的情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT,
        type: MHXY_GOLD_RECORD_TYPE.EXPENDITURE,
        status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
      });
    } else if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.GOLD_UNLOCK) {
      // 金币解锁的情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT,
        type: MHXY_GOLD_RECORD_TYPE.REVENUE,
        status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
      });
    } else if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.GOLD_DEDUCT) {
      // 金币扣除的情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_AMOUNT,
        type: MHXY_GOLD_RECORD_TYPE.EXPENDITURE,
        status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
      });
    } else if (activeChannel.value.key === MHXY_CHANNEL_DEFAULT_KEY.MANUAL_CALIBRATION) {
      // 人工校正
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT,
        status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
      });
    } else {
      // 其他情况
      handleUpdateFormModel({
        amountType: MHXY_GOLD_RECORD_AMOUNT_TYPE.BY_ACCOUNT_NOW_AMOUNT,
        status: MHXY_GOLD_RECORD_STATUS.COMPLETE,
      });
    }
  }
});
</script>

<style lang="scss" scoped></style>
