<template>
  <NCard>
    <div v-if="loading" class="h-200px flex-center">
      <NSpin></NSpin>
    </div>
    <NTabs v-else-if="tabs.length" v-model:value="activeTab" type="line" animated>
      <NTabPane v-for="tab of tabs" :key="tab.key" :name="tab.key" :tab="tab.name">
        <component :is="tab.component" />
      </NTabPane>
    </NTabs>
    <NSpace v-else justify="center" align="center">
      <GhostPlaceholder type="auth" />
    </NSpace>
  </NCard>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef } from 'vue';
import { useBoolean } from '@/hooks';
import { WebsiteSetting } from './components';
import { settingCommonTabs } from './api';

defineOptions({
  name: 'SettingCommonView',
});

interface TabOption {
  key: string;
  name: string;
  component: Common.Component;
}

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const activeTab = ref<string>('');

const componentMap: Record<string, Common.Component> = {
  WebsiteSetting,
};

const tabs = shallowRef<TabOption[]>([]);

async function getTabs() {
  startLoading();
  const { data, error } = await settingCommonTabs();
  if (error) return;
  tabs.value = data
    .filter((item) => componentMap[item.key])
    .map((item) => ({
      key: item.key,
      name: item.name,
      component: componentMap[item.key],
    }));
  if (tabs.value.length) {
    activeTab.value = tabs.value[0].key;
  }
  endLoading();
}

onMounted(() => {
  getTabs();
});
</script>

<style lang="scss" scoped></style>
