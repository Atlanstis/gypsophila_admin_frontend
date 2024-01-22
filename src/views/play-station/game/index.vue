<template>
  <ScrollContainer>
    <NCard>
      <div v-if="profileLoading" class="h-100px flex-center">
        <PlaystationLoading />
      </div>
      <div class="h-100px" v-else>
        <ProfileBindForm v-if="!profile" @binded="getPsnProfile" />
        <ProfileInfo v-else :profile="profile" />
      </div>
    </NCard>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { psnProfile } from '@/service';
import { onMounted, ref } from 'vue';
import { useBoolean } from '@/hooks';
import { ProfileBindForm, ProfileInfo } from './components';

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
