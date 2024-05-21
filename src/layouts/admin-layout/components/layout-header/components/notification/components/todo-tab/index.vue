<template>
  <div class="h-180px">
    <div v-if="list.length" class="h-full">
      <ScrollContainer>
        <div v-for="item in list" :key="item.id">
          <HoverContainer class="p-x-10px">
            <CardMhxyTransfer
              v-if="item.category === EnumNoticeCategory.MhxyTransfer"
              :notice="item"
            ></CardMhxyTransfer>
          </HoverContainer>
        </div>
      </ScrollContainer>
    </div>
    <div v-else class="h-full flex-center">
      <IconLocalNoData class="text-60px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EnumNoticeCategory, type Notice } from '@/typings';
import { CardMhxyTransfer } from './components';

defineOptions({
  name: 'TodoTab',
});

defineProps<{
  list: Notice[];
}>();
</script>

<style lang="scss" scoped></style>
