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
    <div>
      <div v-if="loading" class="flex flex-center h-200px">
        <PlaystationLoading />
      </div>
      <template v-else>
        <div v-if="!gameList.length" class="flex-center">
          <GhostPlaceholder :text="'暂无游戏'" />
        </div>
        <NGrid v-else cols="1 540:2 800:3 1200:4" x-gap="16" y-gap="16" item-responsive>
          <NGridItem v-for="(info, i) of gameList" :key="info.id">
            <GameCard :info="info" :i="i" @refresh="onGameRefresh" />
          </NGridItem>
        </NGrid>
        <div class="m-t-20px flex justify-center">
          <n-pagination
            v-model:page="pagination.page"
            :item-count="pagination.itemCount"
            :page-size="pagination.pageSize"
            :on-update:page="onPageChange"
          />
        </div>
      </template>
    </div>
    <SyncGameModal v-model:visible="showSyncGameModal" @on-sync="onRefreshInfo" />
  </NCard>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ButtonIconEnum } from '@/enums';
import { SyncGameModal } from './components';
import { useBoolean, usePaginationWithDefinePageSize } from '@/hooks';
import { psnGameSynchronized } from '@/service';
import { NGridItem } from 'naive-ui';
import { GameCard } from '..';

defineOptions({
  name: 'GameList',
});

const emit = defineEmits<{ (e: 'on-refresh'): void }>();

const { bool: showSyncGameModal, setTrue: openSyncGameModal } = useBoolean(false);
const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);
const { pagination, getPageParams, setItemCount, onPageChange } = usePaginationWithDefinePageSize(
  getGameList,
  12,
);

const gameList = ref<ApiPsn.ProfileGame[]>([]);

async function getGameList() {
  startLoading();
  const { page } = getPageParams();
  const { error, data } = await psnGameSynchronized(page);
  if (!error) {
    gameList.value = data.list;
    setItemCount(data.total);
  }
  endLoading();
}

function onGameRefresh(i: number) {
  gameList.value[i].isFavor = !gameList.value[i].isFavor;
}

/** 刷新游戏列表及个人信息 */
function onRefreshInfo() {
  getGameList();
  emit('on-refresh');
}

onMounted(() => {
  getGameList();
});
</script>

<style lang="scss" scoped></style>
