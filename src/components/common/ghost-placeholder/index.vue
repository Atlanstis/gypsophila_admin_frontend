<template>
  <div>
    <div class="box">
      <div class="box__ghost">
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>
        <div class="symbol"></div>

        <div class="box__ghost-container">
          <div class="box__ghost-eyes" :style="eyesCss">
            <div class="box__eye-left"></div>
            <div class="box__eye-right"></div>
          </div>
          <div class="box__ghost-bottom">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="box__ghost-shadow"></div>
      </div>
      <div class="box__description">
        <div class="box__description-container">
          <div class="box__description-title">Whoops!</div>
          <div class="box__description-text">{{ text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMouse } from '@vueuse/core';
import { useWindowSize } from '@vueuse/core';
import { computed } from 'vue';

defineOptions({
  name: 'GhostPlaceholder',
});

interface Props {
  text: string;
}

withDefaults(defineProps<Props>(), {
  text: '暂无数据',
});

const { width: pageX, height: pageY } = useWindowSize();
const { x, y } = useMouse();

const eyesCss = computed(() => {
  let mouseY = y.value;
  let mouseX = x.value / -pageX.value;

  const yAxis = ((pageY.value / 2 - mouseY) / pageY.value) * 300;
  const xAxis = -mouseX * 100 - 100;

  return {
    transform: 'translate(' + xAxis + '%,-' + yAxis + '%)',
  };
});
</script>

<style lang="scss" scoped>
.box {
  width: 300px;
  height: 300px;
  background: #fff;
  border-radius: 20px;
  position: relative;

  .box__ghost {
    padding: 15px 25px 25px;
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -30%);

    .symbol {
      &:nth-child(1) {
        opacity: 0.2;
        animation: shine 4s ease-in-out 3s infinite;

        &:before,
        &:after {
          content: '';
          width: 12px;
          height: 4px;
          background: rgba(var(--primary-color), 1);
          position: absolute;
          border-radius: 5px;
          bottom: 65px;
          left: 0;
        }
        &:before {
          transform: rotate(45deg);
        }
        &:after {
          transform: rotate(-45deg);
        }
      }
      &:nth-child(2) {
        position: absolute;
        left: -5px;
        top: 30px;
        height: 18px;
        width: 18px;
        border: 4px solid;
        border-radius: 50%;
        border-color: rgba(var(--primary-color), 1);
        opacity: 0.2;
        animation: shine 4s ease-in-out 1.3s infinite;
      }
      &:nth-child(3) {
        opacity: 0.2;
        animation: shine 3s ease-in-out 0.5s infinite;

        &:before,
        &:after {
          content: '';
          width: 12px;
          height: 4px;
          background: rgba(var(--primary-color), 1);
          position: absolute;
          border-radius: 5px;
          top: 5px;
          left: 40px;
        }
        &:before {
          transform: rotate(90deg);
        }
        &:after {
          transform: rotate(180deg);
        }
      }
      &:nth-child(4) {
        opacity: 0.2;
        animation: shine 6s ease-in-out 1.6s infinite;

        &:before,
        &:after {
          content: '';
          width: 15px;
          height: 4px;
          background: rgba(var(--primary-color), 1);
          position: absolute;
          border-radius: 5px;
          top: 10px;
          right: 30px;
        }
        &:before {
          transform: rotate(45deg);
        }
        &:after {
          transform: rotate(-45deg);
        }
      }
      &:nth-child(5) {
        position: absolute;
        right: 5px;
        top: 40px;
        height: 12px;
        width: 12px;
        border: 3px solid;
        border-radius: 50%;
        border-color: rgba(var(--primary-color), 1);
        opacity: 0.2;
        animation: shine 1.7s ease-in-out 7s infinite;
      }
      &:nth-child(6) {
        opacity: 0.2;
        animation: shine 2s ease-in-out 6s infinite;

        &:before,
        &:after {
          content: '';
          width: 15px;
          height: 4px;
          background: rgba(var(--primary-color), 1);
          position: absolute;
          border-radius: 5px;
          bottom: 65px;
          right: -5px;
        }
        &:before {
          transform: rotate(90deg);
        }
        &:after {
          transform: rotate(180deg);
        }
      }
    }

    .box__ghost-container {
      background: rgba(var(--primary-color), 1);
      width: 100px;
      height: 100px;
      border-radius: 100px 100px 0 0;
      position: relative;
      margin: 0 auto;
      animation: upndown 3s ease-in-out infinite;

      .box__ghost-eyes {
        position: absolute;
        left: 50%;
        top: 45%;
        transform: translate(-50%, -45%);
        height: 12px;
        width: 70px;

        .box__eye-left {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          margin: 0 10px;
          position: absolute;
          left: 0;
        }
        .box__eye-right {
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          margin: 0 10px;
          position: absolute;
          right: 0;
        }
      }

      .box__ghost-bottom {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;

        div {
          flex-grow: 1;
          position: relative;
          top: -10px;
          height: 20px;
          border-radius: 100%;
          background-color: rgba(var(--primary-color), 1);

          &:nth-child(2n) {
            top: -12px;
            margin: 0 -0px;
            border-top: 15px solid #fff;
            background: transparent;
          }
        }
      }
    }

    .box__ghost-shadow {
      height: 20px;
      box-shadow: 0 50px 15px 10px rgba(var(--primary-color), 1);
      border-radius: 50%;
      margin: 0 auto;
      animation: smallnbig 3s ease-in-out infinite;
    }
  }

  .box__description {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);

    .box__description-container {
      color: rgba(var(--primary-color), 1);
      text-align: center;
      width: 200px;
      font-size: 16px;
      margin: 0 auto;

      .box__description-title {
        font-size: 20px;
        letter-spacing: 0.5px;
        color: #fff;
      }

      .box__description-text {
        color: rgba(var(--primary-color), 1);
        line-height: 20px;
        margin-top: 20px;
      }
    }
  }
}

@keyframes upndown {
  0% {
    transform: translateY(5px);
  }
  50% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(5px);
  }
}
@keyframes smallnbig {
  0% {
    width: 90px;
  }
  50% {
    width: 100px;
  }
  100% {
    width: 90px;
  }
}
@keyframes shine {
  0% {
    opacity: 0.2;
  }
  25% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
