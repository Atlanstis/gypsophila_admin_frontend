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
import { useModal, type ModalEmits, type ModalProps } from '@/hooks';
import { type FormInst, type FormItemRule, type TreeSelectOption } from 'naive-ui';
import { ref, reactive, computed } from 'vue';
import { mhxyAccountAll, mhxyPropCategoryList, mhxyAccountGoldTransferAdd } from '@/service';
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

const accountList = ref<ApiMhxy.Account[]>([]);
const propCategoryTree = ref<TreeSelectOption[]>([]);
const propCategoryFlat = ref<Partial<ApiMhxy.PropCategory>[]>([]);

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

/** 转换父种类字段映射 */
function transferKey(list: ApiMhxy.PropCategory[]): TreeSelectOption[] {
  return list.map((item) => {
    const children = transferKey(item.children);
    const opt: TreeSelectOption = {
      label: item.name,
      key: item.id,
    };
    if (children.length) {
      opt.children = children;
    }
    return opt;
  });
}

/** 获取道具种类数据 */
async function getPropCatrgory() {
  if (propCategoryTree.value.length > 0) return;
  const { error, data } = await mhxyPropCategoryList();
  if (!error) {
    propCategoryTree.value = transferKey(data);
    flatTree(data, propCategoryFlat.value);
  }
}

function flatTree(list: ApiMhxy.PropCategory[], arr: Partial<ApiMhxy.PropCategory>[]) {
  return list.forEach((item) => {
    const children = item.children || [];
    if (children.length) {
      flatTree(children, arr);
    }
    const copy: Partial<ApiMhxy.PropCategory> = { ...item };
    delete copy.children;
    arr.push(copy);
  });
}

const isCategoryGem = computed(() => {
  const selectCategory = propCategoryFlat.value.find(
    (category) => category.id === formModel.propCategoryId,
  );
  return selectCategory ? selectCategory.isGem : false;
});

function afterOpenModal() {
  getAccountAll();
  getPropCatrgory();
  handleUpdateFormModel();
}

function afterCloseModal() {
  formRef.value?.restoreValidation();
}
</script>

<style lang="scss" scoped></style>
