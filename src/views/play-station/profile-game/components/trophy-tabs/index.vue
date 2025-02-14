<template>
  <NCard>
    <NTabs v-model:value="activeTabName" type="line" animated>
      <NTabPane v-for="(group, i) of props.trophyGroups" :key="i" :name="`${i}`" :tab="group.name">
        <TrophyGroup
          v-if="activeTabName === `${i}`"
          :group="group"
          :profileTrophyMap="profileTrophyMap"
        />
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { TrophyGroup } from '..';

defineOptions({
  name: 'TrophyTabs',
});

type Props = {
  trophyGroups: PlayStation.TrophyGroup[];
  profileTrophies: PlayStation.ProfileTrophy[];
};

const props = withDefaults(defineProps<Props>(), {
  trophyGroups: () => [],
  profileTrophies: () => [],
});

const activeTabName = ref<string>('');

const profileTrophyMap = computed(() => {
  const map = new Map<number, PlayStation.ProfileTrophy>();
  props.profileTrophies.forEach((trophy) => {
    map.set(trophy.trophyId, trophy);
  });
  return map;
});

watch(
  () => props.trophyGroups,
  () => {
    activeTabName.value = props.trophyGroups.length > 0 ? '0' : '';
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
