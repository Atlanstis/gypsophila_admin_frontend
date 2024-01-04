<template>
  <NCard
    title="排行(TOP 20)"
    :segmented="{
      content: true,
    }"
  >
    <template #header-extra>
      <PopoverBtn :msg="'查看更多'" icon="ri:more-line" @click="watchRankMore"></PopoverBtn>
    </template>
    <div v-if="loading" class="flex flex-center h-240px">
      <PlaystationLoading />
    </div>
    <div v-if="!loading" ref="chartRef" class="h-240px"></div>
  </NCard>
</template>

<script lang="ts" setup>
import { useEcharts, type ECOption, useRouterPush } from '@/composables';
import { ref, onMounted } from 'vue';
import { psnineGameRank } from '@/service';
import { useBoolean } from '@/hooks';
import { nextTick } from 'vue';

defineOptions({
  name: 'RankCard',
});

type Props = {
  id: number | null;
};

const props = withDefaults(defineProps<Props>(), {
  id: null,
});

const { toOutsideUrl } = useRouterPush(true);

function watchRankMore() {
  toOutsideUrl(`https://psnine.com/psngame/${props.id}/rank`);
}

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

/** 转换秒数显示 */
function transformSecords(second: number) {
  const strFun = (second: number, item: number, i: number) =>
    (second / item).toFixed(1) + labelArr[i];
  const arr = [1, 60, 3600, 24 * 3600];
  const labelArr = ['秒', '分钟', '小时', '天'];
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (i < arr.length - 1) {
      if (second >= item && second < arr[i + 1]) {
        str = strFun(second, item, i);
        break;
      }
    } else {
      str = strFun(second, item, i);
    }
  }

  return str;
}

/** 获取图表配置 */
function getChartOptions(list: Psnine.GameRank[]) {
  list = list.filter((item) => item.usedTime);
  const indexArr = list.map((item) => item.index);
  const secordArr = list.map((item) => item.usedSecords);
  const chartOptions = ref<ECOption>({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
          formatter: function ({ value, axisDimension }) {
            console.log(value);
            if (axisDimension === 'x') {
              return `次序：${value}`;
            } else {
              return transformSecords(value as number);
            }
          },
        },
      },
      formatter: function (params) {
        const { dataIndex, marker } = Array.isArray(params) ? params[0] : params;
        const activeRank = list[dataIndex];
        return `
          次序：${activeRank.index}<br/>
          ${marker} 所用时间：${activeRank.usedTime}<br/>
          ${marker} 完成率：${activeRank.completionRate}%<br>
          ${marker} 完成时间：${activeRank.completionTime}
        `;
      },
    },
    grid: {
      top: '3%',
      left: '2%',
      right: '2%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: indexArr,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return transformSecords(value);
          },
        },
      },
    ],
    series: [
      {
        color: '#8e9dff',
        name: '所用时间',
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.25,
                color: '#8e9dff',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ],
          },
        },
        emphasis: {
          focus: 'series',
        },
        data: secordArr,
      },
    ],
  });
  return chartOptions;
}

const chartRef = ref<HTMLElement>();

async function getData() {
  if (!props.id) return;
  startLoading();
  const { data, error } = await psnineGameRank(props.id);
  endLoading();
  if (!error) {
    const chartOptions = getChartOptions(data.list);
    const { init } = useEcharts(chartOptions);
    nextTick(() => {
      if (chartRef.value) {
        init(chartRef.value);
      }
    });
  }
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped></style>
