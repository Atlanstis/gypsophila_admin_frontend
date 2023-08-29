<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" class="h-full">
    <RouterView />
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { dateZhCN, zhCN } from 'naive-ui';
</script>
