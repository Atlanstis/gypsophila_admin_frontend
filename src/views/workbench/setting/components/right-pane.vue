<template>
  <NCard class="h-full" content-style="height: 100%">
    <ScrollContainer>
      <DropContent />
    </ScrollContainer>
  </NCard>
</template>

<script lang="ts" setup>
import { DropContent } from '.';

defineOptions({
  name: 'RightPane',
});
</script>

<style lang="scss" scoped></style>
