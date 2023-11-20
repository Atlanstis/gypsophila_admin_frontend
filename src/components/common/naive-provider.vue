<template>
  <NLoadingBarProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <NDialogProvider>
          <slot></slot>
          <NaiveProviderContent />
        </NDialogProvider>
      </NMessageProvider>
    </NNotificationProvider>
  </NLoadingBarProvider>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { defineComponent } from 'vue';
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';

defineOptions({
  name: 'NaiveProvider',
});

/**
 * 挂载 naive 组件的方法至 window, 以便在路由钩子函数和请求函数里面调用
 */
function registerNaiveTools() {
  window.$dialog = useDialog();
  window.$loadingBar = useLoadingBar();
  window.$message = useMessage();
  window.$notification = useNotification();
}

const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools();
  },

  render() {
    return h('div');
  },
});
</script>

<style lang="scss" scoped></style>
