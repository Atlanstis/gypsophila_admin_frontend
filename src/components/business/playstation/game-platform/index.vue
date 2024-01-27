<template>
  <NTag :color="{ color, textColor: '#fff' }" :bordered="false" size="small">{{ platform }}</NTag>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { PlatformColorMap } from '@/constants';

defineOptions({
  name: 'GamePlatform',
});

const props = defineProps<{ platform: PlayStation.Platform }>();

const color = computed(() => PlatformColorMap[props.platform]);
</script>

<style lang="scss" scoped></style>
