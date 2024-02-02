<template>
  <div
    class="flex-col rd-10px h-216px card-wrap"
    :style="{ background: `${colorArr[i % colorArr.length][0]}` }"
  >
    <div class="flex-col p-y-16px p-x-20px b-b-1px b-b-#fff">
      <div class="flex">
        <NImage class="w-60px h-60px rd-10px" :src="info.game.thumbnail" :lazy="true">
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
        <div class="m-l-12px flex-col flex-1-hidden justify-around">
          <p class="font-bold text-16px ellipsis">{{ info.game.originName }}</p>
          <NSpace>
            <GamePlatform v-for="p of info.game.platforms" :key="p" :platform="p" />
          </NSpace>
        </div>
      </div>
      <p class="font-bold m-t-10px">完成进度</p>
      <div class="m-t-8px m-b-12px">
        <NProgress
          :percentage="calcCompleteRate(info)"
          :height="4"
          :color="`${colorArr[i % colorArr.length][1]}`"
          rail-color="#fff"
          :show-indicator="false"
        ></NProgress>
      </div>
      <div class="flex-x-center w-full">
        <TrophyNum
          :trophy-num="{
            platinum: info.platinumGot,
            gold: info.goldGot,
            silver: info.silverGot,
            bronze: info.bronzeGot,
          }"
          size="small"
        ></TrophyNum>
      </div>
    </div>
    <div class="flex-1-hidden flex-y-center p-l-20px p-r-10px justify-between">
      <p></p>
      <div>
        <PopoverBtn
          :icon="info.isFavor ? ButtonIconEnum.favoriteFilled : ButtonIconEnum.favorite"
          msg="收藏"
          :bordered="false"
          :disabled="favorDisabled"
          @click="onGameFavor(info.id)"
        ></PopoverBtn>
        <PopoverBtn
          :icon="ButtonIconEnum.more"
          msg="详情"
          :bordered="false"
          @click="goProfileGame"
        ></PopoverBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ButtonIconEnum, RouteEnum } from '@/enums';
import { psnGameFavor } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';
import { useBoolean } from '@/hooks';
import { useRouterPush } from '@/composables';
import { calcCompleteRate } from '@/utils';

defineOptions({
  name: 'GameCard',
});

const props = defineProps<{ info: ApiPsn.ProfileGame; i: number }>();

const emit = defineEmits<{
  (e: 'refresh', i: number): void;
}>();

const { routerPush } = useRouterPush();

const colorArr = [
  ['#fee4cb', '#ff942e'],
  ['#e9e7fd', '#4f3ff0'],
  ['#dbf6fd', '#096c86'],
  ['#ffd3e2', '#df3670'],
  ['#c8f7dc', '#34c471'],
  ['#d5deff', '#4067f9'],
];

const { bool: favorDisabled, setTrue: setFavorTrue, setFalse: setFavorFalse } = useBoolean();

/** 处理收藏 */
async function onGameFavor(id: string) {
  setFavorTrue();
  const { error } = await psnGameFavor(id);
  if (!error) {
    emit('refresh', props.i);
    window.$message?.success('操作成功', { duration: DEFAULT_MESSAGE_DURATION });
  }
  setFavorFalse();
}

/** 跳转至游戏概览页 */
function goProfileGame() {
  routerPush({ name: RouteEnum.PlayStation_Profile_Game, params: { id: props.info.id } });
}
</script>

<style lang="scss" scoped>
.card-wrap {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
}
</style>
