<template>
  <div class="h-100px">
    <div class="flex h-full">
      <div class="w-100px h-100px b-rd-50% b-2px b-primary overflow-hidden p-2px">
        <NImage
          :src="profile.avatar"
          :alt="profile.psnId"
          :preview-disabled="true"
          :lazy="true"
          class="h-full w-full b-rd-50% flex-center"
        >
          <template #placeholder>
            <PlaystationLoading />
          </template>
        </NImage>
      </div>
      <NSpace vertical justify="space-around" class="h-100px flex-1 p-x-10px">
        <div class="text-24px font-bold">{{ profile.psnId }}</div>
        <TrophyNum :trophy-num="trophyNum"></TrophyNum>
      </NSpace>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlaystationLoading, TrophyNum } from '@/components';
import { pick } from '@/utils';
import { computed } from 'vue';

defineOptions({
  name: 'ProfileInfo',
});

const props = defineProps<{ profile: PlayStation.Profile }>();

const trophyNum = computed(() => {
  return pick(props.profile, ['bronze', 'silver', 'gold', 'platinum']);
});
</script>

<style lang="scss" scoped></style>
