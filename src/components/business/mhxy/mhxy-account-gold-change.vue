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
      <FlatIcon />
      <NNumberAnimation :from="0" :to="toGold" :duration="1000" :showSeparator="true" />
      <template v-if="diff">
        (
        <NNumberAnimation :from="0" :to="diff" :duration="1000" :showSeparator="true" />
        <TrendIcon />
        )
      </template>
    </template>
  </NSpace>
</template>

<script lang="ts" setup>
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { computed, defineComponent, h } from 'vue';

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

const TrendIcon = defineComponent({
  name: 'TrendIcon',
  render() {
    if (diff.value === undefined) return undefined;
    return h(
      iconRender({
        icon:
          diff.value > 0
            ? ButtonIconEnum.increase
            : diff.value < 0
            ? ButtonIconEnum.decrease
            : ButtonIconEnum.flat,
        fontSize: 16,
      }),
    );
  },
});

const FlatIcon = defineComponent({
  name: 'FlatIcon',
  render() {
    return h(
      iconRender({
        icon: ButtonIconEnum.flat,
        fontSize: 16,
      }),
    );
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
