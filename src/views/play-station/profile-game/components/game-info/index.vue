<template>
  <NCard>
    <div class="flex">
      <div v-if="!isError">
        <NSkeleton v-if="loading" height="100px" width="100px" :sharp="false" />
        <NImage
          :src="game?.thumbnail"
          :alt="game?.name"
          class="h-100px w-100px rd-10px flex-center"
          :preview-disabled="true"
          :lazy="true"
        >
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <div class="flex-1 m-x-12px">
        <template v-if="loading">
          <NSkeleton height="24px" width="50%" text :sharp="false" :repeat="2" />
          <NSkeleton height="46px" width="40%" :sharp="false" />
        </template>
        <div v-else class="h-full flex-col justify-around">
          <div v-if="isError" class="h-200px flex-center">
            <GhostPlaceholder :custom="'游戏加载出错啦 ૮◍⁰ᯅ⁰◍ა '" />
          </div>
          <template v-else>
            <NSpace align="center">
              <p class="font-bold text-16px">{{ game?.name }}</p>
              <GamePlatform
                v-for="platform of game?.platforms"
                :key="platform"
                :platform="platform"
              />
            </NSpace>
            <NProgress
              v-if="game && profileGame"
              :percentage="calcCompleteRate(profileGame, game)"
              :show-indicator="false"
              class="w-260px!"
            ></NProgress>
            <TrophyComplete
              size="small"
              :trophyNum="trophyNum?.total"
              :trophy-num-got="trophyNum?.got"
            />
          </template>
        </div>
      </div>
      <NSpace>
        <PopoverBtn
          v-if="!loading && !isError"
          :msg="'同步游戏'"
          :loading-msg="'同步中'"
          :loading="isInSync"
          :icon="ButtonIconEnum.refresh"
          @click="onSyncGame"
        ></PopoverBtn>
        <PopoverBtn :msg="'返回'" :icon="ButtonIconEnum.back" @click="onGoback"></PopoverBtn>
      </NSpace>
    </div>
  </NCard>
</template>

<script lang="ts" setup>
import { ButtonIconEnum } from '@/enums';
import { calcCompleteRate } from '@/views/play-station/__util__';
import { PlaystationLoading, GamePlatform, TrophyComplete } from '@/components';
import { computed } from 'vue';
import { useRouterPush } from '@/composables';
import { useBoolean } from '@/hooks';
import { psProfilePsnineGameSync } from '@/service';

defineOptions({
  name: 'GameInfo',
});

interface Props {
  game: Util.Nullable<PlayStation.Game>;
  profileGame: Util.Nullable<PlayStation.ProfileGame>;
  loading: boolean;
  isError: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'on-sync'): void;
}>();

const { goBack } = useRouterPush();

const trophyNum = computed(() => {
  if (!props.game || !props.profileGame) return undefined;
  return {
    total: props.game,
    got: props.profileGame,
  };
});

const { bool: isInSync, setTrue: startSync, setFalse: endSync } = useBoolean(false);

async function onSyncGame() {
  const psnine = props.game?.psnine;
  if (!psnine) return;
  startSync();
  const { error, msg } = await psProfilePsnineGameSync(psnine.id);
  if (!error) {
    window.$message?.success(msg);
    emit('on-sync');
  }
  endSync();
}

function onGoback() {
  goBack();
}
</script>

<style lang="scss" scoped></style>
