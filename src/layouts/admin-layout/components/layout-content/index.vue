<template>
  <!-- <ScrollContainer> -->
  <RouterView v-slot="{ Component }">
    <Transition :name="'fade'" mode="out-in" :appear="false">
      <component :is="Component" class="p-16px h-full"></component>
    </Transition>
  </RouterView>
  <!-- </ScrollContainer> -->
</template>

<script lang="ts" setup>
defineOptions({
  name: 'AdminLayoutContent',
});
</script>

<style lang="scss" scoped></style>
