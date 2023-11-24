<template>
  <div class="overflow-hidden h-full">
    <NCard :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <slot name="header"></slot>
        <div class="flex-1-hidden table-wrap">
          <slot name="content"></slot>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TableContainer',
});
</script>

<style lang="scss" scoped>
.table-wrap :deep(> div) {
  height: 100%;
}
</style>
