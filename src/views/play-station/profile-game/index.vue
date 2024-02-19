<template>
  <ScrollContainer>
    <NSpace vertical>
      <GameInfo :info="game" :loading="loading" @on-sync="getProfileGame" />
      <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
        <TrophyInfo v-if="game" :trophy-group="game.game.trophyGroups" />
      </Transition>
      <GuideInfo v-if="game" :ppgId="gameId" />
    </NSpace>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { psnProfileGame } from '@/service';
import { onMounted, ref, computed } from 'vue';
import { useRouterPush } from '@/composables';
import { useBoolean } from '@/hooks';
import { GameInfo, TrophyInfo, GuideInfo } from './components';
import { useAppStore } from '@/stores';

defineOptions({
  name: 'PlaystationProfileGameView',
});

const route = useRoute();
const appStore = useAppStore();

const { goBack } = useRouterPush();

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

const game = ref<ApiPsn.ProfileGame | null>(null);

const gameId = computed(() => {
  return route.params.id as ApiPsn.ProfileGame['id'];
});

/** 获取游戏信息 */
async function getProfileGame() {
  startLoading();
  const { error, data } = await psnProfileGame(gameId.value);
  if (!error) {
    appStore.updateWebsiteTitle(`${data.game.originName}-${route.meta.title}`);
    game.value = data;
  } else {
    goBack();
  }
  endLoading();
}

onMounted(() => {
  getProfileGame();
});
</script>

<style lang="scss" scoped></style>
