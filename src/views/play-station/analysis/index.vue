<template>
  <ScrollContainer>
    <NSpace vertical>
      <TopCard :detail="detail" :loading="loading" />
      <Transition :name="'zoom-fade'" mode="out-in" :appear="false">
        <RankCard v-if="!loading" :id="Number(id)" />
      </Transition>
      <Transition :name="'zoom-fade'" mode="out-in" :appear="false">
        <TrophyCard v-if="!loading" :trophy-group="detail?.trophyGroup" />
      </Transition>
      <TopicCard v-if="!loading" :id="Number(id)" />
      <NBackTop :right="40" :bottom="50" class="z-999" />
    </NSpace>
  </ScrollContainer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { psnineGameDetail } from '@/service';
import { useBoolean } from '@/hooks';
import { TopCard, TrophyCard, TopicCard, RankCard } from './components';
import { useAppStore } from '@/stores';

defineOptions({
  name: 'PlayStationAnalysisView',
});

const route = useRoute();
const appStore = useAppStore();

const { id } = route.params;

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const detail = ref<Psnine.GameDetail | null>(null);

async function getDetail(id: number) {
  startLoading();
  const { error, data } = await psnineGameDetail(id);
  if (!error) {
    appStore.updateWebsiteTitle(`${data.name}-${route.meta.title}`);
    detail.value = data;
    endLoading();
  }
}

onMounted(() => {
  getDetail(Number(id));
});
</script>

<style lang="scss" scoped></style>
