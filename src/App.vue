<template>
  <NConfigProvider
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { dateZhCN, zhCN } from 'naive-ui';
import { useThemeStore, subscribeStore, useAppStore } from '@/stores';
import { onMounted } from 'vue';

const theme = useThemeStore();
const appStore = useAppStore();

onMounted(() => {
  subscribeStore();
  appStore.getWebsiteInfo();
});
</script>
