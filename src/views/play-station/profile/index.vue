<template>
  <ScrollContainer>
    <NSpace vertical>
      <NCard>
        <div v-if="profileLoading" class="h-100px flex-center">
          <PlaystationLoading />
        </div>
        <div v-else>
          <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
            <ProfileBindForm v-if="!profile" @binded="getPsnProfile(true)" />
            <ProfileInfo v-else :profile="profile" />
          </Transition>
        </div>
      </NCard>
      <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
        <GameFavorList v-if="profile" ref="gameFavorList" />
      </Transition>
      <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
        <GameList v-if="profile" @on-refresh="getPsnProfile(false)" @on-favor="refreshFavorList" />
      </Transition>
    </NSpace>
    <NBackTop :right="40" :bottom="50" class="z-999" />
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { psnProfile } from '@/service';
import { onMounted, ref } from 'vue';
import { useBoolean } from '@/hooks';
import { ProfileBindForm, ProfileInfo, GameList, GameFavorList } from './components';

defineOptions({
  name: 'PlayStationGameView',
});

const {
  bool: profileLoading,
  setTrue: startProfileLoading,
  setFalse: endPerfileLoading,
} = useBoolean(true);

const profile = ref<ApiPsn.Profile | null>(null);
const gameFavorList = ref<InstanceType<typeof GameFavorList>>();

/**
 * 获取 psn 用户信息
 * @param needLoading 是否显示加载状态
 */
async function getPsnProfile(needLoading: boolean) {
  if (needLoading) {
    startProfileLoading();
  }
  const { error, data } = await psnProfile();
  if (!error && data) {
    profile.value = data;
  }
  if (needLoading) {
    endPerfileLoading();
  }
}

/** 刷新 */
function refreshFavorList() {
  gameFavorList.value?.getFavorList();
}

onMounted(() => {
  getPsnProfile(true);
});
</script>

<style lang="scss" scoped></style>
