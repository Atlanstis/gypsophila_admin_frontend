<template>
  <div
    class="flex rd-10px p-y-16px p-x-20px"
    :style="{
      background: `${colorArr[i % colorArr.length][0]}`,
      border: isComplete ? `2px solid ${colorArr[i % colorArr.length][1]}` : '',
    }"
  >
    <div class="h-60px w-60px flex flex-center flex-shrink-0">
      <NImage
        width="60"
        height="60"
        :src="trophy.thumbnail"
        :lazy="true"
        class="flex-center rd-10px"
      >
        <template #placeholder>
          <PlaystationLoading />
        </template>
      </NImage>
    </div>
    <div class="p-l-12px flex-col justify-around flex-1-hidden">
      <div class="flex items-center">
        <p class="font-bold text-16px">{{ trophy.name }}</p>
        <TrophyTypeImage :type="trophy.type" class="m-l-8px" />
      </div>
      <div v-if="isComplete" class="text-12px color-#808191 flex-y-center">
        <div class="w-6px h-6px rd-50% bg-#808191 m-r-8px"></div>
        <span>{{ completeTime }}</span>
      </div>
      <p
        class="text-12px w-full text-ellipsis"
        :style="{ color: `${colorArr[i % colorArr.length][1]}` }"
      >
        {{ trophy.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({
  name: 'TrophyCard',
});

type Props = {
  trophy: ApiPsn.Trophy;
  i: number;
};

const props = defineProps<Props>();

const colorArr = [
  ['#fee4cb', '#ff942e'],
  ['#e9e7fd', '#4f3ff0'],
  ['#dbf6fd', '#096c86'],
  ['#ffd3e2', '#df3670'],
  ['#c8f7dc', '#34c471'],
  ['#d5deff', '#4067f9'],
];

const isComplete = computed(() => {
  return Boolean(props.trophy.completeInfo?.completeTime);
});

const completeTime = computed(() => {
  const time = props.trophy.completeInfo?.completeTime;
  return time ? time.slice(0, 16) : '';
});
</script>

<style lang="scss" scoped>
.card-wrap {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}
</style>
