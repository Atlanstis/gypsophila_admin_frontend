<template>
  <HoverContainer class="w-64px h-full" tooltip-content="重新加载" placement="bottom-end">
    <icon-mdi-refresh class="text-22px" :class="{ 'animate-spin': loading }" />
  </HoverContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({ name: 'ReloadBtn' });

const loading = ref(false);
</script>

<style scoped></style>
