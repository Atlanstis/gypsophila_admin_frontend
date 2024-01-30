<template>
  <NCard
    v-if="list.length > 0"
    title="收藏列表"
    :segmented="{
      content: true,
    }"
  >
    <NSpace>
      <div class="w-60px h-60px cursor-pointer" v-for="info of list" :key="info.id">
        <NPopover trigger="hover">
          <template #trigger>
            <NImage
              class="w-full h-full rd-10px"
              :src="info.game.thumbnail"
              :lazy="true"
              preview-disabled
            >
              <template #placeholder>
                <PlaystationLoading />
              </template>
            </NImage>
          </template>
          <span>{{ info.game.originName }}</span>
        </NPopover>
      </div>
    </NSpace>
  </NCard>
</template>

<script lang="ts" setup>
import { psnGameFavorList } from '@/service';
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'GameFavorList',
});

defineExpose({ getFavorList });

const list = ref<ApiPsn.ProfileGame[]>([]);

async function getFavorList() {
  const { error, data } = await psnGameFavorList();
  if (!error) {
    list.value = data;
  }
}

onMounted(() => {
  getFavorList();
});
</script>

<style lang="scss" scoped></style>
