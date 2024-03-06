<template>
  <NModal
    v-model:show="modalVisible"
    :title="'转金'"
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
          :options="accountList"
          label-field="name"
          value-field="id"
          filterable
          :render-label="renderAccountLabel"
        />
      </NFormItem>
      <NFormItem label="种类" path="categoryId">
        <NSelect
          v-model:value="formModel.categoryId"
          :options="goldTradeCategoryList"
          label-field="name"
          value-field="id"
          filterable
        />
      </NFormItem>
      <NFormItem label="当前金币数" path="nowGold">
        <NInputNumber
          v-model:value="formModel.nowGold"
          class="w-full"
          :precision="0"
          :show-button="false"
        ></NInputNumber>
      </NFormItem>
      <NFormItem label="备注" path="remark">
        <NInput v-model:value="formModel.remark" type="textarea"></NInput>
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
import { ref, reactive } from 'vue';
import { mhxyAccountAll, mhxyGoldTradeCategoryAll, mhxyAccountGoldRecordAdd } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { renderAccountLabel } from '@/utils';

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
    nowGold: undefined,
    remark: '',
    accountId: undefined,
    categoryId: undefined,
  };
}

const formModel = reactive<FormModel>(createFormModel());

const formRules: Record<string, FormItemRule | FormItemRule[]> = {
  nowGold: [{ required: true, message: '请输入当前金币数', type: 'number', trigger: 'blur' }],
  accountId: [{ required: true, message: '请选择账号', trigger: 'change' }],
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

/** 获取贸易种类数据 */
async function getGoldTradeCatrgory() {
  if (goldTradeCategoryList.value.length > 0) return;
  const { error, data } = await mhxyGoldTradeCategoryAll();
  if (!error) {
    goldTradeCategoryList.value = data;
  }
}

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
