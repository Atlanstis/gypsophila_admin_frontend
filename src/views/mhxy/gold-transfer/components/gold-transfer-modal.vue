<template>
  <NModal
    v-model:show="modalVisible"
    :title="'新增记录'"
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
      <NFormItem label="种类" path="categoryId">
        <NSelect
          v-model:value="formModel.categoryId"
          :options="goldTradeCategoryList"
          label-field="name"
          value-field="id"
          filterable
        />
      </NFormItem>
      <NFormItem label="发起账号" path="fromAccountId">
        <NSelect
          v-model:value="formModel.fromAccountId"
          :options="fromAccountList"
          label-field="name"
          value-field="id"
          filterable
          clearable
          :render-label="renderAccountLabel"
        />
      </NFormItem>
      <NFormItem
        v-if="formModel.categoryId && !isCategoryGem"
        label="发起账号转金后金币数"
        path="fromNowGold"
      >
        <NInputNumber
          v-model:value="formModel.fromNowGold"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="接受账号" path="toAccountId">
        <NSelect
          v-model:value="formModel.toAccountId"
          :options="toAccountList"
          label-field="name"
          value-field="id"
          filterable
          clearable
          :render-label="renderAccountLabel"
        />
      </NFormItem>
      <NFormItem
        v-if="formModel.categoryId && !isCategoryGem"
        label="接受账号转金后金币数"
        path="toNowGold"
      >
        <NInputNumber
          v-model:value="formModel.toNowGold"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem v-if="formModel.categoryId && isCategoryGem" label="交易金额" path="goldAmount">
        <NInputNumber
          v-model:value="formModel.goldAmount"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem
        v-if="formModel.categoryId && isCategoryGem"
        label="审核所需时间（小时）"
        path="auditEndHours"
      >
        <NInputNumber
          v-model:value="formModel.auditEndHours"
          class="w-full"
          :precision="0"
          :min="0"
        ></NInputNumber>
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
import { type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, computed } from 'vue';
import { mhxyAccountAll, mhxyGoldTradeCategoryList, mhxyAccountGoldTransferAdd } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { renderAccountLabel } from '@/utils';

defineOptions({
  name: 'MhxyAccountGoldTransferModal',
});

interface Emits {
  (e: 'on-success'): void;
}

type FormModel = BusinessMhxy.GoldTransferFormModal;

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
    toAccountId: undefined,
    fromAccountId: undefined,
    categoryId: undefined,
    fromNowGold: undefined,
    toNowGold: undefined,
    goldAmount: undefined,
    auditEndHours: 20,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  fromNowGold: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  toNowGold: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  goldAmount: [{ required: true, message: '请输入珍品交易金额', type: 'number', trigger: 'blur' }],
  auditEndHours: [
    { required: true, message: '请输入审核所需时间', type: 'number', trigger: 'blur' },
  ],
  fromAccountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
  toAccountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择种类', type: 'number', trigger: 'change' }],
};

/** 更新表单数据 */
function handleUpdateFormModel() {
  const defaultFormModal = createFormModel();
  Object.assign(formModel, defaultFormModal);
}

async function formSubmit() {
  await formRef.value?.validate();
  showLoading();
  const { error } = await mhxyAccountGoldTransferAdd({ ...formModel });
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

const accountList = ref<ApiMhxy.Account[]>([]);
const goldTradeCategoryList = ref<ApiMhxy.GoldTradeCategory[]>([]);

/** 获取用户所有梦幻账号 */
async function getAccountAll() {
  if (accountList.value.length > 0) return;
  const { error, data } = await mhxyAccountAll();
  if (!error) {
    accountList.value = data;
  }
}

const fromAccountList = computed(() => {
  return accountList.value.filter((account) => account.id !== formModel.toAccountId);
});

const toAccountList = computed(() => {
  return accountList.value.filter((account) => account.id !== formModel.fromAccountId);
});

/** 获取贸易种类数据 */
async function getGoldTradeCatrgory() {
  if (goldTradeCategoryList.value.length > 0) return;
  const { error, data } = await mhxyGoldTradeCategoryList(true);
  if (!error) {
    goldTradeCategoryList.value = data;
  }
}

const isCategoryGem = computed(() => {
  const selectCategory = goldTradeCategoryList.value.find(
    (category) => category.id === formModel.categoryId,
  );
  return selectCategory ? selectCategory.isGem : false;
});

function afterOpenModal() {
  getAccountAll();
  getGoldTradeCatrgory();
  handleUpdateFormModel();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
