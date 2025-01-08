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
      <NFormItem label="网站名称" path="websiteName">
        <NInput
          v-model:value="formModel.websiteName"
          placeholder="请输入网站名称"
          class="!w-240px"
        />
      </NFormItem>
      <NFormItem label="网站备案号" path="websiteRecordNumber">
        <NInput
          v-model:value="formModel.websiteRecordNumber"
          placeholder="请输入网站备案号"
          class="!w-240px"
        />
      </NFormItem>
      <NFormItem label="是否展示备案号">
        <NCheckbox v-model:checked="formModel.webisteShowRecordNumber"></NCheckbox>
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
import { pick } from '@/utils';

defineOptions({
  name: 'WebsiteSetting',
});
type FormRuleKey = Extract<keyof ResSystem.WebsiteInfo, 'websiteName'>;

const appStore = useAppStore();

const formModel = ref<ResSystem.WebsiteInfo>({
  websiteName: '',
  websiteRecordNumber: '',
  webisteShowRecordNumber: false,
});

watchEffect(() => {
  const websiteInfo = appStore.websiteInfo;
  formModel.value = pick(websiteInfo, [
    'websiteName',
    'websiteRecordNumber',
    'webisteShowRecordNumber',
  ]);
});

const formRules: Record<FormRuleKey, FormItemRule | FormItemRule[]> = {
  websiteName: [{ required: true, message: '请输入网站名称', trigger: 'change' }],
};

const formRef = ref<FormInst | null>(null);

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

async function onClickSave() {
  await formRef.value?.validate();
  startLoading();
  const { error, msg } = await updateWebsiteInfo({ ...formModel.value });
  if (!error) {
    window.$message?.success(msg);
    appStore.getSystemInfo();
  }
  endLoading();
}
</script>

<style lang="scss" scoped></style>
