<template>
  <div class="flex-col">
    <p class="w-320px text-center">未查询到绑定信息，请先进行绑定</p>
    <NForm
      ref="formRef"
      :model="formModel"
      class="m-t-20px"
      label-placement="left"
      label-width="80"
      require-mark-placement="left"
      :rules="formRules"
      :disabled="saveLoading"
    >
      <NFormItem label="psnId" path="psnId">
        <NInput
          v-model:value="formModel.psnId"
          placeholder="请输入 Psn Id"
          class="!w-240px"
        ></NInput>
      </NFormItem>
      <NFormItem label=" ">
        <NButton type="primary" :loading="saveLoading" @click="onBind">绑定</NButton>
      </NFormItem>
    </NForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useBoolean } from '@/hooks';
import { NFormItem, type FormItemRule, type FormInst } from 'naive-ui';
import { psnProfileBind } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'ProfileBindForm',
});

interface Emits {
  (e: 'binded'): void;
}

const emit = defineEmits<Emits>();

type FormModel = Pick<ApiPsn.Profile, 'psnId'>;
type FormModelKey = keyof FormModel;

const formRef = ref<FormInst | null>(null);

const formModel = ref<FormModel>({
  psnId: '',
});

const formRules: Record<FormModelKey, FormItemRule | FormItemRule[]> = {
  psnId: [{ required: true, message: '请输入 Psn Id', trigger: 'blur' }],
};

const {
  bool: saveLoading,
  setTrue: startSaveLoading,
  setFalse: endSaveLoading,
} = useBoolean(false);

async function onBind() {
  await formRef.value?.validate();
  startSaveLoading();
  const { error } = await psnProfileBind(formModel.value.psnId);
  if (!error) {
    window.$message?.success('绑定成功', { duration: DEFAULT_MESSAGE_DURATION });
    emit('binded');
  }
  endSaveLoading();
}
</script>

<style lang="scss" scoped></style>
