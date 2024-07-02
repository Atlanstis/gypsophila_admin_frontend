<template>
  <div>
    <NSpace reverse>
      <NButton>保存</NButton>
      <NButton @click="workbenchStore.setSettingDrawerShow(true)">设置</NButton>
    </NSpace>
    <NDrawer v-model:show="workbenchStore.settingDrawerShow" :width="360" placement="right">
      <NDrawerContent title="布局设置" closable>
        <ConfigForm ref="configFormRef" v-if="workbenchStore.settingDrawerShow" />
        <template #footer>
          <NButton type="primary" :loading="saveLoading" @click="onSave">保存</NButton>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script lang="ts" setup>
import { useWorkbenchStore } from '@/stores';
import { ref } from 'vue';
import ConfigForm from './components/config-form.vue';
defineOptions({
  name: 'ToolBar',
});

const workbenchStore = useWorkbenchStore();

const saveLoading = ref(false);

const configFormRef = ref<InstanceType<typeof ConfigForm>>();

async function onSave() {
  await configFormRef.value?.onValidate();
  const formModel = configFormRef.value?.formModel;
  if (formModel) {
    workbenchStore.updateLayoutConfig(formModel);
  }
}
</script>

<style lang="scss" scoped></style>
