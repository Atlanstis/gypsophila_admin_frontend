<template>
  <!-- <ScrollContainer> -->
  <RouterView v-slot="{ Component }">
    <Transition :name="'fade-slide'" mode="out-in" :appear="false">
      <component
        v-if="route.meta.mode === 'fixed'"
        :is="Component"
        class="p-16px h-full"
      ></component>
      <ScrollContainer v-else>
        <component :is="Component" class="p-16px"></component>
      </ScrollContainer>
    </Transition>
  </RouterView>
  <!-- </ScrollContainer> -->
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

defineOptions({
  name: 'AdminLayoutContent',
});

const route = useRoute();
</script>

<style lang="scss" scoped></style>
