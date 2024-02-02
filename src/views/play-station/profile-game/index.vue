<template>
  <ScrollContainer>
    <NSpace vertical>
      <GameInfo :info="game" :loading="loading" />
      <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
        <TrophyInfo v-if="game" :trophy-group="game.game.trophyGroups" />
      </Transition>
    </NSpace>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { psnProfileGame } from '@/service';
import { onMounted, ref } from 'vue';
import { useRouterPush } from '@/composables';
import { useBoolean } from '@/hooks';
import { GameInfo, TrophyInfo } from './components';

defineOptions({
  name: 'PlaystationProfileGameView',
});

const route = useRoute();

const { goBack } = useRouterPush();

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

const game = ref<ApiPsn.ProfileGame | null>(null);

async function getProfileGame() {
  startLoading();
  const { error, data } = await psnProfileGame(route.params.id as string);
  if (!error) {
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
