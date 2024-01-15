<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="'fade-slide'" mode="out-in" :appear="false">
      <KeepAlive :include="routeStore.keepAliveRouteNames">
        <component :key="route.fullPath" :is="Component" class="p-16px h-full"></component>
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<script lang="ts" setup>
import { useRouteStore } from '@/stores';

defineOptions({
  name: 'AdminLayoutContent',
});

const routeStore = useRouteStore();
</script>

<style lang="scss" scoped></style>
