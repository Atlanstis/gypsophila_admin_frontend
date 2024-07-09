<template>
  <div class="h-full w-full">
    <ScrollContainer>
      <RenderContent />
    </ScrollContainer>
  </div>
</template>

<script lang="ts" setup>
import RenderContent from './components/render-content/index.vue';

defineOptions({
  name: 'WorkbenchView',
});
</script>

<style lang="scss" scoped></style>
