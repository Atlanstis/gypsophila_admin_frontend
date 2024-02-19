<template>
  <NCard
    title="攻略信息"
    :segmented="{
      content: true,
    }"
  >
    <template #header-extra>
      <PopoverBtn :msg="'新增'" :icon="ButtonIconEnum.add" @click="onAddGuide"></PopoverBtn>
    </template>
    <NDataTable striped :loading="loading" :columns="columns" :data="tableData">
      <template #loading>
        <PlaystationLoading />
      </template>
    </NDataTable>
    <GuideModal
      v-model:visible="visible"
      :type="modalType"
      :ppgId="ppgId"
      :edit-data="editData"
      @on-success="getList"
    ></GuideModal>
  </NCard>
</template>

<script lang="ts" setup>
import { ButtonIconEnum } from '@/enums';
import { onMounted } from 'vue';
import { PopoverBtn } from '@/components';
import { GuideModal } from './components';
import { useGuideModal } from './hooks';
import { useGudieTable } from './hooks/use-guide-table';
import { psnProfileGameGuideDelete } from '@/service';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'GuideInfo',
});

const props = defineProps<{ ppgId: ApiPsn.ProfileGame['id'] }>();

const { visible, openModal, modalType, setModalType, editData, setEditData } = useGuideModal();
const { loading, tableData, columns, getPsnProfileGameGuideList } = useGudieTable(
  onEditGuide,
  onDeleteGuide,
);

function onAddGuide() {
  setModalType('add');
  openModal();
}

function onEditGuide(row: ApiPsn.ProfileGameGuide) {
  setModalType('edit');
  setEditData(row);
  openModal();
}

async function onDeleteGuide(id: ApiPsn.ProfileGameGuide['id']) {
  const { error } = await psnProfileGameGuideDelete(id, props.ppgId);
  if (!error) {
    window.$message?.success(`删除成功`, { duration: DEFAULT_MESSAGE_DURATION });
    getList();
  }
}

function getList() {
  getPsnProfileGameGuideList(props.ppgId);
}

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped></style>
