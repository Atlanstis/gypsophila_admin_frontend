<template>
  <NSpace align="center" :style="style">
    <NNumberAnimation
      v-if="fromGold !== undefined"
      :from="0"
      :to="fromGold"
      :duration="1000"
      :showSeparator="true"
    />
    <template v-if="toGold !== undefined">
      <component :is="DiverIcon" />
      <NNumberAnimation :from="0" :to="toGold" :duration="1000" :showSeparator="true" />
    </template>
  </NSpace>
</template>

<script lang="ts" setup>
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { computed, defineComponent } from 'vue';

defineOptions({
  name: 'MhxyAccountGoldChange',
});

interface Props {
  fromGold?: number;
  toGold?: number;
}

const props = defineProps<Props>();

const { iconRender } = useIconRender();

const themeStore = useThemeStore();

const diff = computed(() => {
  if (!props.fromGold || !props.toGold) return undefined;
  return props.toGold - props.fromGold;
});

const DiverIcon = defineComponent({
  name: 'DiverIcon',
  render() {
    if (diff.value === undefined) return undefined;
    return iconRender({
      icon:
        diff.value > 0
          ? ButtonIconEnum.increase
          : diff.value < 0
          ? ButtonIconEnum.decrease
          : ButtonIconEnum.flat,
      fontSize: 16,
    });
  },
});

const style = computed(() => {
  if (diff.value === undefined) return { color: themeStore.otherColor.info };
  return {
    color:
      diff.value > 0
        ? themeStore.otherColor.success
        : diff.value < 0
        ? themeStore.otherColor.error
        : themeStore.otherColor.info,
  };
});
</script>

<style lang="scss" scoped></style>
