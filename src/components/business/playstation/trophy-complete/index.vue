<template>
  <NSpace :size="size.space">
    <template v-for="trophy of trophyTypes" :key="trophy.type">
      <img :src="trophy.img" :style="{ width: `${size.img}px` }" />
      <div class="h-full flex flex-col flex-justify-end">
        <span
          class="font-bold"
          :style="{ color: TrophyColorMap[trophy.type], 'font-size': `${size.font}px` }"
        >
          <NNumberAnimation :from="0" :to="trophy.gotNum" :duration="2000" />
          /
          <NNumberAnimation :from="0" :to="trophy.num" :duration="2000" />
        </span>
      </div>
    </template>
  </NSpace>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue';
import TrophyBronzeImg from '../trophy-num/assets/trophy-bronze.png';
import TrophyGoldImg from '../trophy-num//assets/trophy-gold.png';
import TrophyPlatinumImg from '../trophy-num//assets/trophy-platinum.png';
import TrophySilverImg from '../trophy-num//assets/trophy-silver.png';
import { TrophyColorMap } from '@/constants';

defineOptions({
  name: 'TrophyComplete',
});

interface Props {
  trophyNum: PlayStation.TrophyNum;
  trophyNumGot: PlayStation.TrophyNum;
  size?: 'small' | 'default';
}

interface TrophyType {
  type: PlayStation.TrophyType;
  img: string;
  num?: number;
  gotNum?: number;
}

const props = withDefaults(defineProps<Props>(), {
  trophyNum: () => ({
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  }),
  trophyNumGot: () => ({
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  }),
  size: 'default',
});

const size = computed(() => {
  const map: Record<'small' | 'default', { font: number; img: number; space: 'small' | 'medium' }> =
    {
      small: { font: 15, img: 21, space: 'small' },
      default: { font: 24, img: 30, space: 'medium' },
    };
  return map[props.size];
});

const trophyTypes: ComputedRef<TrophyType[]> = computed(() => [
  {
    type: 'platinum',
    img: TrophyPlatinumImg,
    num: props.trophyNum.platinum,
    gotNum: props.trophyNumGot.platinum,
  },
  { type: 'gold', img: TrophyGoldImg, num: props.trophyNum.gold, gotNum: props.trophyNumGot.gold },
  {
    type: 'silver',
    img: TrophySilverImg,
    num: props.trophyNum.silver,
    gotNum: props.trophyNumGot.silver,
  },
  {
    type: 'bronze',
    img: TrophyBronzeImg,
    num: props.trophyNum.bronze,
    gotNum: props.trophyNumGot.bronze,
  },
]);
</script>

<style lang="scss" scoped></style>
