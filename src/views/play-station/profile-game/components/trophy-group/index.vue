<template>
  <NSpace vertical :size="20">
    <div class="flex">
      <div class="h-64px w-64px flex flex-center">
        <NImage
          width="64"
          height="64"
          :src="props.group.thumbnail"
          class="flex-center rd-10px"
          :preview-disabled="true"
          :lazy="true"
        >
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <NSpace class="h-full flex-1-hidden m-x-12px" vertical justify="space-around">
        <NSpace align="center">
          <div class="text-16px font-bold">{{ props.group.name }}</div>
        </NSpace>
        <TrophyComplete size="small" :trophyNum="trophyNum.total" :trophy-num-got="trophyNum.got" />
      </NSpace>
      <NSpace justify="end">
        <NRadioGroup v-model:value="defaultStatus" size="small">
          <NRadioButton
            v-for="item of statusOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></NRadioButton>
        </NRadioGroup>
      </NSpace>
    </div>
    <NGrid cols="1 550:2 1200:3" x-gap="16" y-gap="16" item-responsive>
      <NGridItem v-for="(trophy, i) of trophies" :key="trophy.id">
        <TrophyCard
          :trophy="trophy"
          :profileTrophy="props.profileTrophyMap.get(trophy.id)"
          :i="i"
        />
      </NGridItem>
    </NGrid>
  </NSpace>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { TrophyCard } from '..';
import { PlaystationLoading, TrophyComplete } from '@/components';

defineOptions({
  name: 'TropyGroup',
});

type Props = {
  group: PlayStation.TrophyGroup;
  profileTrophyMap: Map<number, PlayStation.ProfileTrophy>;
};

/** 筛选状态 */
type Status = 'all' | 'got' | 'not-got';

const props = defineProps<Props>();

/** 该奖杯组下，奖杯数量获取情况 */
const trophyNum = computed(() => {
  const {
    group: { platinum, gold, silver, bronze, trophies },
    profileTrophyMap,
  } = props;
  const got: PlayStation.TrophyNum = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  };

  trophies &&
    trophies.forEach((trophy) => {
      if (profileTrophyMap.has(trophy.id)) {
        got[trophy.type]++;
      }
    });
  return {
    total: { bronze, silver, gold, platinum },
    got,
  };
});

/** 筛选列表 */
const statusOpt: { value: Status; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'got', label: '已获得' },
  { value: 'not-got', label: '未获得' },
];

/** 默认筛选列表 */
const defaultStatus = ref<Status>('all');

/** 展示的奖杯 */
const trophies = computed(() => {
  const { trophies } = props.group;
  if (!trophies) return [];
  if (defaultStatus.value === 'all') {
    return trophies;
  } else if (defaultStatus.value === 'got') {
    return trophies.filter((t) => props.profileTrophyMap.has(t.id));
  } else if (defaultStatus.value === 'not-got') {
    return trophies.filter((t) => !props.profileTrophyMap.has(t.id));
  }
  return [];
});

/** 计算默认筛选项 */
watchEffect(() => {
  const { total, got } = trophyNum.value;
  const gotted = got.bronze + got.silver + got.gold + got.platinum;
  const all = total.bronze + total.silver + total.gold + total.platinum;
  if (all === gotted || gotted === 0) {
    defaultStatus.value = 'all';
  } else if (gotted < all) {
    defaultStatus.value = 'not-got';
  }
});
</script>

<style lang="scss" scoped></style>
