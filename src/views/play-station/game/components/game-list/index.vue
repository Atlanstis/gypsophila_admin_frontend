<template>
  <NCard
    title="游戏列表"
    :segmented="{
      content: true,
    }"
  >
    <template #header-extra>
      <PopoverBtn
        :msg="'同步游戏'"
        :icon="ButtonIconEnum.refresh"
        @click="openSyncGameModal"
      ></PopoverBtn>
    </template>
    <SyncGameModal v-model:visible="showSyncGameModal" @on-sync="getGameList" />
  </NCard>
</template>

<script lang="ts" setup>
import { ButtonIconEnum } from '@/enums';
import { SyncGameModal } from './components';
import { useBoolean } from '@/hooks';

defineOptions({
  name: 'SyncGameModal',
});

const { bool: showSyncGameModal, setTrue: openSyncGameModal } = useBoolean();

function getGameList() {}
</script>

<style lang="scss" scoped></style>
