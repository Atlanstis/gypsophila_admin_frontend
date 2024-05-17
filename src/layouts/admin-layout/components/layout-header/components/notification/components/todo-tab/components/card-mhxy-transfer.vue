<template>
  <div class="h-60px w-full flex" @click="onTransferClick">
    <div class="w-36px flex-center">
      <NAvatar :src="roleImg" :size="36" color="transparent" round></NAvatar>
    </div>
    <div class="flex-1 m-l-8px flex flex-col justify-around border-b-1px border-#eee">
      <p class="font-bold text-ellipsis">{{ notice.title }}</p>
      <p class="text-ellipsis text-12px color-#999">
        道具种类：{{ notice.link.propCategory.name }}
      </p>
      <p></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mhxyRoleImgMap } from '@/assets';
import { EnumNoticeCategory, type Notice } from '@/typings';
import { computed } from 'vue';
import { useNoticeStore } from '@/stores';
defineOptions({
  name: 'CardMhxyTransfer',
});

const props = defineProps<{
  notice: Notice<EnumNoticeCategory.MhxyTransfer>;
}>();

const roleImg = computed(() => {
  return mhxyRoleImgMap[props.notice.link.account.role];
});

const noticeStore = useNoticeStore();

function onTransferClick() {
  noticeStore.onTodoHandle(props.notice);
}
</script>

<style lang="scss" scoped></style>
