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
      <NFormItem label="道具种类" path="propCategoryId">
        <NTreeSelect
          v-model:value="formModel.propCategoryId"
          filterable
          cascade
          checkable
          :options="propCategoryTree"
        ></NTreeSelect>
      </NFormItem>
      <NFormItem label="转出账号" path="fromAccountId">
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
        v-if="formModel.propCategoryId && !isCategoryGem"
        label="转出账号转金后金币数"
        path="fromNowGold"
      >
        <NInputNumber
          v-model:value="formModel.fromNowGold"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="转入账号" path="toAccountId">
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
        v-if="formModel.propCategoryId && !isCategoryGem"
        label="转入账号转金后金币数"
        path="toNowGold"
      >
        <NInputNumber
          v-model:value="formModel.toNowGold"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem
        v-if="formModel.propCategoryId && isCategoryGem"
        label="交易金额"
        path="goldAmount"
      >
        <NInputNumber
          v-model:value="formModel.goldAmount"
          class="w-full"
          :precision="0"
          :show-button="false"
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
import {
  useModal,
  type ModalEmits,
  type ModalProps,
  usePropCategoryList,
  useAccountGroupList,
} from '@/hooks';
import { type FormInst, type FormItemRule } from 'naive-ui';
import { ref, reactive, computed } from 'vue';
import { mhxyAccountGoldTransferAdd } from '@/service';
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
    propCategoryId: undefined,
    fromNowGold: undefined,
    toNowGold: undefined,
    goldAmount: undefined,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  fromNowGold: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  toNowGold: [{ required: true, message: '请输入金币数', type: 'number', trigger: 'blur' }],
  goldAmount: [{ required: true, message: '请输入交易金额', type: 'number', trigger: 'blur' }],
  fromAccountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
  toAccountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
  propCategoryId: [{ required: true, message: '请选择种类', type: 'number', trigger: 'change' }],
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

const { propCategoryTree, propCategoryFlat, getPropCatrgory } = usePropCategoryList();
const { transferGroupSelect, getAccountGroupData } = useAccountGroupList(true);

const fromAccountList = computed(() => {
  return transferGroupSelect(formModel.toAccountId ? [formModel.toAccountId] : []);
});

const toAccountList = computed(() => {
  return transferGroupSelect(formModel.fromAccountId ? [formModel.fromAccountId] : []);
});

const isCategoryGem = computed(() => {
  const selectCategory = propCategoryFlat.value.find(
    (category) => category.id === formModel.propCategoryId,
  );
  return selectCategory ? selectCategory.isGem : false;
});

function afterOpenModal() {
  getAccountGroupData();
  getPropCatrgory();
  handleUpdateFormModel();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
