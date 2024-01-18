<template>
  <a v-if="websiteInfo.showRecordNumber" class="cursor-pointer" href="https://beian.miit.gov.cn">
    {{ websiteInfo.recordNumber }}
  </a>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores';
import { computed } from 'vue';

defineOptions({
  name: 'RecorderNumber',
});

const appStore = useAppStore();
const websiteInfo = computed(() => appStore.websiteInfo);
</script>

<style lang="scss" scoped></style>
