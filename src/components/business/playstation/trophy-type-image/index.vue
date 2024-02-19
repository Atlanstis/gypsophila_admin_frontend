<template>
  <component :is="trophyImage"></component>
</template>

<script lang="ts" setup>
import TrophyBronzeImg from '../trophy-num/assets/trophy-bronze.png';
import TrophyGoldImg from '../trophy-num//assets/trophy-gold.png';
import TrophyPlatinumImg from '../trophy-num//assets/trophy-platinum.png';
import TrophySilverImg from '../trophy-num//assets/trophy-silver.png';
import { computed, h } from 'vue';

defineOptions({
  name: 'TrophyTypeImage',
});

interface Props {
  type: PlayStation.TrophyType;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'platinum',
  size: 16,
});

const map: Record<PlayStation.TrophyType, string> = {
  platinum: TrophyPlatinumImg,
  gold: TrophyGoldImg,
  silver: TrophySilverImg,
  bronze: TrophyBronzeImg,
};

const trophyImage = computed(() =>
  h('img', { src: map[props.type], style: { width: `${props.size}px` } }),
);
</script>

<style lang="scss" scoped></style>
