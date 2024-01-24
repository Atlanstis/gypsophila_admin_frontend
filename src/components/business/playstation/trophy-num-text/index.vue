<template>
  <div>
    <div v-for="trophy of trophyTypes" :key="trophy.type" class="inline-flex flex-center">
      <component :is="trophy.icon" />
      <span class="ml-2px mr-4px font-bold" :style="{ color: trophy.color }">{{ trophy.num }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, type VNode } from 'vue';
import { useIconRender } from '@/composables';
import { TrophyColorMap } from '@/constants';

defineOptions({
  name: 'TrophyNumText',
});

interface Props {
  trophyNum: Psnine.TrophyNum;
}

interface TrophyType {
  type: PlayStation.TrophyType;
  color: string;
  icon: () => VNode;
  num: number;
}

const props = withDefaults(defineProps<Props>(), {
  trophyNum: () => ({
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  }),
});

const { iconRender } = useIconRender();

function getIcon(color: string) {
  return iconRender({ iconLocal: 'trophy', color: color, fontSize: 18 });
}

const trophyTypes: ComputedRef<TrophyType[]> = computed(() => [
  {
    type: 'platinum',
    color: TrophyColorMap.platinum,
    icon: getIcon(TrophyColorMap.platinum),
    num: props.trophyNum.platinum,
  },
  {
    type: 'gold',
    color: TrophyColorMap.gold,
    icon: getIcon(TrophyColorMap.gold),
    num: props.trophyNum.gold,
  },
  {
    type: 'silver',
    color: TrophyColorMap.silver,
    icon: getIcon(TrophyColorMap.silver),
    num: props.trophyNum.silver,
  },
  {
    type: 'bronze',
    color: TrophyColorMap.bronze,
    icon: getIcon(TrophyColorMap.bronze),
    num: props.trophyNum.bronze,
  },
]);
</script>

<style lang="scss" scoped></style>
