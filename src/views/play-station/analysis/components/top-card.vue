<template>
  <NCard>
    <div class="flex min-h-100px">
      <div class="w-100px flex-center">
        <NSkeleton v-if="loading" height="100px" width="100px" :sharp="false" />
        <NImage v-else :src="detail?.thumbnail" :alt="detail?.originName">
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
          <div class="flex flex-y-center">
            <p class="font-bold text-16px m-r-6px">{{ detail?.name }}</p>
            <NSpace>
              <NTag
                v-for="platform of detail?.platforms"
                :key="platform"
                :color="{
                  color: PlatformColorMap[platform],
                  textColor: '#fff',
                }"
                :bordered="false"
                size="small"
              >
                {{ platform }}
              </NTag>
              <NTag v-for="version of detail?.version" :key="version" size="small" type="primary">
                {{ version }}
              </NTag>
            </NSpace>
          </div>
          <div v-if="detail">
            <NSpace>
              <span :style="{ color: PerfectDifficultyColorMap[detail.perfectDiffucuity] }">
                {{ detail?.perfectDiffucuity }}
              </span>
              <div class="w-80px h-full flex flex-y-center">
                <NProgress
                  :color="PerfectDifficultyColorMap[detail.perfectDiffucuity]"
                  :percentage="detail.perfectRate"
                  :indicator-placement="'inside'"
                ></NProgress>
              </div>
              <div class="h-full flex flex-y-center color-#B8C4CE">
                <n-number-animation :from="0" :to="detail.players" :duration="2000" />人玩过
              </div>
            </NSpace>
          </div>
          <TrophyNum :trophy-num="detail?.trophyNum" />
        </div>
      </div>
      <div>
        <NSpace>
          <PopoverBtn
            :msg="'查看 Psnine 详情'"
            :icon="'iconamoon:eye-fill'"
            @click="onWatchDetail"
          />
          <PopoverBtn :msg="'返回查找'" :icon="'lets-icons:refund-back'" @click="onBackSearch" />
        </NSpace>
      </div>
    </div>
  </NCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { NSkeleton } from 'naive-ui';
import PlaystationLoading from '@/components/custom/loading/playstation-loading.vue';
import { PlatformColorMap, PerfectDifficultyColorMap } from '@/constants';
import TrophyNum from './trophy-num.vue';
import { useRouterPush } from '@/composables';
import { RouteEnum } from '@/enums';

defineOptions({
  name: 'TopCard',
});

type Props = {
  detail: Psnine.GameDetail | null;
  loading: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  detail: null,
  loading: false,
});

const detail = computed(() => {
  return props.detail;
});

const { toOutsideUrl, routerPush } = useRouterPush();

function onWatchDetail() {
  if (!detail.value) return;
  toOutsideUrl(detail.value.url);
}

function onBackSearch() {
  if (!detail.value) return;
  routerPush({ name: RouteEnum.PlayStation_Search });
}
</script>

<style lang="scss" scoped></style>
