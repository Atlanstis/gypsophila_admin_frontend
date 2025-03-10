<template>
  <div class="p-16px h-full">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="'fade-slide'" mode="out-in" :appear="true">
        <KeepAlive :include="routeStore.keepAliveRouteNames">
          <component
            v-if="adminLayoutStore.reloadFlag"
            :key="route.fullPath"
            :is="Component"
            class="h-full"
          ></component>
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>

<script lang="ts" setup>
import { useAdminLayoutStore, useRouteStore } from '@/stores';

defineOptions({
  name: 'AdminLayoutContent',
});

const routeStore = useRouteStore();
const adminLayoutStore = useAdminLayoutStore();
</script>

<style lang="scss" scoped></style>
