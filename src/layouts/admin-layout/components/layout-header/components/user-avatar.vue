<template>
  <NDropdown :options="options" @select="handleDropdown">
    <template v-if="userInfo">
      <hover-container class="px-12px">
        <NAvatar v-if="!userInfo.avatar" class="w-32px h-32px b-rd-3px">
          {{ userInfo.nickname }}
        </NAvatar>
        <NImage v-else :src="userInfo.avatar" class="w-32px h-32px b-rd-3px" preview-disabled />
        <span class="pl-8px text-16px font-medium">{{ userInfo.nickname }}</span>
      </hover-container>
    </template>
  </NDropdown>
</template>

<script lang="ts" setup>
import { type DropdownOption } from 'naive-ui';
import { useIconRender } from '@/composables';
import { useAuthStore } from '@/stores';
import { authLogout } from '@/service';

defineOptions({
  name: 'UserAvatar',
});

const { iconRender } = useIconRender();
const auth = useAuthStore();

const userInfo = auth.userInfo;

enum DropKey {
  logout = 'logout',
}

const options: DropdownOption[] = [
  {
    label: '退出登录',
    key: DropKey.logout,
    icon: iconRender({ icon: 'carbon:logout' }),
  },
];

function handleDropdown(key: string) {
  if (key === DropKey.logout) {
    window.$dialog?.info({
      title: '确认',
      content: '确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        const { error } = await authLogout();
        if (!error) {
          auth.resetAuthStore();
        }
      },
    });
  }
}
</script>

<style lang="scss" scoped></style>
