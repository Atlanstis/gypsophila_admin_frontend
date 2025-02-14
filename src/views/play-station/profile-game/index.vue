<template>
  <ScrollContainer>
    <NSpace vertical>
      <GameInfo
        :game="game"
        :profile-game="profileGame"
        :isError="isError"
        :loading="loading"
        @on-sync="getProfileGame"
      />
      <template v-if="!isError">
        <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
          <TrophyTabs
            v-if="game?.trophyGroups"
            :trophy-groups="game?.trophyGroups"
            :profile-trophies="profileTrophies"
          />
        </Transition>
      </template>
    </NSpace>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { psProfileGameInfo } from '@/service';
import { onMounted, ref } from 'vue';
import { useBoolean } from '@/hooks';
import { GameInfo, TrophyTabs } from './components';
import { useAppStore } from '@/stores';

defineOptions({
  name: 'PlaystationProfileGame',
});

const route = useRoute();
const appStore = useAppStore();

const { bool: isError, setTrue: setError } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

const game = ref<Util.Nullable<PlayStation.Game>>(null);
const profileGame = ref<Util.Nullable<PlayStation.ProfileGame>>(null);
const profileTrophies = ref<PlayStation.ProfileTrophy[]>([]);

function transferGameId() {
  const id = route.params.id;
  let idStr = typeof id === 'string' ? id : id[0];
  if (idStr) {
    const gameId = Number(idStr);
    return isNaN(gameId) ? null : gameId;
  }
  return null;
}

/** 获取游戏信息 */
async function getProfileGame() {
  startLoading();
  const profileGameId = transferGameId();
  if (!profileGameId) {
    setError();
    endLoading();
    return;
  }
  const { error, data } = await psProfileGameInfo(profileGameId);
  if (!error) {
    game.value = data.game;
    profileGame.value = data.profileGame;
    profileTrophies.value = data.profileTrophies;
    appStore.updateWebsiteTitle(`${game.value.name}-${route.meta.title}`);
  } else {
    setError();
  }
  endLoading();
}

onMounted(() => {
  getProfileGame();
});
</script>

<style lang="scss" scoped></style>
