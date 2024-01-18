<template>
  <div class="m-t-20px">
    <NForm
      ref="formRef"
      :model="formModel"
      label-placement="left"
      label-width="120"
      require-mark-placement="left"
      :rules="formRules"
      :disabled="loading"
    >
      <NFormItem label="网站名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入网站名称" class="!w-240px" />
      </NFormItem>
      <NFormItem label="备案号" path="recordNumber">
        <NInput
          v-model:value="formModel.recordNumber"
          placeholder="请输入备案号"
          class="!w-240px"
        />
      </NFormItem>
      <NFormItem label="是否展示备案号">
        <NCheckbox v-model:checked="formModel.showRecordNumber"></NCheckbox>
      </NFormItem>
      <NFormItem label=" ">
        <NButton type="primary" :loading="loading" @click="onClickSave">保存</NButton>
      </NFormItem>
    </NForm>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores';
import type { FormInst, FormItemRule } from 'naive-ui';
import { ref, watchEffect } from 'vue';
import { useBoolean } from '@/hooks';
import { updateWebsiteInfo } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'WebsiteSetting',
});
type FormModelKey = Exclude<keyof ApiSetting.Website, 'showRecordNumber'>;

const appStore = useAppStore();

const formModel = ref<ApiSetting.Website>({
  name: '',
  recordNumber: '',
  showRecordNumber: false,
});

watchEffect(() => {
  const { name, recordNumber, showRecordNumber } = appStore.websiteInfo;
  formModel.value = {
    name: name || '',
    recordNumber: recordNumber || '',
    showRecordNumber: showRecordNumber || false,
  };
});

const formRules: Record<FormModelKey, FormItemRule | FormItemRule[]> = {
  name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  recordNumber: [{ required: true, message: '请输入备案号', trigger: 'blur' }],
};

const formRef = ref<FormInst | null>(null);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

async function onClickSave() {
  await formRef.value?.validate();
  startLoading();
  const { error } = await updateWebsiteInfo({ ...formModel.value });
  if (!error) {
    window.$message?.success('更新成功', { duration: DEFAULT_MESSAGE_DURATION });
    appStore.getWebsiteInfo();
  }
  endLoading();
}
</script>

<style lang="scss" scoped></style>
