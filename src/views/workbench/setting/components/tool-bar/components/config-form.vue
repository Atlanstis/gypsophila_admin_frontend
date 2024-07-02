<template>
  <NForm ref="formRef" :model="formModel">
    <NFormItem
      v-for="item of fields"
      :key="item.key"
      :path="item.key"
      :label="`${item.text}`"
      :rule="item.rules"
    >
      <NInputNumber
        v-model:value="formModel[item.key]"
        class="w-full"
        :step="1"
        :precision="0"
        :min="item.min"
        :max="item.max"
      />
    </NFormItem>
  </NForm>
</template>

<script lang="ts" setup>
import type { SettingFormModel } from '@/typings';
import type { FormInst, FormItemRule } from 'naive-ui';
import { useWorkbenchStore } from '@/stores';
import { reactive, onMounted, ref } from 'vue';

defineOptions({
  name: 'ConfigForm',
});

const formRef = ref<FormInst | null>(null);

const workbenchStore = useWorkbenchStore();
const {
  layoutConfig,
  layoutConfig: { limit },
} = workbenchStore;

const formModel = reactive<SettingFormModel>({});

const textMap = {
  cellHeight: '单元格高度',
  columns: '列数',
  rows: '行数',
  columnGap: '列间距',
  rowGap: '行间距',
};

const fields: {
  key: keyof SettingFormModel;
  text: string;
  rules: FormItemRule[];
  min: number;
  max: number;
}[] = [
  {
    key: 'columns',
    text: textMap.columns,
    rules: [
      { required: true, type: 'number', message: `请输入${textMap.columns}`, trigger: 'blur' },
    ],
    min: limit.columns[0],
    max: limit.columns[1],
  },
  {
    key: 'columnGap',
    text: textMap.columnGap,
    rules: [
      { required: true, type: 'number', message: `请输入${textMap.columnGap}`, trigger: 'blur' },
    ],
    min: limit.gaps[0],
    max: limit.gaps[1],
  },
  {
    key: 'rows',
    text: textMap.rows,
    rules: [{ required: true, type: 'number', message: `请输入${textMap.rows}`, trigger: 'blur' }],
    min: limit.rows[0],
    max: limit.rows[1],
  },
  {
    key: 'rowGap',
    text: textMap.rowGap,
    rules: [
      { required: true, type: 'number', message: `请输入${textMap.rowGap}`, trigger: 'blur' },
    ],
    min: limit.gaps[0],
    max: limit.gaps[1],
  },
  {
    key: 'cellHeight',
    text: textMap.cellHeight,
    rules: [
      { required: true, type: 'number', message: `请输入${textMap.cellHeight}`, trigger: 'blur' },
    ],
    min: limit.cellHeight[0],
    max: limit.cellHeight[1],
  },
];

function initForm() {
  Object.assign(formModel, {
    cellHeight: layoutConfig.cellHeight,
    columns: layoutConfig.columns,
    rows: layoutConfig.rows,
    columnGap: layoutConfig.gaps[0],
    rowGap: layoutConfig.gaps[1],
  });
}

async function onValidate() {
  await formRef.value?.validate();
}

defineExpose({
  onValidate,
  formModel,
});

onMounted(() => {
  initForm();
});
</script>

<style lang="scss" scoped></style>
