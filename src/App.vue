<template>
  <NConfigProvider
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <RouterView />
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { dateZhCN, zhCN } from 'naive-ui';
import { useThemeStore, subscribeStore } from '@/stores';

const theme = useThemeStore();

subscribeStore();
</script>
