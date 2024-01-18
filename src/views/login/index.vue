<template>
  <div class="h-full relative flex-center">
    <CanvasBackground />
    <LoginForm class="absolute" />
    <RecordNumber class="fixed bottom-20px" />
  </div>
</template>

<script lang="ts" setup>
import { CanvasBackground, LoginForm } from './components';

defineOptions({
  name: 'LoginView',
});
</script>

<style lang="scss" scoped></style>
