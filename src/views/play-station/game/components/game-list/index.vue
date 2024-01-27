<template>
  <NCard
    title="游戏列表"
    :segmented="{
      content: true,
    }"
  >
    <template #header-extra>
      <PopoverBtn
        :msg="'同步游戏'"
        :icon="ButtonIconEnum.refresh"
        @click="openSyncGameModal"
      ></PopoverBtn>
    </template>
    <div :style="styleVars">
      <div v-if="loading" class="flex flex-center h-200px">
        <PlaystationLoading />
      </div>
      <template v-else>
        <div v-if="!gameList.length" class="flex-center">
          <GhostPlaceholder :text="'暂无游戏'" />
        </div>
        <NGrid v-else cols="1 540:2 800:3 1200:4" x-gap="16" y-gap="16" item-responsive>
          <NGridItem
            v-for="(info, i) of gameList"
            :key="info.id"
            class="h-216px rd-10px"
            :style="{ background: `var(--bg-${i % colorArr.length})` }"
          >
            <div class="h-full flex-col">
              <div class="flex-col p-y-16px p-x-20px b-b-1px b-b-#fff">
                <div class="flex">
                  <NImage class="w-60px h-60px rd-10px" :src="info.game.thumbnail"></NImage>
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
                    :color="`var(--text-${i % colorArr.length})`"
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
                  ></PopoverBtn>
                  <PopoverBtn :icon="ButtonIconEnum.more" msg="详情"></PopoverBtn>
                </div>
              </div>
            </div>
          </NGridItem>
        </NGrid>
      </template>
    </div>
    <SyncGameModal v-model:visible="showSyncGameModal" @on-sync="getGameList" />
  </NCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { ButtonIconEnum } from '@/enums';
import { SyncGameModal } from './components';
import { useBoolean } from '@/hooks';
import { psnGameSynchronized } from '@/service';
import { NGridItem } from 'naive-ui';

defineOptions({
  name: 'SyncGameModal',
});

const { bool: showSyncGameModal, setTrue: openSyncGameModal } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const gameList = ref<ApiPsn.Game[]>([]);

const colorArr = [
  ['#fee4cb', '#ff942e'],
  ['#e9e7fd', '#4f3ff0'],
  ['#dbf6fd', '#096c86'],
  ['#ffd3e2', '#df3670'],
  ['#c8f7dc', '#34c471'],
  ['#d5deff', '4067f9'],
];

const styleVars = computed(() => {
  return colorArr.map(([bg, text], i) => `--bg-${i}: ${bg}; --text-${i}: ${text}`).join(';');
});

async function getGameList() {
  startLoading();
  const { error, data } = await psnGameSynchronized();
  if (!error) {
    gameList.value = data;
  }
  endLoading();
}

/** 计算完成率，暂不计算各奖杯的比重 */
function calcCompleteRate(info: ApiPsn.Game) {
  const {
    bronzeGot,
    silverGot,
    goldGot,
    platinumGot,
    game: { bronze, silver, gold, platinum },
  } = info;
  return Number(
    (
      ((bronzeGot + silverGot + goldGot + platinumGot) / (bronze + silver + gold + platinum)) *
      100
    ).toFixed(0),
  );
}

onMounted(() => {
  getGameList();
});
</script>

<style lang="scss" scoped></style>
