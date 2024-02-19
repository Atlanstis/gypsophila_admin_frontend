<template>
  <NSpace vertical :size="20">
    <div class="flex">
      <div class="h-80px w-80px flex flex-center">
        <NImage width="80" height="80" :src="props.group.thumbnail" class="flex-center rd-10px">
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <NSpace class="h-full flex-1-hidden m-x-12px" vertical justify="space-around">
        <NSpace align="center">
          <div class="text-16px font-bold">{{ props.group.name }}</div>
          <NTag v-if="props.group.isDLC" size="small" type="primary">DLC</NTag>
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
        <TrophyCard :trophy="trophy" :i="i" />
      </NGridItem>
    </NGrid>
  </NSpace>
</template>

<script lang="ts" setup>
import { NImage, NTag, NSpace, NRadioButton } from 'naive-ui';
import { PlaystationLoading } from '@/components';
import { computed, ref, watchEffect } from 'vue';
import { TrophyCard } from '..';

defineOptions({
  name: 'TropyGroup',
});

type Props = {
  group: ApiPsn.TrophyGroup;
};

/** 筛选状态 */
type Status = 'all' | 'got' | 'not-got';

const props = defineProps<Props>();

/** 奖杯获取情况 */
const trophyNum = computed(() => {
  const { platinum, gold, silver, bronze, trophies } = props.group;
  const got = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  };
  trophies.forEach((t) => {
    if (t.completeInfo && t.completeInfo.completeTime) {
      got[t.type]++;
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
  if (defaultStatus.value === 'all') {
    return trophies;
  } else if (defaultStatus.value === 'got') {
    return trophies.filter((t) => t.completeInfo && t.completeInfo.completeTime);
  } else if (defaultStatus.value === 'not-got') {
    return trophies.filter((t) => !(t.completeInfo && t.completeInfo.completeTime));
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
