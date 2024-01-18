<template>
  <HoverContainer class="w-64px h-full" tooltip="重载" @click="onReload">
    <icon-mdi-refresh class="text-22px" :class="{ 'animate-spin': loading }" />
  </HoverContainer>
</template>

<script setup lang="ts">
import { useBoolean } from '@/hooks';
import { useRouteStore } from '@/stores';
import { useRoute } from 'vue-router';

defineOptions({ name: 'ReloadBtn' });

const route = useRoute();
const routeStore = useRouteStore();
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false);

async function onReload() {
  startLoading();
  await routeStore.reloadRoute(route.name as string);
  setTimeout(() => {
    endLoading();
  }, 1000);
}
</script>

<style scoped></style>
