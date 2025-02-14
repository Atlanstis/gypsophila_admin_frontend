<template>
  <div class="flex-col">
    <p class="w-320px text-center">未查询到绑定信息，请先进行绑定。</p>
    <NForm
      ref="formRef"
      :model="formModel"
      class="m-t-20px"
      label-placement="left"
      label-width="80"
      require-mark-placement="left"
      :rules="formRules"
      :disabled="bindLoading"
    >
      <NFormItem label="PSN ID" path="psnId">
        <NInput
          v-model:value="formModel.psnId"
          placeholder="请输入 PSN ID"
          class="!w-240px"
        ></NInput>
      </NFormItem>
      <NFormItem label=" ">
        <NButton type="primary" :loading="bindLoading" @click="onBind">绑定</NButton>
      </NFormItem>
    </NForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useBoolean } from '@/hooks';
import { NFormItem, type FormItemRule, type FormInst } from 'naive-ui';
import { psProfileBind } from '@/service';

defineOptions({
  name: 'ProfileBindForm',
});

interface Emits {
  (e: 'on-binded'): void;
}

const emit = defineEmits<Emits>();

type FormModel = Pick<PlayStation.Profile, 'psnId'>;
type FormModelKey = keyof FormModel;

const formRef = ref<Util.Nullable<FormInst>>(null);

const formModel = ref<FormModel>({
  psnId: '',
});

const formRules: Record<FormModelKey, FormItemRule | FormItemRule[]> = {
  psnId: [{ required: true, message: '请输入 PSN ID', trigger: 'change' }],
};

const {
  bool: bindLoading,
  setTrue: startBindLoading,
  setFalse: endBindLoading,
} = useBoolean(false);

async function onBind() {
  await formRef.value?.validate();
  startBindLoading();
  const { error, msg } = await psProfileBind(formModel.value.psnId);
  if (!error) {
    window.$message?.success(msg);
    emit('on-binded');
  }
  endBindLoading();
}
</script>

<style lang="scss" scoped></style>
