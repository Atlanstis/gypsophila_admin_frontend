<template>
  <NCard>
    <n-tabs v-model:value="activeTabName" type="line" animated>
      <n-tab-pane v-for="(group, i) of props.trophyGroup" :key="i" :name="`${i}`" :tab="group.name">
        <TrophyGroup v-if="activeTabName === `${i}`" :group="group" />
      </n-tab-pane>
    </n-tabs>
  </NCard>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TrophyGroup } from '..';

defineOptions({
  name: 'TrophyInfo',
});

type Props = {
  trophyGroup: ApiPsn.TrophyGroup[];
};

const props = withDefaults(defineProps<Props>(), {
  trophyGroup: () => [],
});

const activeTabName = ref<string>('');

watch(
  () => props.trophyGroup,
  () => {
    activeTabName.value = props.trophyGroup.length > 0 ? '0' : '';
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
