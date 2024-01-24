<template>
  <ScrollContainer>
    <NSpace vertical>
      <NCard>
        <div v-if="profileLoading" class="h-100px flex-center">
          <PlaystationLoading />
        </div>
        <div v-else>
          <Transition :name="'zoom-fade'" mode="out-in" :appear="false">
            <ProfileBindForm v-if="!profile" @binded="getPsnProfile" />
            <ProfileInfo v-else :profile="profile" />
          </Transition>
        </div>
      </NCard>
      <Transition :name="'zoom-fade'" mode="out-in" :appear="false">
        <GameList v-if="profile" />
      </Transition>
    </NSpace>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { psnProfile } from '@/service';
import { onMounted, ref } from 'vue';
import { useBoolean } from '@/hooks';
import { ProfileBindForm, ProfileInfo, GameList } from './components';

defineOptions({
  name: 'PlayStationGameView',
});

const {
  bool: profileLoading,
  setTrue: startProfileLoading,
  setFalse: endPerfileLoading,
} = useBoolean(true);

const profile = ref<ApiPsn.Profile | null>(null);

async function getPsnProfile() {
  startProfileLoading();
  const { error, data } = await psnProfile();
  if (!error && data) {
    profile.value = data;
  }
  endPerfileLoading();
}

onMounted(() => {
  getPsnProfile();
});
</script>

<style lang="scss" scoped></style>
