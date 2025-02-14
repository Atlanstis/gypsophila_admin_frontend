<template>
  <ScrollContainer>
    <NSpace vertical>
      <NCard>
        <div v-if="profileLoading" class="h-100px flex-center">
          <PlaystationLoading />
        </div>
        <div v-else>
          <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
            <ProfileBindForm v-if="!profile" @on-binded="getPsnProfile(true)" />
            <ProfileInfo v-else :profile="profile" />
          </Transition>
        </div>
      </NCard>
      <Transition :name="'zoom-fade'" mode="out-in" :appear="true">
        <GameList v-if="profile" @on-refresh="getPsnProfile(false)" />
      </Transition>
    </NSpace>
    <NBackTop :right="40" :bottom="50" class="z-999" />
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { PlaystationLoading } from '@/components';
import { psProfileInfo } from '@/service';
import { onMounted, ref } from 'vue';
import { useBoolean } from '@/hooks';
import { ProfileBindForm, ProfileInfo, GameList } from './components';

defineOptions({
  name: 'PlayStationProfile',
});

const {
  bool: profileLoading,
  setTrue: startProfileLoading,
  setFalse: endPerfileLoading,
} = useBoolean(true);

const profile = ref<ResPsProfile.Info>(null);

/**
 * 获取 psn 用户信息
 * @param needLoading 是否显示加载状态
 */
async function getPsnProfile(needLoading: boolean) {
  if (needLoading) {
    startProfileLoading();
  }
  const { error, data } = await psProfileInfo();
  if (!error && data) {
    profile.value = data;
  }
  if (needLoading) {
    endPerfileLoading();
  }
}

onMounted(() => {
  getPsnProfile(true);
});
</script>

<style lang="scss" scoped></style>
