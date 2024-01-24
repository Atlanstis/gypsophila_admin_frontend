<template>
  <div class="h-100px">
    <div class="flex h-full">
      <img :src="profile.avatar" class="w-100px h-100px b-rd-50% b-3px b-primary" />
      <NSpace vertical justify="space-around" class="h-100px flex-1 p-x-10px">
        <div class="text-24px font-bold">{{ profile.psnId }}</div>
        <TrophyNum :trophy-num="trophyNum"></TrophyNum>
      </NSpace>
      <NSpace justify="end"></NSpace>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({
  name: 'ProfileInfo',
});

const props = defineProps<{ profile: ApiPsn.Profile }>();

const trophyNum = computed(() => {
  const { bronze, silver, gold, platinum } = props.profile;
  return {
    bronze,
    silver,
    gold,
    platinum,
  };
});
</script>

<style lang="scss" scoped></style>
