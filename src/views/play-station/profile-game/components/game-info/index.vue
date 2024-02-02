<template>
  <NCard>
    <div class="flex">
      <div class="h-100px w-100px">
        <NSkeleton v-if="loading" height="100px" width="100px" :sharp="false" />
        <NImage
          v-else
          :src="info?.game.thumbnail"
          :alt="info?.game.originName"
          class="rd-10px flex-center"
        >
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <div class="flex-1 m-l-12px m-r-12px">
        <template v-if="loading">
          <NSkeleton v-if="loading" height="24px" width="50%" text :sharp="false" :repeat="2" />
          <NSkeleton v-if="loading" height="46px" width="40%" :sharp="false" />
        </template>
        <div v-else class="h-full flex flex-col justify-around">
          <NSpace align="center">
            <p class="font-bold text-16px">{{ info?.game.originName }}</p>
            <GamePlatform
              v-for="platform of info?.game.platforms"
              :key="platform"
              :platform="platform"
            />
          </NSpace>
          <NProgress
            v-if="info"
            :percentage="calcCompleteRate(info)"
            :show-indicator="false"
            class="w-260px!"
          ></NProgress>
          <TrophyComplete
            size="small"
            :trophyNum="trophyNum?.total"
            :trophy-num-got="trophyNum?.got"
          />
        </div>
      </div>
      <div>
        <PopoverBtn :msg="'返回'" :icon="ButtonIconEnum.back" @click="onGoback"></PopoverBtn>
      </div>
    </div>
  </NCard>
</template>

<script lang="ts" setup>
import { ButtonIconEnum } from '@/enums';
import { calcCompleteRate } from '@/utils';
import { computed } from 'vue';
import { useRouterPush } from '@/composables';
defineOptions({
  name: 'GameInfo',
});

interface Props {
  info: ApiPsn.ProfileGame | null;
  loading: boolean;
}

const props = defineProps<Props>();

const { goBack } = useRouterPush();

const trophyNum = computed(() => {
  if (!props.info) return undefined;
  const {
    game: { bronze, silver, gold, platinum },
    bronzeGot,
    silverGot,
    goldGot,
    platinumGot,
  } = props.info;
  return {
    total: { bronze, silver, gold, platinum },
    got: { bronze: bronzeGot, silver: silverGot, gold: goldGot, platinum: platinumGot },
  };
});

function onGoback() {
  goBack();
}
</script>

<style lang="scss" scoped></style>
