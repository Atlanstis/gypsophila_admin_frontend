<template>
  <NCard>
    <div v-if="loading" class="h-200px flex-center">
      <NSpin></NSpin>
    </div>
    <NTabs v-else-if="tabs.length" v-model:value="activeTab" type="line" animated>
      <NTabPane v-for="tab of tabs" :key="tab.name" :name="tab.name" :tab="tab.label">
        <component :is="tab.component" />
      </NTabPane>
    </NTabs>
    <n-result v-else>
      <template #icon>
        <div class="h-200px flex-center flex-col">
          <icon-iconamoon-unavailable-bold class="color-primary text-60px" />
          <div class="m-t-20px">暂无配置的权限</div>
        </div>
      </template>
    </n-result>
  </NCard>
</template>

<script lang="ts" setup>
import { WebsiteSetting } from './components';
import { ref, onMounted, computed } from 'vue';
import { settingCommonTabs } from '@/service';
import { useBoolean } from '@/hooks';

defineOptions({
  name: 'SettingCommonView',
});

interface TabOption {
  name: string;
  label: string;
  component: Common.Component;
}

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

const activeTab = ref<string>('');

const totalTabs: TabOption[] = [
  {
    name: 'WebsiteSetting',
    label: '网站设置',
    component: WebsiteSetting,
  },
];

const showTabArr = ref<string[]>([]);

const tabs = computed(() => {
  return totalTabs.filter((tab) => {
    return showTabArr.value.includes(tab.name);
  });
});

async function getTabs() {
  startLoading();
  const { data, error } = await settingCommonTabs();
  if (!error) {
    showTabArr.value = data;
    activeTab.value = data.length ? data[0] : '';
  }
  endLoading();
}

onMounted(() => {
  getTabs();
});
</script>

<style lang="scss" scoped></style>
