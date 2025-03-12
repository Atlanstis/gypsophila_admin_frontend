<template>
  <div
    class="flex-col rd-10px h-216px card-wrap"
    :style="{ background: `${colorArr[i % colorArr.length][0]}` }"
  >
    <div class="flex-col p-y-16px p-x-20px b-b-1px b-b-#fff">
      <div v-if="info.game" class="flex">
        <NImage
          class="h-60px rd-10px"
          :style="{ width: !isPs5 ? '113px' : '60px' }"
          :src="info.game.thumbnail"
          :lazy="true"
          :preview-disabled="true"
        >
          <template #placeholder>
            <div class="h-full w-full flex-center">
              <PlaystationLoading />
            </div>
          </template>
        </NImage>
        <div class="m-l-12px flex-col flex-1-hidden justify-around">
          <p class="font-bold text-16px text-ellipsis">{{ info.game.name }}</p>
          <NSpace>
            <GamePlatform v-for="p of info.game.platforms" :key="p" :platform="p" />
          </NSpace>
        </div>
      </div>
      <p class="font-bold m-t-10px">完成进度</p>
      <div v-if="info && info.game" class="m-t-8px m-b-12px">
        <NProgress
          :percentage="calcCompleteRate(info, info.game)"
          :height="4"
          :color="`${colorArr[i % colorArr.length][1]}`"
          rail-color="#fff"
          :show-indicator="false"
        ></NProgress>
      </div>
      <div class="flex-x-center w-full">
        <TrophyNum
          :trophy-num="{
            platinum: info.platinum,
            gold: info.gold,
            silver: info.silver,
            bronze: info.bronze,
          }"
          size="small"
        ></TrophyNum>
      </div>
    </div>
    <div class="flex-1-hidden flex-y-center p-x-10px justify-end">
      <PopoverBtn
        :icon="ButtonIconEnum.more"
        msg="详情"
        :bordered="false"
        @click="goProfileGame"
      ></PopoverBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlaystationLoading, TrophyNum, GamePlatform } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { useRouterPush } from '@/composables';
import { Enum_Route } from '@/constants';
import { calcCompleteRate } from '@/views/play-station/__util__';
import { computed } from 'vue';

defineOptions({
  name: 'GameCard',
});

const props = defineProps<{ info: PlayStation.ProfileGame; i: number }>();

const isPs5 = computed(() => props.info.game?.platforms?.includes('PS5'));

const { routerPush } = useRouterPush();

const colorArr = [
  ['#fee4cb', '#ff942e'],
  ['#e9e7fd', '#4f3ff0'],
  ['#dbf6fd', '#096c86'],
  ['#ffd3e2', '#df3670'],
  ['#c8f7dc', '#34c471'],
  ['#d5deff', '#4067f9'],
];

/** 跳转至游戏概览页 */
function goProfileGame() {
  const info = props.info;
  if (!info) return;
  routerPush({ name: Enum_Route.PlayStation_Profile_Game, params: { id: info.id } });
}
</script>

<style lang="scss" scoped>
.card-wrap {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}
</style>
