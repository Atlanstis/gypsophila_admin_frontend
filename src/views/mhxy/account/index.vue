<template>
  <div>
    <TableContainer>
      <template #header>
        <NSpace class="pb-12px" justify="space-between">
          <NButton type="primary" @click="onAccountAdd">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </NButton>
          <NButton type="primary" @click="openGroupManageModal">
            <IconMingcuteSettings6Line class="mr-4px text-20px" />
            分组管理
          </NButton>
        </NSpace>
      </template>
      <template #content>
        <NDataTable
          flex-height
          striped
          remote
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
        ></NDataTable>
      </template>
    </TableContainer>
    <AccountModal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      :account-roles="accountRoles"
      :account-sects="accountSects"
      @on-success="getTableData"
    ></AccountModal>
    <AccountGroupModal v-model:visible="groupManageVisible"></AccountGroupModal>
  </div>
</template>

<script lang="ts" setup>
import { mhxyAccountDelete, mhxyAccountRole, mhxyAccountSect } from '@/service';
import { AccountModal, AccountGroupModal } from './components';
import { useAccountGroupModal, useAccountModal, useAccountTable } from './hooks';
import { onMounted, ref } from 'vue';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

defineOptions({
  name: 'MhxyAccountView',
});

const accountRoles = ref<ApiMhxy.AccountRole[]>([]);
const accountSects = ref<ApiMhxy.AccountSect[]>([]);

const { loading, pagination, tableData, columns, getTableData } = useAccountTable(
  accountSects,
  onAccountEdit,
  onAccountDelete,
);
const { modalType, visible, openModal, setModalType, setEditData, editData } = useAccountModal();
const { groupManageVisible, openGroupManageModal } = useAccountGroupModal();

function onAccountAdd() {
  setModalType('add');
  openModal();
}

async function getAccountRole() {
  const { data, error } = await mhxyAccountRole();
  if (!error) {
    accountRoles.value = data;
  }
}

async function getAccountSect() {
  const { data, error } = await mhxyAccountSect();
  if (!error) {
    accountSects.value = data;
  }
}

function onAccountEdit(data: ApiMhxy.Account) {
  setEditData(data);
  setModalType('edit');
  openModal();
}

async function onAccountDelete(record: ApiMhxy.Account) {
  const { error } = await mhxyAccountDelete(record.id);
  if (!error) {
    window.$message?.success('删除成功', { duration: DEFAULT_MESSAGE_DURATION });
    getTableData();
  }
}

onMounted(() => {
  getAccountRole();
  getAccountSect();
  getTableData();
});
</script>

<style lang="scss" scoped></style>
