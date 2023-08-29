<template>
  <div>
    <NButton>测试</NButton>
    <p v-for="i in 100" :key="i">
      {{ i }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TestView',
});
</script>
