<template>
  <div class="w-300px sm:w-360px shadow-sm hover:shadow p-20px">
    <div class="mb-20px flex flex-center">
      <icon-local-logo class="text-40px color-primary" />
    </div>
    <NForm ref="formRef" :model="form" :rules="rules" :disabled="formDisabled" :show-label="false">
      <NFormItem path="username">
        <NInput v-model:value="form.username" placeholder="请输入用户名" @keydown="onKeyDown">
          <template #prefix>
            <icon-line-md-account class="text-16px" />
          </template>
        </NInput>
      </NFormItem>
      <NFormItem path="password">
        <n-input
          v-model:value="form.password"
          type="password"
          show-password-on="click"
          placeholder="请输入密码"
          @keydown="onKeyDown"
        >
          <template #prefix>
            <icon-ri-lock-password-line class="text-16px" />
          </template>
        </n-input>
      </NFormItem>
      <div class="justify-between flex-y-center">
        <n-checkbox v-model:checked="rememberMe" :on-update:checked="onRememberMeUpdate"
          >记住我</n-checkbox
        >
        <n-button type="primary" :loading="auth.loginLoading" @click="goLoginHandle">登录</n-button>
      </div>
    </NForm>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useAuthStore } from '@/stores';
import { useBoolean } from '@/hooks';
import { localStorage } from '@/utils';
import { LocalKeyEnum } from '@/enums';

defineOptions({
  name: 'LoginForm',
});

const auth = useAuthStore();

const formDisabled = computed(() => {
  return auth.loginLoading;
});

const formRef = ref<FormInst | null>(null);

const loginInfo = localStorage.get(LocalKeyEnum.LoginInfo);

const form = reactive(
  loginInfo || {
    username: '',
    password: '',
  },
);

const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

/** 默认存储时间 */
const DEFAULT_STORE_TIME = 7 * 24 * 60 * 60;

const { bool: rememberMe, setBool: setRemember } = useBoolean(
  !!localStorage.get(LocalKeyEnum.LoginRememberMe),
);

function onRememberMeUpdate(bool: boolean) {
  setRemember(bool);
  localStorage.set(LocalKeyEnum.LoginRememberMe, bool, DEFAULT_STORE_TIME);
  if (bool) {
    window.$dialog?.warning({
      title: '提示',
      content: '此操作将保留 7 天的登录信息，是否继续？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {},
      onNegativeClick: () => {
        setRemember(bool);
        localStorage.set(LocalKeyEnum.LoginRememberMe, bool, DEFAULT_STORE_TIME);
      },
    });
  }
}

function onKeyDown(key: KeyboardEvent) {
  if (key.code === 'Enter') {
    goLoginHandle();
  }
}

async function goLoginHandle() {
  await formRef.value?.validate();
  if (rememberMe.value) {
    localStorage.set(
      LocalKeyEnum.LoginInfo,
      { username: form.username, password: form.password },
      DEFAULT_STORE_TIME,
    );
  } else {
    localStorage.remove(LocalKeyEnum.LoginInfo);
  }
  auth.login(form.username, form.password);
}
</script>

<style lang="scss" scoped></style>
