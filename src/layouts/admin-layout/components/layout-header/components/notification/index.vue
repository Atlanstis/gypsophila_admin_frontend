<template>
  <div class="h-full">
    <NPopover
      trigger="manual"
      :show="noticeStore.visible"
      style="width: 320px"
      :on-clickoutside="() => noticeStore.setVisible(false)"
    >
      <template #trigger>
        <HoverContainer class="h-full p-x-12px" @click="noticeStore.setVisible(true)">
          <NBadge :show="!!noticeStore.totalCount" dot>
            <IconTdesignNotification class="text-16px" />
          </NBadge>
        </HoverContainer>
      </template>
      <NTabs v-model:value="active" type="line" animated>
        <NTabPane name="todo" :tab="`待办(${noticeStore.todoCount})`">
          <TodoTab :list="noticeStore.todos" />
        </NTabPane>
        <NTabPane name="message" :tab="`消息(${noticeStore.messageCount})`">
          <MessageTab />
        </NTabPane>
      </NTabs>
    </NPopover>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { MessageTab, TodoTab } from './components';
import { useNoticeStore } from '@/stores';

defineOptions({
  name: 'NotificationIcon',
});

const active = ref<string>('todo');

const noticeStore = useNoticeStore();

onMounted(() => {
  noticeStore.getNoticePolymeric();
});
</script>

<style lang="scss" scoped></style>
