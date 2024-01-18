<template>
  <NCard>
    <NTabs v-model:value="activeTab" type="line" animated>
      <NTabPane v-for="tab of tabs" :key="tab.name" :name="tab.name" :tab="tab.label">
        <component :is="tab.component" />
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<script lang="ts" setup>
import { WebsiteSetting } from './components';
import { ref, shallowRef } from 'vue';

defineOptions({
  name: 'SettingCommonView',
});

interface TabOption {
  name: string;
  label: string;
  component: Common.Component;
}

const WEBSITE_SETTING = 'websiteSetting';

const activeTab = ref<string>(WEBSITE_SETTING);

const tabs = shallowRef<TabOption[]>([
  {
    name: WEBSITE_SETTING,
    label: '网站设置',
    component: WebsiteSetting,
  },
]);
</script>

<style lang="scss" scoped></style>
