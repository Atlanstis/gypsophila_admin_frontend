<template>
  <div class="inline-flex flex-center">
    <IconSvg></IconSvg>
    <span class="font-14 ml-2px mr-4px font-bold" :style="{ color: props.color }">{{
      props.num
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useIconRender } from '@/composables';

defineOptions({
  name: 'TrophyNum',
});

const props = withDefaults(defineProps<{ num: number; color: string }>(), {
  num: 0,
  color: '',
});

const { iconRender } = useIconRender();

const IconSvg = computed(() =>
  iconRender({ iconLocal: 'trophy', color: props.color, fontSize: 18 }),
);
</script>

<style lang="scss" scoped></style>
