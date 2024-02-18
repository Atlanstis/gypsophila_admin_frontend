<template>
  <NSpace vertical :size="20">
    <NSpace>
      <div class="h-80px w-80px flex flex-center">
        <NImage width="80" height="80" :src="props.group.thumbnail" class="flex-center rd-10px">
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <NSpace class="h-full" vertical justify="space-around">
        <NSpace align="center">
          <div class="text-16px font-bold">{{ props.group.name }}</div>
          <NTag v-if="props.group.isDLC" size="small" type="primary">DLC</NTag>
        </NSpace>
        <TrophyComplete size="small" :trophyNum="trophyNum.total" :trophy-num-got="trophyNum.got" />
      </NSpace>
    </NSpace>
    <NGrid cols="1 550:2 1200:3" x-gap="16" y-gap="16" item-responsive>
      <NGridItem v-for="(trophy, i) of group.trophies" :key="trophy.id">
        <TrophyCard :trophy="trophy" :i="i" />
      </NGridItem>
    </NGrid>
  </NSpace>
</template>

<script lang="ts" setup>
import { NImage, NTag, NSpace } from 'naive-ui';
import { PlaystationLoading } from '@/components';
import { computed } from 'vue';
import { TrophyCard } from '..';

defineOptions({
  name: 'TropyGroup',
});

type Props = {
  group: ApiPsn.TrophyGroup;
};

const props = defineProps<Props>();

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
</script>

<style lang="scss" scoped></style>
